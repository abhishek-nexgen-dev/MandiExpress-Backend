import fs from 'fs';
import path from 'path';
import AuthConstant from './Auth.constant.mjs';
import { Gmail } from '../../../utils/SendMail.mjs';
import { console } from 'inspector';
import AuthUtils from './Auth.utils.mjs';

class AuthService {
  UpdateUserToken = async (email, token) => {
    try {
      console.log('Updating user token for userId:', email);
      console.log('New token:', token);
      const user = await AuthUtils.FindByEmail(email);
      if (!user) {
        throw new Error(AuthConstant.USER_NOT_FOUND);
      }

      user.token = token;
      await user.save();
      return user.token;
    } catch (error) {
      console.error('Error updating user token:', error);
      throw Error(error.message || 'Error updating user token');
    }
  };
}

export default new AuthService();
