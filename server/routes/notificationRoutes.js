import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';
import { protect } from '../middlewares/auth.js';

const notificationRouter = express.Router();

notificationRouter.get('/', protect, getNotifications);
notificationRouter.put('/mark-read', protect, markAsRead);

export default notificationRouter;
