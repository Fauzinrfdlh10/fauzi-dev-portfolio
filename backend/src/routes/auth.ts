import { Router } from 'express';
import { body } from 'express-validator';
import { login, getMe } from '../controllers/authController';
import { validate } from '../middlewares/validationMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  validate,
  login
);

router.get('/me', authMiddleware, getMe);

export default router;
