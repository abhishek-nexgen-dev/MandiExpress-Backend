import express from 'express';
import OtpController from './Otp.controller.mjs';

const router = express.Router();


router.post('/generate', OtpController.generateOtp);


router.post('/validate', OtpController.validateOtp);

export default router;