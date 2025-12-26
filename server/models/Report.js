const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportNumber: {
    type: String,
    unique: true,
    required: true
  },
  reportType: {
    type: String,
    enum: ['financial', 'inventory', 'project', 'supplier', 'custom', 'invoice'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  title: {

    type: String,
    required: true,
    trim: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  period: {
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  content: {
    type: String
  },

  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  strictPopulate: false
});

reportSchema.index({ reportType: 1 });
reportSchema.index({ generatedAt: -1 });

reportSchema.pre('validate', async function (next) {
  if (!this.reportNumber) {
    try {
      const count = await mongoose.model('Report').countDocuments();
      this.reportNumber = `RPT-${Date.now()}-${count + 1}`;
    } catch (err) {
      this.reportNumber = `RPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
  }
  next();
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
