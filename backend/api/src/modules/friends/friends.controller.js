const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();


router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        status: 'ACCEPTED'
      },
      include: {
        sender: { select: { id: true, name: true, email: true, avatar: true } },
        receiver: { select: { id: true, name: true, email: true, avatar: true } }
      }
    });

    const friends = friendships.map(f => f.senderId === userId ? f.receiver : f.sender);

    
    const pendingRequests = await prisma.friendship.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      include: { sender: { select: { id: true, name: true, email: true, avatar: true } } }
    });

    res.json({
      friends,
      pendingRequests: pendingRequests.map(r => ({ id: r.id, user: r.sender, createdAt: r.createdAt }))
    });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});


router.post('/request', verifyToken, async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Cannot send request to yourself' });
    }

    
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Friendship or request already exists' });
    }

    const request = await prisma.friendship.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING'
      }
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Failed to send request' });
  }
});


router.put('/accept/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const request = await prisma.friendship.findUnique({ where: { id: id } });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.receiverId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.friendship.update({
      where: { id: id },
      data: { status: 'ACCEPTED' }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Failed to accept request' });
  }
});


router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const friendship = await prisma.friendship.findUnique({ where: { id: id } });

    if (!friendship) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    if (friendship.senderId !== userId && friendship.receiverId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.friendship.delete({ where: { id: id } });

    res.json({ message: 'Friendship removed' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

module.exports = router;
