import { z } from "zod";

// Validator for creating a new product
export const createProductValidator = z.object({
  title: z.string().trim().min(1, { message: "Title is required." }),
  type: z.enum(["auction", "direct"], {
    errorMap: () => ({ message: "Type must be either 'auction' or 'direct'." }),
  }),
  quantity: z.number().min(1, { message: "Quantity must be at least 1." }),
  startPrice: z.number().min(0, { message: "Start price must be at least 0." }),
  expiryTime: z
    .date()
    .refine((date) => date > new Date(), {
      message: "Expiry time must be in the future.",
    }),
  location: z.object({
    type: z.literal("Point", {
      errorMap: () => ({ message: "Location type must be 'Point'." }),
    }),
    coordinates: z
      .array(z.number(), {
        invalid_type_error: "Coordinates must be an array of numbers.",
      })
      .length(2, { message: "Coordinates must contain exactly two numbers (longitude, latitude)." }),
  }),
  status: z
    .enum(["open", "closed", "expired"])
    .default("open")
    .optional(),
  image: z.string()({ message: "Image must be a valid URL." }).optional(),
  description: z.string().trim().optional(),
  createdBy: z.string().min(1, { message: "CreatedBy is required." }),
  supplierId: z.string().min(1, { message: "SupplierId is required." }),
});

// Validator for updating a product
export const updateProductValidator = z.object({
  title: z.string().trim().optional(),
  type: z.enum(["auction", "direct"]).optional(),
  quantity: z.number().min(1, { message: "Quantity must be at least 1." }).optional(),
  startPrice: z.number().min(0, { message: "Start price must be at least 0." }).optional(),
  expiryTime: z
    .date()
    .refine((date) => date > new Date(), {
      message: "Expiry time must be in the future.",
    })
    .optional(),
  location: z
    .object({
      type: z.literal("Point").optional(),
      coordinates: z
        .array(z.number())
        .length(2, { message: "Coordinates must contain exactly two numbers (longitude, latitude)." })
        .optional(),
    })
    .optional(),
  status: z.enum(["open", "closed", "expired"]).optional(),
  image: z.string().url({ message: "Image must be a valid URL." }).optional(),
  description: z.string().trim().optional(),
  supplierId: z.string().optional(),
});

// Validator for creating a new category
export const createCategoryValidator = z.object({
  name: z.string().trim().min(1, { message: "Category name is required." }),
  description: z.string().trim().optional(),
  image: z.string()({ message: "Image must be a valid URL." }).optional(),
  isActive: z.boolean().default(true).optional(),
  isPin: z.boolean().default(false).optional(),
  products: z
    .array(
      z.object({
        product: z.string().min(1, { message: "Product ID is required." }),
        addedAt: z.date().optional(),
      })
    )
    .optional(),
  createdBy: z.string().min(1, { message: "CreatedBy (User ID) is required." }),
});

// Validator for updating a category
export const updateCategoryValidator = z.object({
  name: z.string().trim().optional(),
  description: z.string().trim().optional(),
  image: z.string().url({ message: "Image must be a valid URL." }).optional(),
  isActive: z.boolean().optional(),
  isPin: z.boolean().optional(),
  products: z
    .array(
      z.object({
        product: z.string().min(1, { message: "Product ID is required." }),
        addedAt: z.date().optional(),
      })
    )
    .optional(),
});