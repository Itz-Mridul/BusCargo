import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/login', async (req, res) => {
  const { email, password, rememberMe, adminKey, isAdminLogin } = req.body;
  
  try {
    if (isAdminLogin || adminKey) {
      try {
        const keyPath = path.join(__dirname, '../../admin_key.txt');
        const validKey = fs.readFileSync(keyPath, 'utf-8').trim();
        if (adminKey !== validKey) {
          res.status(401).json({ error: 'Invalid Admin Key' });
          return;
        }
      } catch (e) {
        console.error('Admin key file missing or unreadable', e);
        res.status(500).json({ error: 'Admin configuration error' });
        return;
      }

      let user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            role: 'ADMIN',
            name: 'System Admin',
            email: 'admin@buscargo.local',
            passwordHash: await bcrypt.hash('admin123', 10),
          }
        });
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
        JWT_SECRET,
        { expiresIn }
      );

      return res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
       res.status(401).json({ error: 'Invalid credentials' });
       return;
    }

    // Track login metrics
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
      JWT_SECRET,
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
  const { name, email, phone, password, role } = req.body;
  try {
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email and password are required' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        role: role || 'SENDER',
        loginCount: 1,
        lastLoginAt: new Date()
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
