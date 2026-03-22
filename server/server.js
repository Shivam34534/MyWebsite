import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import 'dotenv/config.js';
import connectDB from './configs/db.js';
// import {inngest, functions} from './inngest/index.js'
// import { serve } from 'inngest/express'
import path from 'path'
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
import storyRouter from './routes/storyRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import searchRouter from './routes/searchRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

import authRouter from './routes/authRoute.js';
// Dev-only routes
import devRouter from './routes/devRoutes.js'

import { app, server } from './socket/socket.js';

console.log("Attempting to connect to DB...");
try {
    connectDB();
    console.log("DB connection initiated.");
} catch (error) {
    console.error("DB connection failed immediately:", error);
}

// Apply Helmet for strict security HTTP headers while allowing cross-origin image requests
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Apply global rate limiting to protect against brute-force DDoS attacks
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 150, // Limit each IP to 150 requests per window
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, 
    legacyHeaders: false, 
});
app.use('/api', apiLimiter);

app.use(express.json());

// Strict CORS to only accept explicit frontend connections safely
app.use(cors({ 
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
    credentials: true 
}));

// Serve uploaded files from the uploads directory
const uploadsDirPath = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDirPath));

app.get('/', (req, res) => res.send('Server is running...'));

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/story', storyRouter)
app.use('/api/message', messageRouter)
app.use('/api/comment', commentRouter)
app.use('/api/notification', notificationRouter)
app.use('/api/search', searchRouter)

// Expose development helper routes only in non-production environments
if (process.env.NODE_ENV !== 'production') {
    app.use('/api/dev', devRouter)
}

// Global Exception error-handling middleware is ALWAYS the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => console.log(`Server is running with Socket.io on port: http://localhost:${PORT}`));
}

export default app;
