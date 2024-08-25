import  {Router} from 'express';

import { signupUser, loginUser, refreshTheAccessToken, logoutUser, getCurrentUser } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
const router = Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.patch('/logout', protect, logoutUser);
router.patch('/refresh', protect,  refreshTheAccessToken);
router.get('/me', protect, getCurrentUser);


export default router;