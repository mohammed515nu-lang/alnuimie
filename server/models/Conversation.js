const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: String, trim: true },
  lastMessageAt: { type: Date },
  lastSender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Per-user unread counter, stored as a plain object keyed by userId
  unread: { type: Map, of: Number, default: () => ({}) }
}, { timestamps: true });

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
