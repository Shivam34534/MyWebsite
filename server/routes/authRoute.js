import express from 'express';
import { z } from 'zod';
import { registerUser, loginUser, requestPasswordReset, verifyResetOtp, resetPassword } from '../controllers/authController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import rateLimit from 'express-rate-limit';

const otpRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes window
    max: 3, // start blocking after 3 requests
    message: { success: false, message: 'Too many OTP requests from this IP, please try again after 5 minutes' }
});

// Schemas for Zod request validation
const registerSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    username: z.string().optional(),
    location: z.string().optional(),
    profile_picture: z.any().optional(),
    cover_picture: z.any().optional(),
});

const loginSchema = z.object({
    email: z.string().trim().min(3, "Identifier must be at least 3 characters"),
    password: z.string().trim().min(1, "Password is required"),
});

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Password Reset APIs
router.post('/request-reset', otpRateLimiter, requestPasswordReset);
router.post('/verify-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

export default router;
