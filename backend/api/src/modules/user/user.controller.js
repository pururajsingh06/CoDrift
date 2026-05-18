const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { verifyToken, JWT_SECRET } = require('../../middleware/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();


router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, avatar: true, createdAt: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});


router.get('/search', verifyToken, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: req.user.id } },
          {
            OR: [
              { email: { contains: q } },
              { name: { contains: q } }
            ]
          }
        ]
      },
      select: { id: true, name: true, email: true, avatar: true },
      take: 10
    });
    
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});


router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) {
      
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(409).json({ error: 'Email is already in use by another account' });
      }
      updateData.email = email;
    }
    
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });
    
    
    const token = jwt.sign(
      { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name, avatar: updatedUser.avatar },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name, avatar: updatedUser.avatar }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
