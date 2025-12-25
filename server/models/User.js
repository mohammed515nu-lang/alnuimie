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
<<<<<<< HEAD
    required: function () {
=======
    required: function() {
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
      return !this.googleId; // Password not required if using Google OAuth
    },
    minlength: 6
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  role: {
    type: String,
    enum: ['client', 'contractor'],
    default: 'client'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  companyName: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
<<<<<<< HEAD
  },
  profilePicture: {
    type: String // We'll store as Base64 or URL
  }

=======
  }
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

