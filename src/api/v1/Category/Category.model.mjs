import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    image: {
      type: String, // URL for the category image
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true, // Indicates whether the category is active
    },
    isPin: {
      type: Boolean,
      default: false, // Indicates whether the category is pinned
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to the Product model
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now, // Tracks when the product was added to the category
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model("Category", CategorySchema);