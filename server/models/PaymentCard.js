const mongoose = require('mongoose');

const paymentCardSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  stripeCustomerId: { type: String, required: true },
  stripePaymentMethodId: { type: String, required: true, unique: true },
  brand: { type: String, enum: ['visa', 'mastercard', 'amex', 'discover', 'diners', 'jcb', 'unionpay', 'other'], default: 'other' },
  last4: { type: String, required: true },
  expMonth: { type: Number, required: true, min: 1, max: 12 },
  expYear: { type: Number, required: true, min: 2000, max: 2100 },
  holderName: { type: String, trim: true },
  isDefault: { type: Boolean, default: false, index: true }
}, { timestamps: true });

paymentCardSchema.index({ owner: 1, isDefault: -1, createdAt: -1 });

module.exports = mongoose.model('PaymentCard', paymentCardSchema);
