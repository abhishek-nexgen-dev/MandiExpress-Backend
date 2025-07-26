import argon2 from 'argon2';
import mongoose, { model } from 'mongoose';

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
    required: true, // Should be hashed using bcrypt
  },
  role: {
    type: String,
    enum: ['supplier', 'vendor', 'admin', 'customer'],
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
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

// Middleware to update `updatedAt` on save
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  this.password = argon2.hash(this.password)
  next();
});

export default mongoose.model('User', userSchema);