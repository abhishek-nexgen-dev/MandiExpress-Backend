import { Router } from 'express';
const router = Router();
import supplierController from './supplier.controller.mjs'; // Corrected import
import upload from '../../../utils/multerUtils.mjs';
import authMiddleware from '../../../middleware/Auth.middleware.mjs';

// POST /api/v1/vendor/category/create
// Only accessible by users with the "supplier" role
router.post(
  '/v1/vendor/category/create',
  authMiddleware(['supplier']),
  upload.single('CategoryImage'), // Multer middleware for single file upload
  supplierController.createCategory // Ensure this is a valid function
);

// POST /api/v1/vendor/product/create
// Only accessible by users with the "supplier" role
router.post(
  '/v1/vendor/product/create',
  authMiddleware(['supplier']),
  upload.array('images', 5), // Multer middleware for multiple file uploads (max 5 Image Uploads)
  supplierController.createProduct
);

export { router as Supplier_Routes };
