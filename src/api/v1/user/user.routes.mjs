import { Router } from 'express';
import userController from './user.controller.mjs';
import upload from '../../../utils/multerUtils.mjs';

const router = Router();

// Ensure the field name matches the request
router.post(
  '/v1/createNewUser',
  upload.single('profileImage'),
  userController.createUser
);

export { router as userRoutes };
