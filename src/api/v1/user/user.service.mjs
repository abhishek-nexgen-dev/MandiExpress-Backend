import userConstant from "./user.constant.mjs";
import userSchema from "./user.schema.mjs";
import { createUserValidator } from "./user.validator.mjs";

class User_Service {
  async createUser(userData) {
    try {

      const user = await userSchema.create(userData);
      if (!user) {
        throw new Error(userConstant.USER_CREATION_FAILED);
      }
      return user;
    } catch (error) {

      throw new Error(error.message || userConstant.USER_CREATION_FAILED);
    }
  }
}

export default new User_Service();