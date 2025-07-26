import { request, response } from "express";
import SendResponse from "../../../utils/SendResponse.mjs";
import AuthenticationSchema from "./Auth.model.mjs";
import AuthUtility from "./Auth.utils.mjs";
import AuthConstant from "./Auth.constant.mjs";
import StatusCodeConstant from "../../../constant/StatusCode.constant.mjs";
import envConstant from "../../../constant/env.constant.mjs";
import userService from "../user/user.service.mjs";

class AuthController {
  /**
   * Sign up a new admin user.
   */
  async SignUP_Admin(req, res) {
    try {
      const { email ,  password} = req.body;

      
      // Check if the user already exists
      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
       throw new Error(AuthConstant.USER_ALREADY_EXISTS);
      }

      // Hash the password
      const hashedPassword = await AuthUtility.hashPassword(password);
      const token = await AuthUtility.hashEmail(email);

      // Create the user
      const createdUser = await userService.createUser({
        ...req.body,
        token,
        fileName: req.file?.filename,
      });

      // Generate a token for the user

      // Set the token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: envConstant.NODE_ENV === "production",
        sameSite: envConstant.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Send the response
      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        AuthConstant.USER_CREATED,
        { user: createdUser, token }
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || "Error creating admin"
      );
    }
  }

  /**
   * Log in an existing user.
   */
  async Login(req = request, res = response) {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await userService.findUserByEmail(email);
      if (!user) {
        return SendResponse.error(
          res,
          StatusCodeConstant.BAD_REQUEST,
          AuthConstant.USER_NOT_FOUND
        );
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await AuthUtility.comparePassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        return SendResponse.error(
          res,
          StatusCodeConstant.BAD_REQUEST,
          AuthConstant.INVALID_PASSWORD
        );
      }

      // Generate a token for the user
      const token = await AuthUtility.hashEmail(email);

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
          phoneVerified: user.phoneVerified,
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
