import jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { createUser, findUserByUsername } from '../models/userModel.js';
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../config/constants.js';

const { sign, verify } = jwt;

let register = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if username already exists
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const user = await createUser(username, password);
    res.status(201).json({ rec_id: user.rec_id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

let login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const match = await compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate tokens; note that we use user.rec_id as the identifier.
    const accessToken = sign({ userId: user.rec_id }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = sign({ userId: user.rec_id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

let refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    verify(token, JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
      const newAccessToken = sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '15m' });
      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export {
  register,
  login,
  refreshToken
};
