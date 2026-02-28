import { populate } from "dotenv";
import imagekit from "../configs/imageKit.js";
import Connection from "../models/Connection.js";
import User from "../models/User.js";
import fs from 'fs';
import path from 'path'
import Post from "../models/Post.js";
// import { inngest } from "../inngest/index.js";

//Get User Data using userId
export const getUserData = async (req, res) => {
    try {
        const { userId } = await req.auth(); // Updated to await req.auth()
        const user = await User.findById(userId)
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        res.json({ success: true, data: user })
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//Update User Data
export const updateUserData = async (req, res) => {
    try {
        const { userId } = await req.auth(); // Updated to await req.auth()
        let { username, bio, location, full_name } = req.body;

        const tempUser = await User.findById(userId)

        !username && (username = tempUser.username)

        if (tempUser.username !== username) {
            const user = await User.findOne({ username })
            if (user) {
                //we will not change the username if it is already taken
                username = tempUser.username
            }
        }

        const updateData = {
            username,
            bio,
            location,
            full_name
        }

        const profile = req.files?.profile?.[0]
        const cover = req.files?.cover?.[0]

        console.log('Files received:', {
            profile: profile ? profile.originalname : 'none',
            cover: cover ? cover.originalname : 'none'
        });

        if (profile) {
            console.log('Processing profile picture...');
            const buffer = profile.buffer || fs.readFileSync(profile.path)
            if (process.env.IMAGEKIT_PRIVATE_KEY) {
                const response = await imagekit.upload({
                    file: buffer,
                    fileName: profile.originalname,
                    folder: '/profile-pictures'
                })

                console.log('ImageKit upload response:', response);

                const url = imagekit.url({
                    path: response.filePath,
                    transformation: [
                        { quality: 'auto' },
                        { format: 'webp' },
                        { width: '512' },
                    ]
                })
                console.log('Generated ImageKit URL:', url);
                updateData.profile_picture = url;
            } else {
                const uploadsDir = path.resolve(process.cwd(), 'uploads', 'profiles')
                fs.mkdirSync(uploadsDir, { recursive: true })
                const filename = `${Date.now()}_${profile.originalname.replace(/\s+/g, '_')}`
                const filepath = path.join(uploadsDir, filename)
                fs.writeFileSync(filepath, buffer)
                const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`
                updateData.profile_picture = `${baseUrl}/uploads/profiles/${filename}`
            }

            // Clean up the temporary file if it exists (not using memoryStorage)
            if (profile.path && fs.existsSync(profile.path)) {
                fs.unlinkSync(profile.path);
            }
        } // Closes if (profile)

        if (cover) {
            console.log('Processing cover picture...');
            const buffer = cover.buffer || fs.readFileSync(cover.path)
            if (process.env.IMAGEKIT_PRIVATE_KEY) {
                const response = await imagekit.upload({
                    file: buffer,
                    fileName: cover.originalname,
                    folder: '/cover-pictures'
                })

                console.log('ImageKit upload response:', response);

                const url = imagekit.url({
                    path: response.filePath,
                    transformation: [
                        { quality: 'auto' },
                        { format: 'webp' },
                        { width: '1280' },
                    ]
                })
                console.log('Generated ImageKit URL:', url);
                updateData.cover_picture = url;
            } else {
                const uploadsDir = path.resolve(process.cwd(), 'uploads', 'covers')
                fs.mkdirSync(uploadsDir, { recursive: true })
                const filename = `${Date.now()}_${cover.originalname.replace(/\s+/g, '_')}`
                const filepath = path.join(uploadsDir, filename)
                fs.writeFileSync(filepath, buffer)
                const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`
                updateData.cover_picture = `${baseUrl}/uploads/covers/${filename}`
            }

            // Clean up the temporary file if it exists (not using memoryStorage)
            if (cover.path && fs.existsSync(cover.path)) {
                fs.unlinkSync(cover.path);
            }
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).exec()

        res.json({ success: true, user, message: 'Profile updated successfully' })

    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//Find Users using username,email,location,name
export const discoverUsers = async (req, res) => {
    try {
        const { userId } = await req.auth(); // Updated to apply await
        const input = req.body.input || '';

        const allUsers = await User.find(
            {
                $or: [
                    { username: new RegExp(input, 'i') },
                    { email: new RegExp(input, 'i') },
                    { full_name: new RegExp(input, 'i') },
                    { location: new RegExp(input, 'i') }
                ]
            }
        )
        const filteredUsers = allUsers.filter(user => user._id.toString() !== userId);

        // Fetch connections for current user to determine status
        const myConnections = await Connection.find({
            $or: [
                { from_user_id: userId },
                { to_user_id: userId }
            ]
        })

        const usersWithStatus = filteredUsers.map(user => {
            const userObj = user.toObject();
            const connection = myConnections.find(conn =>
                conn.from_user_id === user._id.toString() || conn.to_user_id === user._id.toString()
            );

            if (connection) {
                userObj.connectionStatus = connection.status;
                userObj.connectionFrom = connection.from_user_id;
            } else {
                userObj.connectionStatus = null;
            }
            return userObj;
        });

        res.json({ success: true, users: usersWithStatus })
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//Follow User
export const followUser = async (req, res) => {
    try {
        const { userId } = await req.auth(); // Updated
        const { id, targetUserId } = req.body;
        const targetId = id || targetUserId;

        const user = await User.findById(userId)

        if (user.following.some(followingId => followingId.toString() === targetId)) {
            return res.json({ success: false, message: 'You are already following this user' })
        }

        user.following.push(targetId);
        await user.save()

        const toUser = await User.findById(targetId)
        toUser.followers.push(userId)
        await toUser.save()

        res.json({ success: true, message: 'Now you are following this user' })

    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//Unfollow User
export const unfollowUser = async (req, res) => {
    try {
        const { userId } = await req.auth(); // Updated
        const { id, targetUserId } = req.body;
        const targetId = id || targetUserId;

        const user = await User.findById(userId)

        user.following = user.following.filter(followingId => followingId.toString() !== targetId);
        await user.save();

        const toUser = await User.findById(targetId)
        toUser.followers = toUser.followers.filter(followerId => followerId.toString() !== userId);
        await toUser.save();

        res.json({ success: true, message: 'You are no longer following this user' })

    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//Send Connection Request
export const sendConnectionRequest = async (req, res) => {
    try {
        const { userId } = await req.auth(); // Updated
        const { id, targetUserId } = req.body;
        const targetId = id || targetUserId;

        //Check if user has sent more than 20 connecton requests in the last 24 hours
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const ConnectionRequests = await Connection.find({
            from_user_id: userId,
            createdAt: { $gt: last24Hours }
        })
        if (ConnectionRequests.length >= 20) {
            return res.json({ success: false, message: 'You have sent more than 20 connection requests in the last 24 hours' })
        }

        //Check if users are already connected
        const connection = await Connection.findOne({
            $or: [
                { from_user_id: userId, to_user_id: targetId },
                { from_user_id: targetId, to_user_id: userId }
            ]
        })

        if (!connection) {
            const newConnection = await Connection.create({
                from_user_id: userId,
                to_user_id: targetId
            })

            // await inngest.send({
            //     name: 'app/connection_request',
            //     data: {connectionId: newConnection._id}
            // })

            return res.json({ success: true, message: 'Connection request sent successfully' })
        } else if (connection && connection.status === 'accepted') {
            return res.json({ success: false, message: 'You are already connected with this user' })
        }

        return res.json({ success: false, message: 'Connection request pending' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//Get User Connections
export const getUserConnections = async (req, res) => {
    try {
        const { userId } = await req.auth(); // Updated
        const user = await User.findById(userId)

        const connections = user.connections
        const followers = user.followers
        const following = user.following

        const pendingConnections = (await Connection.find({
            to_user_id: userId,
            status: 'pending'
        })).map(connnection =>
            connnection.from_user_id)

        res.json({ success: true, connections, followers, following, pendingConnections })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//Accept Connection Request
export const acceptConnectionRequest = async (req, res) => {
    try {
        const { userId } = await req.auth(); // Updated
        const { id } = req.body

        const connection = await Connection.findOne({ from_user_id: id, to_user_id: userId })

        if (!connection) {
            return res.json({ success: false, message: 'No connection request found' })
        }

        const user = await User.findById(userId);
        if (!user.connections.some(connectionId => connectionId.toString() === id)) {
            user.connections.push(id)
            await user.save();
        }

        const toUser = await User.findById(id);
        if (!toUser.connections.some(connectionId => connectionId.toString() === userId)) {
            toUser.connections.push(userId)
            await toUser.save();
        }

        connection.status = 'accepted'
        await connection.save();

        res.json({ success: true, message: 'Connection request accepted successfully' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Get User Profiles
export const getUserProfiles = async (req, res) => {
    try {
        const profileId = req.params.userId || req.body.profileId;
        const profile = await User.findById(profileId)

        if (!profile) {
            return res.json({ success: false, message: "Profile not found" });
        }
        const posts = await Post.find({ user: profileId }).populate('user').sort({ createdAt: -1 })
        const likedPosts = await Post.find({ likes_count: profileId }).populate('user').sort({ createdAt: -1 })

        res.json({ success: true, profile, posts, likedPosts })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}