import argon2 from 'argon2';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
    unique: true,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
  },
  password: {
    type: String,
    required: false, // Optional for OTP-based authentication
  },
  role: {
    type: String,
    enum: ['supplier', 'vendor', 'admin', 'customer'],
    required: true,
  },
  token: {
    type: String,
    required: false, // Optional, can be used for session management
  },
  socket: {
    type: String,
    required: false, // Optional, can be used for real-time communication
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false, // Optional for users without location data
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String, // URL to the profile image
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for geospatial queries
userSchema.index({ location: '2dsphere' });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await argon2.hash(this.password);
  }
  this.updatedAt = Date.now();
  next();
});

// Middleware to update `updatedAt` on update
userSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

export default mongoose.model('User', userSchema);