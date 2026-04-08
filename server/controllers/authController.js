import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
    try {
        let { fullName, email, password, username, location, profile_picture, cover_picture } = req.body;
        
        email = email.trim().toLowerCase();

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // We use crypto UUID to match existing String ID schema types if not explicitly ObjectId
        const userId = crypto.randomUUID();

        const newUser = await User.create({
            _id: userId,
            full_name: fullName,
            email,
            password: hashedPassword,
            username: username || `user_${Math.floor(Math.random() * 10000)}`,
            location,
            profile_picture,
            cover_picture
        });

        res.status(201).json({
            success: true,
            user: { id: newUser._id, fullName: newUser.full_name, email: newUser.email, username: newUser.username, profile_picture: newUser.profile_picture, cover_picture: newUser.cover_picture, location: newUser.location },
            token: generateToken(newUser._id)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        const startTime = Date.now();

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        email = email.trim().toLowerCase();

        // Optimized query to match either exact email or exact (case-insensitive) username
        // Using $or with indexed fields is fast
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: email }
            ]
        }).collation({ locale: 'en', strength: 2 }); // Collation for case-insensitive username match

        if (!user) {
            console.log(`[LOGIN] User not found for: ${email}`);
            return res.status(404).json({ success: false, message: 'Invalid credentials' });
        }

        if (!user.password) {
            console.log(`[LOGIN] Missing password (Clerk account) for: ${email}`);
            return res.status(400).json({ success: false, message: 'This account was originally created via third-party login (Clerk). Please reset your password or create a new account.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        const duration = Date.now() - startTime;
        console.log(`[LOGIN] Attempt for ${email}: ${isMatch ? 'SUCCESS' : 'FAILED'} (Time: ${duration}ms)`);

        if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

        res.status(200).json({
            success: true,
            user: { id: user._id, fullName: user.full_name, email: user.email, username: user.username, profile_picture: user.profile_picture, cover_picture: user.cover_picture, location: user.location },
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(`[LOGIN] Unexpected error for ${req.body.email}:`, error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Generate and Send OTP
export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        user.resetOtp = hashedOtp;
        user.resetOtpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity
        await user.save();

        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            await transporter.sendMail({
                from: process.env.SENDER_EMAIL || 'noreply@yourdomain.com',
                to: user.email,
                subject: 'Aura - Password Reset OTP',
                text: `Your OTP for resetting your password is: ${otp}. It will expire in exactly 5 minutes.`
            });
            console.log(`OTP successfully sent to ${user.email}`);
        } else {
            console.log(`MAILER NOT CONFIGURED IN .ENV! Mock OTP for ${user.email} is: ${otp}`);
        }

        res.status(200).json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify OTP
export const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user || !user.resetOtp || !user.resetOtpExpiry) {
            return res.status(400).json({ success: false, message: 'Invalid request' });
        }

        if (new Date() > user.resetOtpExpiry) {
            user.resetOtp = undefined;
            user.resetOtpExpiry = undefined;
            await user.save();
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }

        const isMatch = await bcrypt.compare(otp.toString(), user.resetOtp);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user || !user.resetOtp || !user.resetOtpExpiry) {
            return res.status(400).json({ success: false, message: 'Invalid reset request' });
        }

        if (new Date() > user.resetOtpExpiry) {
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }

        const isMatch = await bcrypt.compare(otp.toString(), user.resetOtp);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetOtp = undefined;
        user.resetOtpExpiry = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password has been reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
