import jwt from "jsonwebtoken";
import Crypto from "crypto";
import bcrypt from "bcryptjs";
import userSchema from "../user/user.schema.mjs";

class AuthUtility {



 
  async FindByEmail(email) {
    return userSchema.findOne({ email });
  }

  /**
   * Generates a random password.
   * @returns {String} - A randomly generated password.
   */
  generatePassword() {
    return Math.random().toString(36).slice(-8);
  }

  async isUserActive(email) {
    try {
      const user = await userSchema.findOne({ email });
      if (!user) {
        throw new Error("User not found.");
      }
      return user.isActive;
    } catch (error) {
      throw new Error(`Error checking user activation: ${error.message}`);
    }
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
      const user = await userSchema.findOne({ email });
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

  async generateToken(email) {
    try {
      if (!email) {
        throw new Error("Email is required to generate a token.");
      }

      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });

      return token;
    } catch (error) {
      throw new Error(`Error generating token: ${error.message}`);
    }
  }
}

export default new AuthUtility();
