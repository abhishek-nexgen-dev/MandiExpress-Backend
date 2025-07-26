import { Router } from 'express';
const router = Router();
import upload from '../../../utils/multerUtils.mjs';
import AuthController from './Auth.controller.mjs';


router.post('/v1/auth/generate-login-otp', AuthController.sendLoginOtp);
router.post('/v1/auth/validate-login-otp', AuthController.validateLoginOtp);

router.post('/v1/auth/SignUp', upload.single('profileImage'), AuthController.SignUp);

export { router as AuthRouter };
