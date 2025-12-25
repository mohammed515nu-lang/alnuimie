const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportNumber: {
    type: String,
    unique: true,
    required: true
  },
  reportType: {
    type: String,
<<<<<<< HEAD
    enum: ['financial', 'inventory', 'project', 'supplier', 'custom', 'invoice'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  title: {

=======
    enum: ['financial', 'inventory', 'project', 'supplier', 'custom'],
    required: true
  },
  title: {
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
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
<<<<<<< HEAD
  content: {
    type: String
  },

=======
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
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
<<<<<<< HEAD
  timestamps: true,
  strictPopulate: false
=======
  timestamps: true
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
});

reportSchema.index({ reportType: 1 });
reportSchema.index({ generatedAt: -1 });

<<<<<<< HEAD
reportSchema.pre('validate', async function (next) {
  if (!this.reportNumber) {
    try {
      const count = await mongoose.model('Report').countDocuments();
      this.reportNumber = `RPT-${Date.now()}-${count + 1}`;
    } catch (err) {
      this.reportNumber = `RPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
=======
reportSchema.pre('save', async function(next) {
  if (!this.reportNumber) {
    const count = await mongoose.model('Report').countDocuments();
    this.reportNumber = `RPT-${Date.now()}-${count + 1}`;
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
  }
  next();
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
<<<<<<< HEAD
=======




















>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
