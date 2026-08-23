import express from 'express';
import { createResult, getUserResults, deleteResult, getLeaderboard } from '../controllers/resultController.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.post('/', createResult);
router.get('/user/:id', getUserResults);
router.delete('/:id', deleteResult);

export default router;
