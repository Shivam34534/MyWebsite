import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import React, { use, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../../api/axios'
import { useUser, useAuth } from '../../mockClerk'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'
import PostLikesList from './PostLikesList'
import PostCommentsList from './PostCommentsList'


const PostCard = ({ post }) => {
    // Shield against orphaned database payloads
    if (!post || !post.user) return null;

    const postWithHashtags = post.content?.replace(/(#\w+)/g,
        '<span class="text-indigo-600 font-medium">$1</span>') || ''

    const [likes, setLikes] = useState(post.likes_count || [])
    const [commentCount, setCommentCount] = useState(post.comments_count || 0)
    const [shareCount, setShareCount] = useState(post.shares_count || 0)
    const [showLikes, setShowLikes] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const currentUser = useSelector((state) => state.user.value)
    const { getToken } = useAuth()
    const navigate = useNavigate()

    const handleLike = async () => {
        try {
            const token = await getToken()
            const { data } = await api.post('/api/post/like', { postId: post._id }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                // Update likes locally
                if (likes.includes(currentUser._id)) {
                    setLikes(likes.filter(id => id !== currentUser._id))
                } else {
                    setLikes([...likes, currentUser._id])
                }
            }
        } catch (error) {
            console.error('Error liking post:', error)
            toast.error(error.response?.data?.message || 'Failed to like post')
        }
    }

    const handleShare = async () => {
        const shareData = {
            title: 'Check out this post on Aura!',
            text: post.content,
            url: window.location.origin
        }

        try {
            const token = await getToken()
            await api.post('/api/post/share', { postId: post._id }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setShareCount(prev => prev + 1)
        } catch (error) {
            console.error('Error incrementing share count:', error)
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
                toast.success('Shared successfully')
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            navigator.clipboard.writeText(shareData.url + ' ' + shareData.text)
            toast.success('Link copied to clipboard')
        }
    }

    return (
        <article className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-stone-200/40">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
                <div onClick={() => navigate('/profile/' + post.user._id)} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-10 h-10 rounded-full story-ring p-[1.5px]">
                        <div className="w-full h-full rounded-full border border-white overflow-hidden bg-stone-50">
                            <img 
                                className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                src={post.user.profile_picture || assets.sample_profile} 
                                onError={(e) => { e.target.src = assets.sample_profile }}
                                alt={post.user.username} 
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-headline font-bold text-sm leading-tight text-on-surface group-hover:text-primary transition-colors">{post.user.username}</h3>
                        <p className="text-[11px] text-on-surface-variant leading-tight">{post.location || 'Editorial Studio'}</p>
                    </div>
                </div>
                <button className="text-on-surface-variant hover:text-on-surface transition-colors p-2 hover:bg-surface-container-low rounded-full">
                    <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                </button>
            </div>

            {/* Media Canvas */}
            {post.image_urls && post.image_urls.length > 0 && (
                <div className="w-full aspect-square bg-surface-container overflow-hidden relative group">
                    <img 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer" 
                        src={post.image_urls[0]} 
                        alt="" 
                    />
                    {post.image_urls.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold tracking-widest uppercase">
                            Gallery 1 / {post.image_urls.length}
                        </div>
                    )}
                </div>
            )}

            {/* Post Actions & Content */}
            <div className="p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <button onClick={handleLike} className="transition-transform active:scale-90 flex items-center justify-center">
                            <span 
                                className={`material-symbols-outlined text-[28px] transition-all ${likes.includes(currentUser?._id) ? 'text-red-500' : 'text-on-surface-variant hover:text-red-500'}`} 
                                style={{ fontVariationSettings: `'FILL' ${likes.includes(currentUser?._id) ? 1 : 0}` }}
                            >
                                favorite
                            </span>
                        </button>
                        <button onClick={() => setShowComments(!showComments)} className="transition-transform active:scale-90 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[28px]">chat_bubble</span>
                        </button>
                        <button onClick={handleShare} className="transition-transform active:scale-90 flex items-center justify-center text-on-surface-variant hover:text-emerald-500 transition-colors">
                            <span className="material-symbols-outlined text-[28px]">send</span>
                        </button>
                    </div>
                    <button className="transition-transform active:scale-90 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[28px]">bookmark</span>
                    </button>
                </div>

                {/* Engagement Context */}
                <div className="flex flex-col gap-1.5">
                    <p onClick={() => setShowLikes(true)} className="text-sm font-extrabold cursor-pointer hover:underline text-on-surface">{likes.length.toLocaleString()} likes</p>
                    <div className="text-[14px] text-on-surface leading-relaxed">
                        <span onClick={() => navigate('/profile/' + post.user._id)} className="font-bold mr-2 cursor-pointer hover:text-primary transition-colors">{post.user.username}</span> 
                        <span className="whitespace-pre-wrap break-words text-on-surface font-medium" dangerouslySetInnerHTML={{ __html: postWithHashtags }} />
                    </div>
                </div>

                {/* Metadata & Footer */}
                <div className="flex flex-col gap-2 mt-1">
                    {commentCount > 0 && (
                        <button onClick={() => setShowComments(true)} className="text-on-surface-variant text-sm text-left hover:text-on-surface transition-colors font-medium">View all {commentCount} comments</button>
                    )}
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold opacity-60">
                        {moment(post.createdAt).fromNow()}
                    </span>
                </div>
            </div>

            {showLikes && <PostLikesList likes={likes} setShowLikes={setShowLikes} />}
            {showComments && <PostCommentsList postId={post._id} setShowComments={setShowComments} onCommentAdded={() => setCommentCount(prev => prev + 1)} />}
        </article>
    )
}

export default PostCard
