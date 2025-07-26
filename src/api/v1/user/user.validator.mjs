import { z } from 'zod';

// Validation schema for user creation
export const createUserValidator = z.object({
  name: z.string().trim().min(1, { message: 'Name is required.' }),
  email: z.email({ message: 'Please enter a valid email address.' }),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: 'Please enter a valid 10-digit phone number.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' }),
  role: z.enum(['supplier', 'vendor', 'admin', 'customer'], {
    errorMap: () => ({ message: 'Role must be one of supplier, vendor, admin, or customer.' }),
  }),
  location: z.object({
    type: z.literal('Point').default('Point'),
    coordinates: z
      .array(z.number())
      .length(2, { message: 'Coordinates must contain exactly two numbers (longitude and latitude).' }),
  }),
});

// Validation schema for user updates
export const updateUserValidator = z.object({
  name: z.string().trim().optional(),
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: 'Please enter a valid 10-digit phone number.' })
    .optional(),
  password: z.string().min(6).optional(),
  role: z
    .enum(['supplier', 'vendor', 'admin', 'customer'])
    .optional(),
  location: z
    .object({
      type: z.literal('Point').optional(),
      coordinates: z
        .array(z.number())
        .length(2, { message: 'Coordinates must contain exactly two numbers (longitude and latitude).' })
        .optional(),
    })
    .optional(),
  isActive: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  phoneVerified: z.boolean().optional(),
  profileImage: z.string().url().optional(),
});