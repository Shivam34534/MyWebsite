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

// Dev-only routes
import devRouter from './routes/devRoutes.js'

const app = express();

console.log("Attempting to connect to DB...");
try {
    connectDB();
    console.log("DB connection initiated.");
} catch (error) {
    console.error("DB connection failed immediately:", error);
}

app.use(express.json());
app.use(cors());

// Mock auth middleware removed to allow dev-user header to work
// app.use((req, res, next) => {
//   req.auth = async () => ({ userId: "mock-user-id" }); 
//   next();
// });

// Serve uploaded files from the uploads directory
const uploadsDirPath = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDirPath));

app.get('/', (req, res) => res.send('Server is running...'));
// app.use('/api/inngest',serve({client: inngest, functions}));
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/story', storyRouter)
app.use('/api/message', messageRouter)
app.use('/api/comment', commentRouter)

// Expose development helper routes only in non-production environments
if (process.env.NODE_ENV !== 'production') {
    app.use('/api/dev', devRouter)
}

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server is running on port: http://localhost:${PORT}`));
}

export default app;
