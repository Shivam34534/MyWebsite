import User from '../models/User.js'

export const protect = async (req, res, next) => {
    try {
        // Try Clerk-provided auth first if available
        let userId = null
        if (typeof req.auth === 'function') {
            try {
                const authRes = await req.auth()
                userId = authRes?.userId
            } catch (e) {
                // ignore
            }
        }

        if (!userId) {
            const devUserHeader = req.headers['x-dev-user'] || req.headers['X-DEV-USER']
            if (devUserHeader) {
                userId = devUserHeader
            }
        }

        const devUserFullName = req.headers['x-dev-user-fullname'] || 'Dev User'
        const devUserEmail = req.headers['x-dev-user-email'] || `${userId}@dev.local`
        const devUserImage = req.headers['x-dev-user-image'] || ''



        if (userId) {
            // Ensure valid mongodb ID or string ID
            // Check if user exists in DB, if not create it (auto-provisioning for dev/mock)
            try {
                const existing = await User.findById(userId)
                if (!existing) {
                    const newUser = {
                        _id: userId,
                        email: devUserEmail,
                        password: req.headers['x-dev-user-password'] || '',
                        full_name: devUserFullName,
                        username: `user_${Math.floor(Math.random() * 10000)}`,
                        profile_picture: devUserImage
                    }
                    const created = await User.create(newUser)
                } else {
                    // Self-healing: Update user details if they have changed (or if it was generic Dev User)
                    const devUserPassword = req.headers['x-dev-user-password'] || req.headers['X-DEV-USER-PASSWORD']
                    let needsSave = false;

                    if (devUserFullName && devUserFullName !== 'Dev User' && existing.full_name !== devUserFullName) {
                        existing.full_name = devUserFullName;
                        existing.email = devUserEmail; // sync email too
                        if (devUserImage) existing.profile_picture = devUserImage;
                        needsSave = true;
                    }

                    if (devUserPassword && existing.password !== devUserPassword) {
                        existing.password = devUserPassword;
                        needsSave = true;
                    }

                    if (needsSave) await existing.save();
                }
            } catch (dbError) {
                console.error(`[Auth] DB Error during provisioning:`, dbError);
            }
        }

        if (!userId) {
            return res.json({ success: false, message: "not authenticated" })
        }

        // Polyfill req.auth for controllers that expect it (from Clerk style)
        req.auth = async () => ({ userId });

        next()
    }
    catch (error) {
        console.error(`[Auth] General Error:`, error);
        res.json({ success: false, message: error.message })
    }
}

