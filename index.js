import express from 'express';
import cors from 'cors';
import bp from 'body-parser';
import { PORT } from './config/constants.js';
import dotenv from 'dotenv';
import authMiddleware from './middlewares/authMiddleware.js';
dotenv.config();

const { json } = bp


// Import routes
import authRoutes from './routes/authRoute.js';
import exerciseRoutes from './routes/exerciseRoute.js';

// Connect to DB
import { connectDB } from './config/db.js';
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/auth', authRoutes);
app.use('/exercises', authMiddleware, exerciseRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
