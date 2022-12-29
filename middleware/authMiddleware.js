import jwt from 'jsonwebtoken';
import { createError } from './errorMiddleware.js';
export const authMiddleware = (req, res, next) => {
  // const token = req.cookies.access_token;
  const token = req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer');
  if (!token) return next(createError(401, 'User is not authenticated!'));
  try {
    // Get token from header
    const realToken = req.headers.authorization.split(' ')[1]
    jwt.verify(realToken, process.env.JWT, (err, user) => {
      if (err) return next(createError(403, 'Token is not valid!'));
      req.user = user;
      next()
    });
  } catch (error) {
    console.log(error)
    res.status(401)
    throw new Error('Not authorized')
  }
};