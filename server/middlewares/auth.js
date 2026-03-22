import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        let token;
        
        // Check if the JWT token exists in the "Authorization: Bearer <token>" header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
        }

        // Verify the token securely
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
        
        // Ensure user actually still exists in database
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ success: false, message: "User no longer exists" });
        }

        // Attach userId correctly so existing controllers operate perfectly
        const userId = currentUser._id;
        const role = currentUser.role || 'user';
        
        // Polyfill req.auth for controllers that expected it originally
        req.auth = async () => ({ userId, role });

        next();
    } catch (error) {
        console.error(`[Auth Middleware] JWT Error:`, error);
        res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
};
