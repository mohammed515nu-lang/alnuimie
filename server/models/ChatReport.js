const mongoose = require('mongoose');

const chatReportSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    reason: { type: String, trim: true, required: true },
    details: { type: String, trim: true },
    status: {
      type: String,
      enum: ['open', 'reviewing', 'resolved', 'dismissed'],
      default: 'open',
      index: true
    },
    adminNotes: { type: String, trim: true },
    resolvedAt: { type: Date }
  },
  { timestamps: true }
);

chatReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ChatReport', chatReportSchema);
