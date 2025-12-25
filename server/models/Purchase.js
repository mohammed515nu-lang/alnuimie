<<<<<<< HEAD
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    purchaseNumber: {
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
    items: [{
        material: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Material',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 0
        },
        unit: {
            type: String,
            required: true
        },
        unitPrice: {
            type: Number,
            required: true,
            min: 0
        },
        total: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paidAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    remainingAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    purchaseDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    deliveryDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    invoiceNumber: {
        type: String,
        trim: true
    },
    notes: {
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

purchaseSchema.index({ purchaseNumber: 1 });
purchaseSchema.index({ supplier: 1 });
purchaseSchema.index({ project: 1 });
purchaseSchema.index({ purchaseDate: -1 });

purchaseSchema.pre('save', async function (next) {
    // Generate purchaseNumber if not provided
    if (!this.purchaseNumber || this.purchaseNumber.startsWith('TEMP-')) {
        try {
            const count = await mongoose.model('Purchase').countDocuments();
            this.purchaseNumber = `PUR-${Date.now()}-${count + 1}`;
        } catch (error) {
            this.purchaseNumber = `PUR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
    }

    // Calculate remainingAmount
    this.remainingAmount = this.totalAmount - this.paidAmount;

    next();
});

// Ensure purchaseNumber is set before validation
purchaseSchema.pre('validate', function (next) {
    if (!this.purchaseNumber) {
        this.purchaseNumber = `TEMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
});

// Update Supplier totals after save
purchaseSchema.post('save', async function (doc) {
    await updateSupplierBalance(doc.supplier);
});

// Update Supplier totals after delete
purchaseSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await updateSupplierBalance(doc.supplier);
    }
});

async function updateSupplierBalance(supplierId) {
    try {
        const Supplier = mongoose.model('Supplier');
        const Purchase = mongoose.model('Purchase');

        const purchases = await Purchase.find({ supplier: supplierId });
        const totalPurchases = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

        const supplier = await Supplier.findById(supplierId);
        if (supplier) {
            supplier.totalPurchases = totalPurchases;
            await supplier.save(); // Also updates totalRemaining via Supplier pre-save
        }
        console.log(`✅ [PurchaseHook] Updated Supplier ${supplierId} totalPurchases to ${totalPurchases}`);
    } catch (error) {
        console.error(`❌ [PurchaseHook] Failed to update Supplier balance:`, error.message);
    }
}

// Update Material quantities after save
purchaseSchema.post('save', async function (doc) {
    console.log(`🚀 [PurchaseHook] TRIGGERED for Purchase: ${doc.purchaseNumber}`);
    try {
        const Material = mongoose.model('Material');
        console.log(`📦 [PurchaseHook] Items to process: ${doc.items?.length}`);
        for (const item of doc.items) {
            console.log(`🔍 [PurchaseHook] Updating Material ID: ${item.material}, Quantity: +${item.quantity}`);
            const updatedMaterial = await Material.findByIdAndUpdate(item.material, {
                $inc: { quantity: item.quantity }
            }, { new: true });

            if (updatedMaterial) {
                console.log(`✅ [PurchaseHook] SUCCESS: Material ${updatedMaterial.name} new quantity: ${updatedMaterial.quantity}`);
            } else {
                console.warn(`⚠️ [PurchaseHook] WARNING: Material not found for ID: ${item.material}`);
            }
        }
    } catch (error) {
        console.error(`❌ [PurchaseHook] ERROR updating Material inventory:`, error.message);
    }
});


// Update Material quantities after delete (decrement)
purchaseSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        try {
            const Material = mongoose.model('Material');
            for (const item of doc.items) {
                await Material.findByIdAndUpdate(item.material, {
                    $inc: { quantity: -item.quantity }
                });
                console.log(`✅ [PurchaseHook] Decremented Material ${item.material} by ${item.quantity} (on delete)`);
            }
        } catch (error) {
            console.error(`❌ [PurchaseHook] Failed to update Material inventory on delete:`, error.message);
        }
    }
});




const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
=======



>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
