import Joi from 'joi';

// Validator for creating a new category
export const createCategoryValidator = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Category name is required.',
  }),
  description: Joi.string().trim().optional(),
  image: Joi.string().required().messages({
    'string.empty': 'Category image is required.',
  }),
  isActive: Joi.boolean().default(true),
  isPin: Joi.boolean().default(false),
  products: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().min(1).required().messages({
          'string.empty': 'Product ID is required.',
        }),
        addedAt: Joi.date().iso().optional().messages({
          'date.format': 'AddedAt must be a valid ISO date string.',
        }),
      })
    )
    .optional(),
  createdBy: Joi.string().min(1).required().messages({
    'string.empty': 'CreatedBy (User ID) is required.',
  }),
});

// Validator for updating a category
export const updateCategoryValidator = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  image: Joi.string().uri().optional().messages({
    'string.uri': 'Image must be a valid URL.',
  }),
  isActive: Joi.boolean().optional(),
  isPin: Joi.boolean().optional(),
  products: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().min(1).required().messages({
          'string.empty': 'Product ID is required.',
        }),
        addedAt: Joi.date().iso().optional().messages({
          'date.format': 'AddedAt must be a valid ISO date string.',
        }),
      })
    )
    .optional(),
});
