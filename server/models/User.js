const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    minlength: 6
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  role: {
    type: String,
    enum: ['client', 'contractor'],
    default: 'client'
  },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  companyName: { type: String, trim: true },
  website: { type: String, trim: true },
  description: { type: String, trim: true },
  bio: { type: String, trim: true },
  company: { type: String, trim: true },
  profilePicture: { type: String },

  // Social / public-profile extras
  city: { type: String, trim: true },
  specialty: { type: String, trim: true },
  yearsExperience: { type: Number, min: 0 },
  avatarUri: { type: String },

  /** آخر نشاط في التطبيق (للظهور في المحادثة وغيرها) */
  lastActiveAt: { type: Date },

  // Stripe Customer (created on first card save)
  stripeCustomerId: { type: String, index: true }
}, {
  timestamps: true
});

userSchema.index({ name: 'text', email: 'text', specialty: 'text', city: 'text' });

module.exports = mongoose.model('User', userSchema);
