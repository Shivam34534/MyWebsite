import express from 'express';
import { protect } from '../middlewares/auth.js';
import { adminGuard } from '../middlewares/adminAuth.js';
import { getDashboardStats, getAllUsers, deleteUserAccount, deletePost } from '../controllers/adminController.js';

const router = express.Router();

// Chain the protect AND adminGuard middlewares to rigorously require a JWT belonging exclusively to an admin user
router.use(protect, adminGuard);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:userId', deleteUserAccount);
router.delete('/posts/:postId', deletePost);

export default router;
