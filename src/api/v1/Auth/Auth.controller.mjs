import { request, response } from 'express';
import SendResponse from '../../../utils/SendResponse.mjs';

import AuthConstant from './Auth.constant.mjs';
import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import userService from '../user/user.service.mjs';
import OtpService from '../Otp/Otp.service.mjs';
import AuthUtils from './Auth.utils.mjs';
import AuthService from './Auth.service.mjs';

class AuthController {
  async SignUp(req, res) {
    try {
      const { email, name, role } = req.body;
      const { filename } = req.file || {};
      console.log('Received file:', filename);

      const existingUser = await AuthUtils.FindByEmail(email);
      if (existingUser) {
        throw new Error(AuthConstant.USER_ALREADY_EXISTS);
      }

      const newUser = await userService.createUser({
        data: { ...req.body },
        ProfileImage: filename,
      });

      if (!newUser) {
        throw new Error(AuthConstant.USER_CREATION_FAILED);
      }

      const otp = await OtpService.generateOtp(email);

      await OtpService.sendOtpEmail(email, otp, name);

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        AuthConstant.OTP_SENT,
        { user: newUser }
      );
    } catch (error) {
      console.error('Error during user signup:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Error signing up user'
      );
    }
  }

  async sendLoginOtp(req = request, res = response) {
    try {
      const { email } = req.body;

      const user = await AuthUtils.FindByEmail(email);
      if (!user) {
        return SendResponse.error(
          res,
          StatusCodeConstant.BAD_REQUEST,
          AuthConstant.USER_NOT_FOUND
        );
      }

      const otp = await OtpService.generateOtp(email);

      await OtpService.sendOtpEmail(email, otp, user.name);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'OTP sent successfully.',
        { email }
      );
    } catch (error) {
      console.error('Error during sending login OTP:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Error sending login OTP'
      );
    }
  }

  async validateLoginOtp(req = request, res = response) {
    try {
      const { email, otp } = req.body;

      const user = await AuthUtils.FindByEmail(email);

      if (!user) {
        throw new Error(AuthConstant.USER_NOT_FOUND);
      }

      const isOtpValid = await OtpService.validateOtp(email, otp);
      if (!isOtpValid) {
        throw new Error('Invalid OTP or email.');
      }

      if (!user.isActive && !user.emailVerified) {
        await userService.updateUser(email, {
          isActive: true,
          emailVerified: true,
        });
        user.isActive = true;
      }

      const token = await AuthUtils.generateToken({
        email: user.email,
        userId: user._id,
        role: user.role,
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      let update_Token = await AuthService.UpdateUserToken(
        user.email,
        String(token)
      );

      const data = {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          emailVerified: true,
          profileImage: user.profileImage,
          token: update_Token,
        },
      };

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        AuthConstant.USER_LOGIN_SUCCESS,
        data
      );
    } catch (error) {
      console.error('Error during OTP validation for login:', error);
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Error validating login OTP'
      );
    }
  }
}

export default new AuthController();
