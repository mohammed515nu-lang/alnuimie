const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    contractNumber: {
        type: String,
        unique: true,
        required: false
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    contractor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    contractType: {
        type: String,
        enum: ['client', 'supplier'],
        required: true
    },
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
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'cancelled'],
        default: 'draft'
    },
    terms: {
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

contractSchema.index({ contractNumber: 1 });
contractSchema.index({ project: 1 });
contractSchema.index({ client: 1 });
contractSchema.index({ contractor: 1 });

contractSchema.pre('save', async function (next) {
    if (!this.contractNumber || this.contractNumber.startsWith('TEMP-')) {
        try {
            const type = this.contractType === 'client' ? 'CLT' : 'SUP';
            const count = await mongoose.model('Contract').countDocuments();
            this.contractNumber = `${type}-${Date.now()}-${count + 1}`;
        } catch (error) {
            this.contractNumber = `CON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
    }

    this.remainingAmount = this.totalAmount - this.paidAmount;
    next();
});

contractSchema.pre('validate', function (next) {
    if (!this.contractNumber) {
        this.contractNumber = `TEMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
