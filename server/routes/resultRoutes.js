import express from 'express';
import { createResult, getUserResults, deleteResult } from '../controllers/resultController.js';

const router = express.Router();

router.post('/', createResult);
router.get('/user/:id', getUserResults);
router.delete('/:id', deleteResult);

export default router;
