import express from 'express';
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

app.use(express.json());
app.use(cors());

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

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => console.log(`Server is running with Socket.io on port: http://localhost:${PORT}`));
}

export default app;
