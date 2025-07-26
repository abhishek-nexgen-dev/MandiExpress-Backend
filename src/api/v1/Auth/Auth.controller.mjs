import { request, response } from "express";
import SendResponse from "../../../utils/SendResponse.mjs";
import AuthUtility from "./Auth.utils.mjs";
import AuthConstant from "./Auth.constant.mjs";
import StatusCodeConstant from "../../../constant/StatusCode.constant.mjs";
import envConstant from "../../../constant/env.constant.mjs";
import userService from "../user/user.service.mjs";

class AuthController {
 
  async SignUp(req, res) {
    try {
      const { email, phone, role } = req.body;

 
      const existingUser = await userService.findUserByEmailOrPhone(email, phone);
      if (existingUser) {
        throw new Error(AuthConstant.USER_ALREADY_EXISTS);
      }

      
      const otp = AuthUtility.generateOTP();

      // Create the user
      const createdUser = await userService.createUser({
        ...req.body,
        otp,
      });

 
      await AuthUtility.sendOTP(email, phone, otp);

      // Send the response
      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        AuthConstant.OTP_SENT,
        { userId: createdUser._id }
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || "Error signing up user"
      );
    }
  }

  /**
   * Log in an existing user with OTP.
   */
  async Login(req = request, res = response) {
    try {
      const { phone, otp } = req.body;

      // Find the user by phone
      const user = await userService.findUserByPhone(phone);
      if (!user) {
        return SendResponse.error(
          res,
          StatusCodeConstant.BAD_REQUEST,
          AuthConstant.USER_NOT_FOUND
        );
      }

      // Validate the OTP
      const isOtpValid = AuthUtility.validateOTP(otp, user.otp);
      if (!isOtpValid) {
        return SendResponse.error(
          res,
          StatusCodeConstant.BAD_REQUEST,
          AuthConstant.INVALID_OTP
        );
      }

      // Generate a token for the user
      const token = AuthUtility.generateToken(user.email);

      // Set the token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: envConstant.NODE_ENV === "production",
        sameSite: envConstant.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Prepare the response data
      const data = {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          emailVerified: user.emailVerified,
          phoneVerified: true, // Mark phone as verified after successful OTP login
          profileImage: user.profileImage,
          token,
        },
      };

      // Send the response
      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        AuthConstant.USER_LOGIN_SUCCESS,
        data
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || "Error logging in user"
      );
    }
  }
}

export default new AuthController();
