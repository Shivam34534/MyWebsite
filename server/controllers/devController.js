import User from '../models/User.js'
import fs from 'fs'
import path from 'path'
import imagekit from '../configs/imageKit.js'

export const createDevUser = async (req, res) => {
    try {
        const customId = req.body?.id || `dev_${Date.now()}`
        const existing = await User.findById(customId)
        if (existing) {
            return res.json({ success: true, userId: existing._id })
        }

        const userData = {
            _id: customId,
            email: `${customId}@dev.local`,
            full_name: 'Dev User',
            username: `dev_${Math.floor(Math.random() * 10000)}`
        }

        const user = await User.create(userData)
        res.json({ success: true, userId: user._id })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

export const checkUser = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (user) {
            return res.json({
                success: true,
                user: {
                    id: user._id,
                    primaryEmailAddress: { emailAddress: user.email },
                    fullName: user.full_name,
                    password: user.password
                }
            })
        }
        res.json({ success: false, message: "User not found" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const loginDevUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "Account not found" })
        }
        if (user.password && user.password !== password) {
            return res.json({ success: false, message: "Invalid password" })
        }
        res.json({
            success: true,
            user: {
                id: user._id,
                primaryEmailAddress: { emailAddress: user.email },
                fullName: user.full_name,
                password: user.password
            }
        })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
export const signupDevUser = async (req, res) => {
    try {
        console.log('Signup Dev User Request Body:', req.body);
        console.log('Signup Dev User Files:', req.files);
        const { email, password, fullName, username, location } = req.body
        const profile = req.files?.profile?.[0]
        const cover = req.files?.cover?.[0]

        // Check if user already exists
        const existing = await User.findOne({ email })
        if (existing) {
            return res.json({ success: false, message: "User with this email already exists" })
        }

        if (username) {
            const existingUsername = await User.findOne({ username })
            if (existingUsername) {
                return res.json({ success: false, message: "Username is already taken" })
            }
        }

        const userId = `dev_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        const userData = {
            _id: userId,
            email,
            password,
            full_name: fullName || 'Dev User',
            username: username || `user_${Math.floor(Math.random() * 10000)}`,
            location: location || '',
            profile_picture: '',
            cover_picture: ''
        }

        const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`

        if (profile) {
            const buffer = profile.buffer || fs.readFileSync(profile.path)

            if (process.env.IMAGEKIT_PRIVATE_KEY) {
                const response = await imagekit.upload({
                    file: buffer,
                    fileName: profile.originalname,
                    folder: '/profile-pictures'
                })
                const url = imagekit.url({
                    path: response.filePath,
                    transformation: [{ quality: 'auto' }, { format: 'webp' }, { width: '512' }]
                })
                userData.profile_picture = url;
            } else {
                const uploadsProfileDir = path.resolve(process.cwd(), 'uploads', 'profiles')
                if (!fs.existsSync(uploadsProfileDir)) {
                    fs.mkdirSync(uploadsProfileDir, { recursive: true })
                }
                const filename = `${Date.now()}_profile_${profile.originalname.replace(/\s+/g, '_')}`
                const filepath = path.join(uploadsProfileDir, filename)
                fs.writeFileSync(filepath, buffer)
                userData.profile_picture = `${baseUrl}/uploads/profiles/${filename}`
            }

            // Clean up temp file
            if (profile.path && fs.existsSync(profile.path)) fs.unlinkSync(profile.path);
        }

        if (cover) {
            const buffer = cover.buffer || fs.readFileSync(cover.path)

            if (process.env.IMAGEKIT_PRIVATE_KEY) {
                const response = await imagekit.upload({
                    file: buffer,
                    fileName: cover.originalname,
                    folder: '/cover-pictures'
                })
                const url = imagekit.url({
                    path: response.filePath,
                    transformation: [{ quality: 'auto' }, { format: 'webp' }, { width: '1280' }]
                })
                userData.cover_picture = url;
            } else {
                const uploadsCoverDir = path.resolve(process.cwd(), 'uploads', 'covers')
                if (!fs.existsSync(uploadsCoverDir)) {
                    fs.mkdirSync(uploadsCoverDir, { recursive: true })
                }
                const filename = `${Date.now()}_cover_${cover.originalname.replace(/\s+/g, '_')}`
                const filepath = path.join(uploadsCoverDir, filename)
                fs.writeFileSync(filepath, buffer)
                userData.cover_picture = `${baseUrl}/uploads/covers/${filename}`
            }

            // Clean up temp file
            if (cover.path && fs.existsSync(cover.path)) fs.unlinkSync(cover.path);
        }

        const user = await User.create(userData)
        res.json({
            success: true,
            user: {
                id: user._id,
                primaryEmailAddress: { emailAddress: user.email },
                fullName: user.full_name,
                password: user.password,
                profile_picture: user.profile_picture,
                cover_picture: user.cover_picture,
                username: user.username,
                location: user.location
            }
        })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}
