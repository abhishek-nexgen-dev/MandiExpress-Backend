import { request, response } from "express";
import SendResponse from "../../../utils/SendResponse.mjs";

import AuthConstant from "./Auth.constant.mjs";
import StatusCodeConstant from "../../../constant/StatusCode.constant.mjs";
import userService from "../user/user.service.mjs";
import OtpService from "../Otp/Otp.service.mjs";
import AuthUtils from "./Auth.utils.mjs";

class AuthController {

  async SignUp(req, res) {
    try {
      const { email, name, role } = req.body;
      const { filename } = req.file || {};
      console.log("Received file:", filename);

      
   


      const existingUser = await AuthUtils.FindByEmail(email);
      if (existingUser) {
       throw new Error(AuthConstant.USER_ALREADY_EXISTS);
      }

  
  


      const newUser = await userService.createUser({
       data: {...req.body },
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
      console.error("Error during user signup:", error);
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
      const { email } = req.body;


   const isActive = await AuthUtils.isUserActive(email);
   console.log("User active status:", isActive);

   if (!isActive) {
       throw new Error('User is not active. Please activate your account first.');
    }


      // // Validate OTP
      const isOtpValid = await OtpService.validateOtp(email, otp);
      if (!isOtpValid) {
        return SendResponse.error(
          res,
          StatusCodeConstant.BAD_REQUEST,
          AuthConstant.INVALID_OTP
        );
      }

      // // Find the user by email
      const user = await userService.findUserByEmail(email);
      if (!user) {
        return SendResponse.error(
          res,
          StatusCodeConstant.BAD_REQUEST,
          AuthConstant.USER_NOT_FOUND
        );
      }

      // // Activate the user if not already active
      if (!user.isActive) {
        user.isActive = true;
        await user.save();
      }

      // // Generate a token for the user
      const token = AuthUtility.generateToken(user.email);

      // // Set the token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // // Prepare the response data
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
