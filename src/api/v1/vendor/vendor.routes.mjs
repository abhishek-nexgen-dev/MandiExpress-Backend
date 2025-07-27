import { Router } from 'express';
import vendorController from './vendor.controller.mjs';
const router = Router();

router.get('/v1/product/:productId', vendorController.findProductById);
router.get('/v1/vendor/products', vendorController.fetchAllProducts);

export { router as VendorRoutes };
