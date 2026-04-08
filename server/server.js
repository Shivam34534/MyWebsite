import 'dotenv/config.js';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import connectDB from './configs/db.js';
import path from 'path'
import { app, server } from './socket/socket.js'; // Unified App and Server

// Routers
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
import storyRouter from './routes/storyRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import searchRouter from './routes/searchRoutes.js';
import authRouter from './routes/authRoute.js';
import devRouter from './routes/devRoutes.js'
import { errorHandler } from './middlewares/errorHandler.js';

const PORT = process.env.PORT || 4000;

// Connect to Database
console.log("[DB] Attempting connection to Atlas...");
connectDB().then(() => {
    console.log("[DB] Database connected and ready.");
}).catch(err => {
    console.error("[DB] Critical connection failure:", err);
});

// Middleware Configuration
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 200, 
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, 
    legacyHeaders: false, 
});
app.use('/api', apiLimiter);

app.use(cors({ 
    origin: (origin, callback) => callback(null, true),
    credentials: true 
}));

app.use(express.json({ limit: '10mb' }));

// Serve static assets
const uploadsDirPath = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDirPath));

app.get('/', (req, res) => res.send('Gallery API is operational and waiting for curations...'));

// API Routes
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/story', storyRouter)
app.use('/api/message', messageRouter)
app.use('/api/comment', commentRouter)
app.use('/api/notification', notificationRouter)
app.use('/api/search', searchRouter)

// Development Helper Routes
if (process.env.NODE_ENV !== 'production') {
    app.use('/api/dev', devRouter)
}

// Final Error Handling
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => console.log(`[SERVER] Running and radiating on: http://localhost:${PORT}`));
}

export default app;
