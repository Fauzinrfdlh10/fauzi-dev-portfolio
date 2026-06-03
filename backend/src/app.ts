import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import inquiryRoutes from './routes/inquiries';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(cors()); // Allow all requests in development
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/contact', inquiryRoutes); // Alias for contact form submission

// Basic health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running smoothly.' });
});

export default app;
