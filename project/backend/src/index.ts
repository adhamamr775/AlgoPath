import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import problemsRoutes from './modules/problems/problems.routes';
import trackerRoutes from './modules/tracker/tracker.routes';
import topicsRoutes from './modules/topics/topics.routes';
import { globalErrorHandler } from './middleware/error';
import adminRoutes from './modules/admin/admin.routes';
import tagsRoutes from './modules/tags/tags.routes';
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AlgoPath API is running.' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/problems', problemsRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tags', tagsRoutes);
// Global Error Handler
app.use(globalErrorHandler as any);

// Server Init
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});
