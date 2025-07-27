import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userSchema from '../user/user.schema.mjs';
import envConstant from '../../../constant/env.constant.mjs';

class AuthUtility {
  async FindByEmail(email) {
    return userSchema.findOne({ email });
  }

  async FindByUserId(userId) {
    return await userSchema.findById(userId);
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
        throw new Error('User not found.');
      }
      return user.isActive;
    } catch (error) {
      throw Error(`Error checking user activation: ${error.message}`);
    }
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 15);
  }

  async hashEmail(email) {
    try {
      if (!email) {
        throw new Error('Email is required to generate a token.');
      }

      const JwtEmail = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      return JwtEmail;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async comparePassword(password, hash) {
    try {
      const match = await bcrypt.compare(password, hash);
      if (!match) {
        throw new Error('Failed to match password.');
      }
      return match;
    } catch (error) {
      throw Error(`Error comparing password: ${error.message}`);
    }
  }

  async checkRole(email) {
    try {
      const user = await userSchema.findOne({ email });
      if (!user) {
        throw new Error('User not found.');
      }
      return user.role;
    } catch (error) {
      throw Error(`Error checking user role: ${error.message}`);
    }
  }

  async DecodeToken(token) {
    try {
      if (typeof token !== 'string' || token.trim() === '') {
        throw new Error('Token must be a non-empty string');
      }

      const decoded = jwt.verify(token, envConstant.JWT_SECRET);

      if (!decoded) {
        throw new Error('Invalid token');
      }

      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error.message);
      throw Error(`Error decoding token: ${error.message}`);
    }
  }

  async generateToken({ email, userId, role }) {
    try {
      if (!email) {
        throw new Error('Email is required to generate a token.');
      }

      const token = jwt.sign(
        { email, userId, role },
        envConstant.JWT_SECRET,
        { expiresIn: '5h' } // <-- 5 hours expiration
      );

      return token;
    } catch (error) {
      throw Error(`Error generating token: ${error.message}`);
    }
  }
}

export default new AuthUtility();
