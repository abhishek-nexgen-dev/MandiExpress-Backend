import Joi from 'joi';

// Validator for creating a new product
export const createProductValidator = Joi.object({
  title: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Title is required.',
  }),
  type: Joi.string().valid('auction', 'direct').required().messages({
    'any.only': "Type must be either 'auction' or 'direct'.",
  }),
  quantity: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Quantity is required.',
  }),
  startPrice: Joi.number().min(0).required().messages({
    'number.min': 'Start price must be at least 0.',
  }),
  expiryTime: Joi.date().greater('now').optional().messages({
    'date.greater': 'Expiry time must be in the future.',
  }),
  location: Joi.object({
    type: Joi.string().valid('Point').required().messages({
      'any.only': "Location type must be 'Point'.",
    }),
    coordinates: Joi.array().items(Joi.number()).length(2).required().messages({
      'array.length':
        'Coordinates must contain exactly two numbers (longitude, latitude).',
    }),
  }).optional(),
  supplier_Id: Joi.string().optional(),
  status: Joi.string()
    .valid('open', 'closed', 'expired')
    .default('open')
    .optional(),

  files: Joi.array()
    .min(1)
    .required()
    .messages({
      'array.base': 'Files must be an array.',
      'array.min': 'At least one file is required.',
    })
    .items(
      Joi.string().messages({
        'string.uri': 'Each image must be a valid URL.',
        'string.empty': 'Image URL cannot be empty.',
      })
    )
    .required()
    .messages({
      'array.base': 'Images must be an array of URLs.',
      'array.empty': 'At least one image is required.',
    }),

  createdBy: Joi.string().required().messages({
    'string.empty': 'Created by is required.',
  }),

  description: Joi.string().trim().optional(),

  label: Joi.string().trim().optional().messages({
    'string.empty': 'Label must be a valid string.',
  }),
  productSize: Joi.string(),
  star: Joi.number().min(0).default(0).optional().messages({
    'number.min': 'Star rating must be at least 0.',
  }),
  flavors: Joi.array()
    .items(
      Joi.string()
        .valid('Peanut Butter', 'Vanilla', 'Chocolate', 'Unflavored')
        .messages({
          'any.only':
            "Flavor must be one of 'Peanut Butter', 'Vanilla', 'Chocolate', or 'Unflavored'.",
        })
    )
    .optional(),
});

// Validator for updating a product
export const updateProductValidator = Joi.object({
  title: Joi.string().trim().optional(),
  type: Joi.string().valid('auction', 'direct').optional().messages({
    'any.only': "Type must be either 'auction' or 'direct'.",
  }),
  quantity: Joi.string().trim().optional(),
  startPrice: Joi.number().min(0).optional().messages({
    'number.min': 'Start price must be at least 0.',
  }),
  expiryTime: Joi.date().greater('now').optional().messages({
    'date.greater': 'Expiry time must be in the future.',
  }),
  location: Joi.object({
    type: Joi.string().valid('Point').optional().messages({
      'any.only': "Location type must be 'Point'.",
    }),
    coordinates: Joi.array().items(Joi.number()).length(2).optional().messages({
      'array.length':
        'Coordinates must contain exactly two numbers (longitude, latitude).',
    }),
  }).optional(),
  status: Joi.string().valid('open', 'closed', 'expired').optional(),
  images: Joi.array()
    .items(
      Joi.string().uri().messages({
        'string.uri': 'Each image must be a valid URL.',
      })
    )
    .optional(),
  description: Joi.string().trim().optional(),
  supplierId: Joi.string().optional(),
  label: Joi.string().trim().optional().messages({
    'string.empty': 'Label must be a valid string.',
  }),
  productSize: Joi.string()
    .valid('small', 'medium', 'large')
    .optional()
    .messages({
      'any.only': "Product size must be 'small', 'medium', or 'large'.",
    }),
  star: Joi.number().min(0).max(5).optional().messages({
    'number.min': 'Star rating must be at least 0.',
    'number.max': 'Star rating must not exceed 5.',
  }),
  flavors: Joi.array()
    .items(
      Joi.string()
        .valid('Peanut Butter', 'Vanilla', 'Chocolate', 'Unflavored')
        .messages({
          'any.only':
            "Flavor must be one of 'Peanut Butter', 'Vanilla', 'Chocolate', or 'Unflavored'.",
        })
    )
    .optional(),
});
