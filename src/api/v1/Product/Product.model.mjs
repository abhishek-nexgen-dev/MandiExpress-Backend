import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['auction', 'direct'],
      default: 'auction',
      required: true,
    },
    quantity: {
      type: String,
      required: true,
      trim: true,
    },
    startPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    expiryTime: {
      type: Date,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'], // GeoJSON type
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'expired'],
      default: 'open',
    },
    images: [
      {
        type: String, // URL of the image
        required: true,
      },
    ],
    description: {
      type: String,
      required: false,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the supplier
      required: true,
    },
    bids: [
      {
        bidderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // Reference to the bidder
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        bidTime: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    highestBid: {
      type: Number,
      default: 0, // Defaults to 0 or startPrice
    },
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the highest bidder
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    pin: {
      type: Boolean, // Indicates if the product is pinned
      default: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

ProductSchema.index({ location: '2dsphere' }); // Geospatial index for location

export default mongoose.model('Product', ProductSchema);
