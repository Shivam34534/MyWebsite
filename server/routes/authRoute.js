import express from 'express';
import { z } from 'zod';
import { registerUser, loginUser } from '../controllers/authController.js';
import { validateRequest } from '../middlewares/validateRequest.js';

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
    email: z.string().trim().email("Invalid email format"),
    password: z.string().trim().min(1, "Password is required"),
});

const router = express.Router();

router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', loginUser);

export default router;
