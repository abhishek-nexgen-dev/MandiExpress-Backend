import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Authentication from "./Auth.model.mjs";
import { SignUp_Validator } from "./Auth.validator.mjs";

class AuthUtility {

  async SignUP_Validator({ name, email, password, confirm_Password }) {
    try {
      const { error } = SignUp_Validator.validate({
        name,
        email,
        password,
        confirm_Password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Finds a user by email in the Authentication collection.
   * @param {String} email - The email to search for.
   * @returns {Object|null} - The user document or null if not found.
   */
  async FindByEmail(email) {
    return Authentication.findOne({ email });
  }

  /**
   * Generates a random password.
   * @returns {String} - A randomly generated password.
   */
  generatePassword() {
    return Math.random().toString(36).slice(-8);
  }


  async generateOTP() {
    const otp = crypto.randomInt(100000, 999999).toString();
    return otp;
  }


  async hashPassword(password) {
    return await bcrypt.hash(password, 15);
  }

  
  async hashEmail(email) {
    try {
      if (!email) {
        throw new Error("Email is required to generate a token.");
      }

      const JwtEmail = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return JwtEmail;
    } catch (error) {
      throw new Error(error.message);
    }
  }


  async comparePassword(password, hash) {
    try {
      const match = await bcrypt.compare(password, hash);
      if (!match) {
        throw new Error("Failed to match password.");
      }
      return match;
    } catch (error) {
      throw new Error(`Error comparing password: ${error.message}`);
    }
  }

  async checkRole(email) {
    try {
      const user = await Authentication.findOne({ email });
      if (!user) {
        throw new Error("User not found.");
      }
      return user.role;
    } catch (error) {
      throw new Error(`Error checking user role: ${error.message}`);
    }
  }


  async DecodeToken(token) {
    try {
      if (!token) {
        throw new Error("Token is missing.");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.email) {
        throw new Error("Invalid token: Missing email in payload.");
      }

      return decoded.email;
    } catch (error) {
      console.error("Error decoding token:", error.message);
      throw new Error(`Error decoding token: ${error.message}`);
    }
  }
}

export default new AuthUtility();
