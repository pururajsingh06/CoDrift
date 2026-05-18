const mongoose = require('mongoose');

const FriendshipSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'DECLINED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});

FriendshipSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

module.exports = mongoose.model('Friendship', FriendshipSchema);
