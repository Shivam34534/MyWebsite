import express from 'express';
import { upload } from '../configs/multer.js';
import { addPost, getFeedPosts, likePost, sharePost, trackView, getTrendingPosts } from '../controllers/postController.js';
import { protect } from '../middlewares/auth.js';
const postRouter = express.Router();

postRouter.post('/add', upload.array('images', 4), protect, addPost)
postRouter.get('/feed', protect, getFeedPosts)
postRouter.post('/like', protect, likePost)
postRouter.post('/share', protect, sharePost)
postRouter.post('/view', protect, trackView)
postRouter.get('/trending', protect, getTrendingPosts)

export default postRouter