import { Router } from 'express';
const router = Router();
import { register, login, refreshToken } from '../controllers/authController.js';

// POST /auth/register - Register a new user
router.post('/register', register);

// POST /auth/login - Log in and get tokens
router.post('/login', login);

// POST /auth/refresh - Refresh access token using refresh token
router.post('/refresh', refreshToken);

export default router;
