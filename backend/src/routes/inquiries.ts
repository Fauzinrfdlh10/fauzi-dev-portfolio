import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
  replyToInquiry,
} from '../controllers/inquiryController';
import { validate } from '../middlewares/validationMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Rate limiting for public contact form (max 5 requests per hour)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: 'Too many requests from this IP, please try again after an hour' },
});

// Public route to submit an inquiry
router.post(
  '/',
  contactLimiter,
  [
    body('full_name', 'Name is required').notEmpty().trim().escape(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('subject', 'Subject is required').notEmpty().trim().escape(),
    body('message', 'Message is required').notEmpty().trim().escape(),
  ],
  validate,
  createInquiry
);

// Protected routes
router.get('/', authMiddleware, getInquiries);
router.get('/:id', authMiddleware, getInquiryById);
router.put('/:id/status', authMiddleware, updateInquiryStatus);
router.post('/:id/reply', authMiddleware, replyToInquiry);
router.delete('/:id', authMiddleware, deleteInquiry);

export default router;
