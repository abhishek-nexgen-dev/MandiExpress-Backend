import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import userConstant from './user.constant.mjs';
import userService from './user.service.mjs';
import { createUserValidator } from './user.validator.mjs';

class User_Controller {
  async createUser(req, res) {
    try {
      const { filename } = req.file;

      await createUserValidator.safeParseAsync(req.body);

      const upload = await uploadOnCloudinary(filename);

      const userData = { ...req.body, profileImage: upload.url };

      const createdUser = await userService.createUser(userData);

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        userConstant.USER_CREATED,
        createdUser
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  }
}

export default new User_Controller();
