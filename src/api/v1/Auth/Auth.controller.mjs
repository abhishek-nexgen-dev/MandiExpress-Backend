import { request, response } from "express";
import SendResponse from "../../../utils/SendResponse.mjs";
import AuthConstant from "./Auth.constant.mjs";
import StatusCodeConstant from "../../../constant/StatusCode.constant.mjs";
import userService from "../user/user.service.mjs";
import OtpService from "../Otp/Otp.service.mjs";

class AuthController {
  /**
   * Sign up a new user with OTP-based authentication.
   */
  async SignUp(req, res) {
    try {
      const { email, name, role } = req.body;

      // Check if the user already exists
      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        return SendResponse.error(
          res,
          StatusCodeConstant.BAD_REQUEST,
          AuthConstant.USER_ALREADY_EXISTS
        );
      }

      // Generate OTP
      const otp = await OtpService.generateOtp(email);

      // Send OTP to the user's email
      await OtpService.sendOtpEmail(email, otp, name);

      // Create a new user (inactive until OTP is validated)
      const newUser = await userService.createUser({
        email,
        name,
        role,
        isActive: false, // User will be activated after OTP validation
      });

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        AuthConstant.OTP_SENT,
        { userId: newUser._id, email }
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
      const { email, otp } = req.body;

      // Validate OTP
      const isOtpValid = await OtpService.validateOtp(email, otp);
      if (!isOtpValid) {
        return SendResponse.error(
          res,
          StatusCodeConstant.BAD_REQUEST,
          AuthConstant.INVALID_OTP
        );
      }

      // Find the user by email
      const user = await userService.findUserByEmail(email);
      if (!user) {
        return SendResponse.error(
          res,
          StatusCodeConstant.BAD_REQUEST,
          AuthConstant.USER_NOT_FOUND
        );
      }

      // Activate the user if not already active
      if (!user.isActive) {
        user.isActive = true;
        await user.save();
      }

      // Generate a token for the user
      const token = AuthUtility.generateToken(user.email);

      // Set the token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Prepare the response data
      const data = {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          emailVerified: true, // Mark email as verified after successful OTP login
          profileImage: user.profileImage,
          token,
        },
      };

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
