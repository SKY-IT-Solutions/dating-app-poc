import express, { Application } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import swipeRoutes from './routes/swipe.js';

// Initialize environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/swipe', swipeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});