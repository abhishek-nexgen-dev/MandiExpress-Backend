import { Router } from 'express';
const router = Router();
import AuthController from './Auth.controller.mjs';
import upload from '../../../utils/multerUtils.mjs';

router.post('/v1/auth/login', AuthController.Login);

router.post('/v1/auth/SignUp',  upload.single('profileImage'), AuthController.SignUp);

export { router as AuthRouter };
