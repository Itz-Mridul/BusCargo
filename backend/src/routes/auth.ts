import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET must be set before the API can start.');
  return secret;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;
  
  try {
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!normalizedEmail || typeof password !== 'string') {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
       res.status(401).json({ error: 'Invalid credentials' });
       return;
    }

    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginCount: { increment: 1 },
        lastLoginAt: new Date()
      }
    });

    const expiresIn = rememberMe ? '90d' : '24h';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
        getJwtSecret(),
      { expiresIn }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  res.json({ user: req.user });
});

router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!normalizedName || !normalizedEmail || typeof password !== 'string') {
      res.status(400).json({ error: 'Name, email and password are required' });
      return;
    }
    if (normalizedName.length > 80 || !emailPattern.test(normalizedEmail) || password.length < 8 || password.length > 128) {
      res.status(400).json({ error: 'Use a valid email and a password between 8 and 128 characters.' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        phone: typeof phone === 'string' ? phone.trim().slice(0, 20) || null : null,
        passwordHash,
        role: 'SENDER',
        loginCount: 1,
        lastLoginAt: new Date()
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      getJwtSecret(),
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;