const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending', index: true },
  message: { type: String, trim: true },
  acceptedAt: { type: Date }
}, { timestamps: true });

connectionSchema.index({ from: 1, to: 1 }, { unique: true });

module.exports = mongoose.model('Connection', connectionSchema);
