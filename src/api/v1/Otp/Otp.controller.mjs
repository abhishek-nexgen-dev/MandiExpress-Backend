import OtpService from './Otp.service.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import userSchema from '../user/user.schema.mjs';

import AuthUtils from '../Auth/Auth.utils.mjs';

class OtpController {
  async generateOtp(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        throw new Error('Email is required to generate OTP.');
      }

      // Generate and save OTP
      const otp = await OtpService.generateOtp(email);

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        'OTP generated successfully.',
        { email, otp }
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Error generating OTP.'
      );
    }
  }

  async validateOtp(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        throw new Error('Email and OTP are required for validation.');
      }

      const isActive = await AuthUtils.isUserActive(email);

      const isValid = await OtpService.validateOtp(email, otp);

      if (!isActive && !isValid) {
        console.log('User is not active and OTP is invalid.');
        await userSchema.updateOne(
          { email },
          {
            $set: {
              isActive: true,
              emailVerified: true,
            },
          }
        );
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'OTP validated successfully.'
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Error validating OTP.'
      );
    }
  }
}

export default new OtpController();
