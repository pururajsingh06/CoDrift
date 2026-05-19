const express = require('express');
const Room = require('../../models/Room');
const { verifyToken } = require('../../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const rooms = await Room.find({
      $or: [
        { userId: req.user.id },
        { joinedUsers: req.user.id }
      ]
    }).sort({ updatedAt: -1 });
    const formatted = rooms.map(r => ({
      id: r._id,
      name: r.name,
      userId: r.userId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    }));
    res.json(formatted);
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

    const room = await Room.create({
      _id: id,
      name,
      userId: req.user.id
    });
    
    res.status(201).json({
      id: room._id,
      name: room.name,
      userId: room.userId,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

router.post('/:id/join', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Add user to joinedUsers if not already present, and not the creator
    if (room.userId.toString() !== req.user.id) {
      if (!room.joinedUsers) {
        room.joinedUsers = [];
      }
      if (!room.joinedUsers.includes(req.user.id)) {
        room.joinedUsers.push(req.user.id);
        await room.save();
      }
    }

    res.json({
      message: 'Joined room successfully',
      id: room._id,
      name: room.name,
      userId: room.userId
    });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this room' });
    }

    await Room.findByIdAndDelete(id);
    
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

module.exports = router;
