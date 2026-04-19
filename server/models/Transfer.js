const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['client_to_contractor', 'contractor_to_supplier', 'topup', 'withdraw'],
    required: true,
    index: true
  },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'usd' },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending',
    index: true
  },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  toSupplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  toSupplierName: { type: String, trim: true },
  description: { type: String, trim: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  projectName: { type: String, trim: true },
  purchase: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' },
  stripePaymentIntentId: { type: String, index: true },
  stripeClientSecret: { type: String },
  cardLast4: { type: String },
  cardBrand: { type: String },
}, { timestamps: true });

transferSchema.index({ fromUser: 1, createdAt: -1 });
transferSchema.index({ toUser: 1, createdAt: -1 });

module.exports = mongoose.model('Transfer', transferSchema);
