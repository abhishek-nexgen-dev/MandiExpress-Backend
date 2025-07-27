import { Router } from 'express';
import vendorController from './vendor.controller.mjs';
const router = Router();

router.get('/v1/product/:productId', vendorController.findProductById);

export { router as VendorRoutes };
