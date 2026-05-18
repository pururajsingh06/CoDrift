const express = require('express');
const Friendship = require('../../models/Friendship');
const User = require('../../models/User');
const { verifyToken } = require('../../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const friendships = await Friendship.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: 'ACCEPTED'
    }).populate('senderId receiverId', 'name email avatar');

    const friends = friendships.map(f => {
      const isSender = f.senderId._id.toString() === userId;
      const targetUser = isSender ? f.receiverId : f.senderId;
      return {
        id: targetUser._id.toString(),
        name: targetUser.name,
        email: targetUser.email,
        avatar: targetUser.avatar
      };
    });

    const pendingRequests = await Friendship.find({
      receiverId: userId,
      status: 'PENDING'
    }).populate('senderId', 'name email avatar');

    res.json({
      friends,
      pendingRequests: pendingRequests.map(r => ({
        id: r._id.toString(),
        user: {
          id: r.senderId._id.toString(),
          name: r.senderId.name,
          email: r.senderId.email,
          avatar: r.senderId.avatar
        },
        createdAt: r.createdAt
      }))
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

    const existing = await Friendship.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    });

    if (existing) {
      return res.status(400).json({ error: 'Friendship or request already exists' });
    }

    const request = await Friendship.create({
      senderId,
      receiverId,
      status: 'PENDING'
    });

    res.status(201).json({
      id: request._id.toString(),
      senderId: request.senderId,
      receiverId: request.receiverId,
      status: request.status,
      createdAt: request.createdAt
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Failed to send request' });
  }
});

router.put('/accept/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const request = await Friendship.findById(id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.receiverId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    request.status = 'ACCEPTED';
    await request.save();

    res.json({
      id: request._id.toString(),
      senderId: request.senderId,
      receiverId: request.receiverId,
      status: request.status,
      createdAt: request.createdAt
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Failed to accept request' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const friendship = await Friendship.findById(id);

    if (!friendship) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    if (friendship.senderId.toString() !== userId && friendship.receiverId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Friendship.findByIdAndDelete(id);

    res.json({ message: 'Friendship removed' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

module.exports = router;
