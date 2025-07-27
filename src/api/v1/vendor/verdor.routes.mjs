import { Router } from 'express';
const router = Router();
import vendorController from './vendor.controller.mjs';
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

export { router as vendorRoutes };
