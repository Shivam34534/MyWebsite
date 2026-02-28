import express from 'express';
import { getChatMessages, sendMessage, sseController, getUserRecentMessages } from '../controllers/messageController.js';
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';

const messageRouter = express.Router();

messageRouter.get('/:userId', sseController)
messageRouter.post('/send', protect, upload.single('image'), sendMessage)
messageRouter.post('/get', protect, getChatMessages)
messageRouter.get('/all', protect, getChatMessages)
messageRouter.get('/conversations', protect, getUserRecentMessages)

export default messageRouter;