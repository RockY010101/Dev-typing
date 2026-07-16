import express from 'express';
import multer from 'multer';
import { authUser, setUsername, getUserProfile, updateUserProfile } from '../controllers/userController.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/auth', authUser);
router.post('/username', setUsername);
router.get('/:id', getUserProfile);
router.put('/:id', upload.single('picture'), updateUserProfile);

export default router;
