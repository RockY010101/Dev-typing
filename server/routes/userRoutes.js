import express from 'express';
import { authUser, setUsername, getUserProfile } from '../controllers/userController.js';

const router = express.Router();

router.post('/auth', authUser);
router.post('/username', setUsername);
router.get('/:id', getUserProfile);

export default router;
