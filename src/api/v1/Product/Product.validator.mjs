import Joi from "joi";

// Validator for creating a new product
export const createProductValidator = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "Title is required.",
    "any.required": "Title is required.",
  }),
  type: Joi.string()
    .valid("auction", "direct")
    .required()
    .messages({
      "any.only": "Type must be either 'auction' or 'direct'.",
      "any.required": "Type is required.",
    }),
  quantity: Joi.string().trim().required().messages({
    "string.empty": "Quantity is required.",
    "any.required": "Quantity is required.",
  }),
  startPrice: Joi.number().min(0).required().messages({
    "number.base": "Start price must be a number.",
    "number.min": "Start price must be at least 0.",
    "any.required": "Start price is required.",
  }),
  expiryTime: Joi.date().greater("now").required().messages({
    "date.base": "Expiry time must be a valid date.",
    "date.greater": "Expiry time must be in the future.",
    "any.required": "Expiry time is required.",
  }),
  location: Joi.object({
    type: Joi.string().valid("Point").required().messages({
      "any.only": "Location type must be 'Point'.",
      "any.required": "Location type is required.",
    }),
    coordinates: Joi.array()
      .items(Joi.number())
      .length(2)
      .required()
      .messages({
        "array.base": "Coordinates must be an array of numbers.",
        "array.length": "Coordinates must contain exactly two numbers (longitude, latitude).",
        "any.required": "Coordinates are required.",
      }),
  }).required(),
  status: Joi.string()
    .valid("open", "closed", "expired")
    .default("open")
    .messages({
      "any.only": "Status must be one of 'open', 'closed', or 'expired'.",
    }),
  image: Joi.string().uri().optional().messages({
    "string.uri": "Image must be a valid URL.",
  }),
  description: Joi.string().trim().optional().messages({
    "string.base": "Description must be a string.",
  }),
  createdBy: Joi.string().required().messages({
    "string.empty": "CreatedBy is required.",
    "any.required": "CreatedBy is required.",
  }),
  supplierId: Joi.string().required().messages({
    "string.empty": "SupplierId is required.",
    "any.required": "SupplierId is required.",
  }),
});

// Validator for updating a product
export const updateProductValidator = Joi.object({
  title: Joi.string().trim().optional(),
  type: Joi.string().valid("auction", "direct").optional(),
  quantity: Joi.string().trim().optional(),
  startPrice: Joi.number().min(0).optional(),
  expiryTime: Joi.date().greater("now").optional(),
  location: Joi.object({
    type: Joi.string().valid("Point").optional(),
    coordinates: Joi.array().items(Joi.number()).length(2).optional(),
  }).optional(),
  status: Joi.string().valid("open", "closed", "expired").optional(),
  image: Joi.string().uri().optional(),
  description: Joi.string().trim().optional(),
  supplierId: Joi.string().optional(),
});