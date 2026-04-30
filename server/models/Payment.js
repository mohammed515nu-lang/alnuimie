const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentNumber: {
    type: String,
    unique: true,
    required: false // Will be generated in pre-save hook
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  purchase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank-transfer', 'check', 'credit-card', 'stripe'],
    default: 'cash'
  },
  checkNumber: {
    type: String,
    trim: true
  },
  bankName: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  // Stripe payment fields
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  stripePaymentIntentId: {
    type: String,
    trim: true
  },
  stripeClientSecret: {
    type: String,
    trim: true
  },
  transactionId: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  strictPopulate: false
});

paymentSchema.index({ supplier: 1 });
paymentSchema.index({ paymentDate: -1 });

paymentSchema.pre('save', async function (next) {
  // Generate paymentNumber if not provided or if it's a temporary value
  if (!this.paymentNumber || this.paymentNumber.startsWith('TEMP-')) {
    try {
      const count = await mongoose.model('Payment').countDocuments();
      this.paymentNumber = `PAY-${Date.now()}-${count + 1}`;
    } catch (error) {
      // If count fails, use timestamp with random string
      this.paymentNumber = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  }
  next();
});

// Ensure paymentNumber is set before validation
paymentSchema.pre('validate', function (next) {
  if (!this.paymentNumber) {
    this.paymentNumber = `TEMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Update Supplier totals after save
paymentSchema.post('save', async function (doc) {
  await updateSupplierPaymentBalance(doc.supplier);
});

// Update Supplier totals after delete
paymentSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await updateSupplierPaymentBalance(doc.supplier);
  }
});

async function updateSupplierPaymentBalance(supplierId) {
  try {
    const Supplier = mongoose.model('Supplier');
    const Payment = mongoose.model('Payment');

    // Only count completed payments (exclude failed, cancelled, refunded)
    const payments = await Payment.find({ 
      supplier: supplierId,
      $or: [
        { paymentStatus: { $exists: false } }, // Legacy payments without status
        { paymentStatus: 'completed' },
        { paymentStatus: 'pending' }, // Include pending as they're expected to complete
        { paymentStatus: { $exists: false, paymentMethod: { $ne: 'stripe' } } } // Non-Stripe payments
      ]
    });
    
    const totalPaid = payments.reduce((sum, p) => {
      // For Stripe payments, only count completed ones
      if (p.paymentMethod === 'stripe') {
        return (p.paymentStatus === 'completed') ? sum + (p.amount || 0) : sum;
      }
      // For other payment methods, count all (they're typically completed immediately)
      return sum + (p.amount || 0);
    }, 0);

    const supplier = await Supplier.findById(supplierId);
    if (supplier) {
      supplier.totalPaid = totalPaid;
      await supplier.save(); // Updates totalRemaining via Supplier pre-save
    }
    console.log(`✅ [PaymentHook] Updated Supplier ${supplierId} totalPaid to ${totalPaid}`);
  } catch (error) {
    console.error(`❌ [PaymentHook] Failed to update Supplier balance:`, error.message);
  }
}



const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
