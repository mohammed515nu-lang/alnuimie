<<<<<<< HEAD
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    issueNumber: {
        type: String,
        unique: true,
        required: false
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
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
    issueDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    issuedTo: {
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

issueSchema.index({ issueNumber: 1 });
issueSchema.index({ project: 1 });
issueSchema.index({ issueDate: -1 });

issueSchema.pre('save', async function (next) {
    if (!this.issueNumber || this.issueNumber.startsWith('TEMP-')) {
        try {
            const count = await mongoose.model('Issue').countDocuments();
            this.issueNumber = `ISS-${Date.now()}-${count + 1}`;
        } catch (error) {
            this.issueNumber = `ISS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
    }
    next();
});

issueSchema.pre('validate', function (next) {
    if (!this.issueNumber) {
        this.issueNumber = `TEMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
});

// Update Material quantities after save (decrement)
issueSchema.post('save', async function (doc) {
    console.log(`🚀 [IssueHook] TRIGGERED for Issue: ${doc.issueNumber}`);
    try {
        const Material = mongoose.model('Material');
        for (const item of doc.items) {
            console.log(`🔍 [IssueHook] Decrementing Material ${item.material} by ${item.quantity}`);
            const updatedMaterial = await Material.findByIdAndUpdate(item.material, {
                $inc: { quantity: -item.quantity }
            }, { new: true });

            if (updatedMaterial) {
                console.log(`✅ [IssueHook] SUCCESS: Material ${updatedMaterial.name} new quantity: ${updatedMaterial.quantity}`);
            } else {
                console.warn(`⚠️ [IssueHook] WARNING: Material not found for ID: ${item.material}`);
            }
        }
    } catch (error) {
        console.error(`❌ [IssueHook] ERROR updating Material inventory:`, error.message);
    }
});

// Update Material quantities after delete (increment back)
issueSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        console.log(`🚀 [IssueHook] TRIGGERED for DELETION of Issue: ${doc.issueNumber}`);
        try {
            const Material = mongoose.model('Material');
            for (const item of doc.items) {
                console.log(`🔍 [IssueHook] Restoring (Incrementing) Material ${item.material} by ${item.quantity}`);
                const updatedMaterial = await Material.findByIdAndUpdate(item.material, {
                    $inc: { quantity: item.quantity }
                }, { new: true });

                if (updatedMaterial) {
                    console.log(`✅ [IssueHook] SUCCESS: Material ${updatedMaterial.name} restored to quantity: ${updatedMaterial.quantity}`);
                }
            }
        } catch (error) {
            console.error(`❌ [IssueHook] ERROR updating Material inventory on delete:`, error.message);
        }
    }
});


const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
=======


>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc

