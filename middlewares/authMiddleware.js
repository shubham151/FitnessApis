import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants.js';

const { verify } = jwt;

let authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // "Bearer <token>"
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  console.log(token)
  verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.user = { id: decoded.userId };
    next();
  });
}

export default authMiddleware;
