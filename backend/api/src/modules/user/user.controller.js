const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const { verifyToken, JWT_SECRET } = require('../../middleware/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email avatar createdAt');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});


router.get('/search', verifyToken, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      _id: { $ne: req.user.id },
      $or: [
        { email: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ]
    }).select('name email avatar').limit(10);
    
    const formatted = users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      avatar: u.avatar
    }));
    
    res.json(formatted);
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
      
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(409).json({ error: 'Email is already in use by another account' });
      }
      updateData.email = email;
    }
    
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
    
    
    const token = jwt.sign(
      { id: updatedUser._id.toString(), email: updatedUser.email, name: updatedUser.name, avatar: updatedUser.avatar, createdAt: updatedUser.createdAt },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: { id: updatedUser._id.toString(), email: updatedUser.email, name: updatedUser.name, avatar: updatedUser.avatar, createdAt: updatedUser.createdAt }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
