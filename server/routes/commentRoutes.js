import express from 'express';
import { protect } from '../middlewares/auth.js';
import { addComment, getPostComments, getPostCommentsList } from '../controllers/commentController.js';

const commentRouter = express.Router();

commentRouter.post('/add', protect, addComment);
commentRouter.get('/get/:postId', protect, getPostComments);
commentRouter.get('/list', protect, getPostCommentsList);

export default commentRouter;
