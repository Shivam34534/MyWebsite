import fs from 'fs'
import path from 'path'
import imagekit, { getImageKitUrl } from '../configs/imageKit.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import NodeCache from 'node-cache';
import Interaction from '../models/Interaction.js';

// Initialize cache with a 60-second standard TTL
const memoryCache = new NodeCache({ stdTTL: 60 });

// Add Post
export const addPost = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { content, post_type } = req.body;
        const images = req.files

        let image_urls = []

        // Check if files exist and is an array (multiple files) or object (single file)
        if (images) {
            // Convert to array if single file
            const filesArray = Array.isArray(images) ? images : [images];

            image_urls = await Promise.all(
                filesArray.map(async (image) => {
                    const isVideo = image.mimetype.startsWith('video/')
                    
                    // Strict 2MB check for images since overall multer allowed 20MB for videos
                    if (!isVideo && image.size > 2 * 1024 * 1024) {
                        throw new Error(`Image ${image.originalname} exceeds the 2MB size limit!`);
                    }

                    // Use buffer directly from multer's memory storage
                    if (process.env.IMAGEKIT_PRIVATE_KEY) {
                        const response = await imagekit.upload({
                            file: image.buffer,
                            fileName: image.originalname,
                            folder: "posts"
                        })

                        const url = getImageKitUrl(response, isVideo ? [
                                { height: '720' }, 
                                { quality: 'auto' }
                            ] : [
                                { quality: 'auto' },
                                { format: 'webp' },
                                { width: '400' }, 
                            ]);
                        return url;
                    } else {
                        const uploadsDir = path.resolve(process.cwd(), 'uploads', 'posts')
                        fs.mkdirSync(uploadsDir, { recursive: true })
                        const filename = `${Date.now()}_${image.originalname.replace(/\s+/g, '_')}`
                        const filepath = path.join(uploadsDir, filename)
                        fs.writeFileSync(filepath, image.buffer)
                        const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`
                        return `${baseUrl}/uploads/posts/${filename}`
                    }
                })
            )
        }

        await Post.create({
            user: userId,
            content,
            image_urls,
            post_type
        })

        // Flush the feed cache dynamically when a new post is successfully created!
        memoryCache.flushAll();

        res.json({ success: true, message: "Post created successfully" })

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Posts with Pagination
export const getFeedPosts = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const user = await User.findById(userId)

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Check cache precisely using the userId + page map
        const cacheKey = `feed_${userId}_page_${page}`;
        const cachedResults = memoryCache.get(cacheKey);
        
        if (cachedResults) {
            return res.json({ 
                success: true, 
                data: cachedResults.data,
                hasMore: cachedResults.hasMore
            });
        }

        //User's connections and followings
        const followingIds = user.following || [];
        const connectionIds = user.connections || [];
        const userIds = [userId, ...connectionIds, ...followingIds]

        // Find frequently interacted users (recent interactions by this user)
        const recentInteractions = await Interaction.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(30)
            .populate({ path: 'post', select: 'user' });
            
        const interactedAuthors = recentInteractions
            .filter(i => i.post && i.post.user) // safeguard against deleted posts
            .map(i => i.post.user.toString());
            
        const frequentlyInteractedUserIds = [...new Set(interactedAuthors)];

        const now = new Date();

        // Pipeline for Main Feed
        const pipeline = [
            { $match: { user: { $in: userIds } } },
            {
                $addFields: {
                    likes: { $size: { $ifNull: ["$likes_count", []] } },
                    comments: { $ifNull: ["$comments_count", 0] },
                    shares: { $ifNull: ["$shares_count", 0] },
                    views: { $ifNull: ["$views", 0] },
                    watchTime: { $ifNull: ["$watchTime", 0] },
                    isFollowing: { $in: ["$user", followingIds] },
                    isConnection: { $in: ["$user", connectionIds] },
                    isFrequentlyInteracted: { $in: ["$user", frequentlyInteractedUserIds] },
                    hoursSincePost: {
                        $max: [
                            1,
                            { $divide: [ { $subtract: [now, "$createdAt"] }, 1000 * 60 * 60 ] }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    baseScore: {
                        $add: [
                            { $multiply: ["$likes", 3] },
                            { $multiply: ["$comments", 5] },
                            { $multiply: ["$shares", 4] },
                            { $multiply: ["$watchTime", 0.05] }, // Boost: Higher watch time -> higher rank
                            { $cond: ["$isFollowing", 10, 0] },
                            { $cond: ["$isConnection", 15, 0] } // Mutual connections boost
                        ]
                    }
                }
            },
            {
                $addFields: {
                    boostedScore: {
                        $add: [
                            "$baseScore",
                            { $cond: ["$isFrequentlyInteracted", 20, 0] }, // Boost: frequently interacted
                            { $cond: [{ $gt: ["$baseScore", 30] }, 15, 0] } // Boost: trending posts
                        ]
                    }
                }
            },
            {
                $addFields: {
                    score: {
                        $multiply: ["$boostedScore", { $divide: [1, "$hoursSincePost"] }]
                    }
                }
            },
            { $sort: { score: -1, createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ];

        let posts = await Post.aggregate(pipeline);
        let fallbackTriggered = false;

        // Fallback: If no posts → return trending posts
        if (posts.length === 0 && page === 1) {
            fallbackTriggered = true;
            let cachedTrending = memoryCache.get('top_trending_posts');
            
            if (cachedTrending) {
                posts = cachedTrending.slice(skip, skip + limit);
            } else {
                let trendingPosts = await getAndCacheTrendingPosts();
                posts = trendingPosts.slice(skip, skip + limit);
            }
        }

        // Populate user data if not falling back to the cached array (which is already populated)
        if (!fallbackTriggered) {
             await Post.populate(posts, { path: 'user' });
        }

        const payload = {
            data: posts,
            hasMore: posts.length === limit
        };

        // Cache the newly retrieved MongoDB payload for future hits
        memoryCache.set(cacheKey, payload);

        res.json({ success: true, ...payload })

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Like Post
export const likePost = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { postId } = req.body;

        const post = await Post.findById(postId)

        if (post.likes_count.includes(userId)) {
            post.likes_count = post.likes_count.filter(user => user !== userId)
            await post.save()
            
            await Interaction.deleteOne({ user: userId, post: postId, type: 'like' });

            res.json({ success: true, message: "Post unliked" })
        } else {
            post.likes_count.push(userId)
            await post.save()
            
            await Interaction.updateOne(
                { user: userId, post: postId, type: 'like' },
                { $set: { updatedAt: new Date() } },
                { upsert: true }
            );

            // NOTIFICATION LOGIC: Create or Update
            if (post.user.toString() !== userId.toString()) {
                let notif = await Notification.findOne({
                    user: post.user,
                    post: postId,
                    type: 'like',
                    isRead: false 
                });

                if (notif) {
                    if (!notif.senders.includes(userId)) {
                        notif.senders.push(userId);
                        notif.sender = userId;
                        notif.updatedAt = new Date();
                        await notif.save();
                    }
                } else {
                    notif = await Notification.create({
                        user: post.user,
                        sender: userId,
                        senders: [userId],
                        post: postId,
                        type: 'like'
                    });
                }
                
                await notif.populate('sender', 'username profile_picture full_name');
                await notif.populate('post', 'content');
            }

            res.json({ success: true, message: "Post liked" })
        }

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Share Post
export const sharePost = async (req, res) => {
    try {
        const { postId } = req.body;

        const post = await Post.findByIdAndUpdate(postId, { $inc: { shares_count: 1 } }, { new: true })

        res.json({ success: true, message: "Post shared", data: post })

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Track Post View
export const trackView = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { postId, duration } = req.body;

        const existingInteraction = await Interaction.findOne({ user: userId, post: postId, type: 'view' });

        await Interaction.updateOne(
            { user: userId, post: postId, type: 'view' },
            { 
               $set: { updatedAt: new Date() },
               $inc: { duration: duration || 0 }
            },
            { upsert: true }
        );

        const updatePostFields = { $inc: { watchTime: duration || 0 } };
        // Determine unique view
        if (!existingInteraction) {
            updatePostFields.$inc.views = 1;
        }

        await Post.findByIdAndUpdate(postId, updatePostFields);

        res.json({ success: true, message: "View tracked successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Trending Posts Core Logic Helper
const getAndCacheTrendingPosts = async () => {
    const now = new Date();
    const trendingPipeline = [
        {
            $addFields: {
                likes: { $size: { $ifNull: ["$likes_count", []] } },
                comments: { $ifNull: ["$comments_count", 0] },
                shares: { $ifNull: ["$shares_count", 0] },
                views: { $ifNull: ["$views", 0] },
                watchTime: { $ifNull: ["$watchTime", 0] },
                hoursSincePost: {
                    $max: [
                        1,
                        { $divide: [ { $subtract: [now, "$createdAt"] }, 1000 * 60 * 60 ] }
                    ]
                }
            }
        },
        {
            $addFields: {
                baseScore: {
                    $add: [
                        { $multiply: ["$likes", 3] },
                        { $multiply: ["$comments", 5] },
                        { $multiply: ["$shares", 4] },
                        { $multiply: ["$watchTime", 0.05] } // Trending also respects watchtime heavily
                    ]
                }
            }
        },
        {
            $addFields: {
                score: {
                    $multiply: ["$baseScore", { $divide: [1, "$hoursSincePost"] }]
                }
            }
        },
        { $sort: { score: -1, createdAt: -1 } },
        { $limit: 100 }
    ];
    
    let trendingPosts = await Post.aggregate(trendingPipeline);
    await Post.populate(trendingPosts, { path: 'user' });
    
    memoryCache.set('top_trending_posts', trendingPosts, 300);
    return trendingPosts;
};

// GET Trending Posts API
export const getTrendingPosts = async (req, res) => {
    try {
        let cachedTrending = memoryCache.get('top_trending_posts');
        
        if (cachedTrending) {
            return res.json({ success: true, data: cachedTrending });
        }
        
        const trendingPosts = await getAndCacheTrendingPosts();
        
        res.json({ success: true, data: trendingPosts });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}