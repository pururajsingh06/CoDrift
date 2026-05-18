const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();


router.get('/', verifyToken, async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});


router.post('/', verifyToken, async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).json({ error: 'Room ID and Name are required' });
    }

    const room = await prisma.room.create({
      data: {
        id,
        name,
        userId: req.user.id
      }
    });
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});


router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    
    const room = await prisma.room.findUnique({
      where: { id }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this room' });
    }

    await prisma.room.delete({
      where: { id }
    });
    
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

module.exports = router;
