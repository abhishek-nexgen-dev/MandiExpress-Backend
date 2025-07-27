import { Router } from 'express';
const router = Router();
import vendorController from './supplier.controller.mjs';
import upload from '../../../utils/multerUtils.mjs';
import authMiddleware from '../../../middleware/Auth.middleware.mjs';

// POST /api/v1/vendor/category/create
// Only accessible by users with the "supplier" role
router.post(
  '/v1/vendor/category/create',
  authMiddleware(['supplier']),
  upload.single('CategoryImage'),
  vendorController.createCategory
);


// POST /api/v1/vendor/product/create
// Only accessible by users with the "supplier" role
router.post(
  '/v1/vendor/product/create',
  authMiddleware(['supplier']),
  upload.array('images', 5), // Allow up to 5 images
  vendorController.createProduct
);

export { router as Supplier_Routes };
