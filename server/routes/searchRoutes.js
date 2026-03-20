import express from 'express';
import { globalSearch } from '../controllers/searchController.js';
import { protect } from '../middlewares/auth.js';

const searchRouter = express.Router();

searchRouter.get('/', protect, globalSearch);

export default searchRouter;
