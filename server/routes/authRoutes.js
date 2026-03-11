import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login attempt:', { username, passwordProvided: password === process.env.ADMIN_PASSWORD });
  console.log('Expected:', { user: process.env.ADMIN_USERNAME, passSet: !!process.env.ADMIN_PASSWORD });

  // Simple hardcoded admin check from .env
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, username });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

export default router;
