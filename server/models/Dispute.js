const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true },
    openedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    respondent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    type: {
      type: String,
      enum: ['payment', 'delivery', 'quality', 'communication', 'other'],
      default: 'other'
    },
    status: {
      type: String,
      enum: ['open', 'under_review', 'resolved', 'closed'],
      default: 'open',
      index: true
    },
    resolutionText: { type: String, trim: true },
    adminNotes: { type: String, trim: true }
  },
  { timestamps: true }
);

disputeSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Dispute', disputeSchema);
