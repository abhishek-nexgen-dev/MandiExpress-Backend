import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["auction", "direct"], // Auction or direct sale in auction give timer to bidding
      default: "auction",
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
        enum: ["Point"], // GeoJSON type
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["open", "closed", "expired"],
      default: "open",
    },
    image: {
      type: String, // URL of the image
      required: false,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
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

ProductSchema.index({ location: "2dsphere" }); // Geospatial index for location

export default mongoose.model("product", ProductSchema);