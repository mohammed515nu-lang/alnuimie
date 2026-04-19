const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  target: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  stars: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, trim: true }
}, { timestamps: true });

ratingSchema.index({ target: 1, from: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
