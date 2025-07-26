import express from 'express';
import OtpController from './Otp.controller.mjs';

const router = express.Router();


router.post('/v1/generate/otp', OtpController.generateOtp);


router.post('/v1/validate/otp', OtpController.validateOtp);

export { router as OtpRouter };