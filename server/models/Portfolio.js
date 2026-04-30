const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  imageUris: { type: [String], default: [] }, // base64 or URLs
  location: { type: String, trim: true },
  completedAt: { type: String, trim: true },
  category: { type: String, trim: true }
}, { timestamps: true });

portfolioSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Portfolio', portfolioSchema);
