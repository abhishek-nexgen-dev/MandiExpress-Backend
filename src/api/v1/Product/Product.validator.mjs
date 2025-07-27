import Joi from "joi";

// Validator for creating a new product
export const createProductValidator = Joi.object({
  title: Joi.string().trim().min(1).required().messages({
    "string.empty": "Title is required.",
  }),
  type: Joi.string()
    .valid("auction", "direct")
    .required()
    .messages({
      "any.only": "Type must be either 'auction' or 'direct'.",
    }),
  quantity: Joi.string().trim().min(1).required().messages({
    "string.empty": "Quantity is required.",
  }),
  startPrice: Joi.number().min(0).required().messages({
    "number.min": "Start price must be at least 0.",
  }),
  expiryTime: Joi.date()
    .greater("now")
    .required()
    .messages({
      "date.greater": "Expiry time must be in the future.",
    }),
  location: Joi.object({
    type: Joi.string().valid("Point").required().messages({
      "any.only": "Location type must be 'Point'.",
    }),
    coordinates: Joi.array()
      .items(Joi.number())
      .length(2)
      .required()
      .messages({
        "array.length":
          "Coordinates must contain exactly two numbers (longitude, latitude).",
      }),
  }).required(),
  status: Joi.string()
    .valid("open", "closed", "expired")
    .default("open")
    .optional(),
  images: Joi.array()
    .items(
      Joi.string().uri().messages({
        "string.uri": "Each image must be a valid URL.",
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one image is required.",
    }),
  description: Joi.string().trim().optional(),
  createdBy: Joi.string().min(1).required().messages({
    "string.empty": "CreatedBy is required.",
  }),
  supplierId: Joi.string().min(1).required().messages({
    "string.empty": "SupplierId is required.",
  }),
});

// Validator for updating a product
export const updateProductValidator = Joi.object({
  title: Joi.string().trim().optional(),
  type: Joi.string()
    .valid("auction", "direct")
    .optional()
    .messages({
      "any.only": "Type must be either 'auction' or 'direct'.",
    }),
  quantity: Joi.string().trim().optional(),
  startPrice: Joi.number().min(0).optional().messages({
    "number.min": "Start price must be at least 0.",
  }),
  expiryTime: Joi.date()
    .greater("now")
    .optional()
    .messages({
      "date.greater": "Expiry time must be in the future.",
    }),
  location: Joi.object({
    type: Joi.string().valid("Point").optional().messages({
      "any.only": "Location type must be 'Point'.",
    }),
    coordinates: Joi.array()
      .items(Joi.number())
      .length(2)
      .optional()
      .messages({
        "array.length":
          "Coordinates must contain exactly two numbers (longitude, latitude).",
      }),
  }).optional(),
  status: Joi.string()
    .valid("open", "closed", "expired")
    .optional(),
  images: Joi.array()
    .items(
      Joi.string().uri().messages({
        "string.uri": "Each image must be a valid URL.",
      })
    )
    .optional(),
  description: Joi.string().trim().optional(),
  supplierId: Joi.string().optional(),
});
