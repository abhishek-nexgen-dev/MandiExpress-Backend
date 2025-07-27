import { file } from 'zod';
import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import AuthUtils from '../Auth/Auth.utils.mjs';
import CategogyService from '../Category/Categogy.service.mjs';
import CategoryConstant from '../Category/Category.constant.mjs';
import CategoryUtils from '../Category/Category.utils.mjs';
import ProductService from '../Product/Product.service.mjs';

class Supplier_Controller {
  async createCategory(req = Request, res = Response) {
    try {
      let { name, description } = req.body;

      const token =
        req.cookies?.token || req.headers?.authorization?.split(' ')[1];
      if (!token) {
        throw new Error('Authentication token is required');
      }

      const decoded = await AuthUtils.DecodeToken(String(token).trim());

      let isAlreadyExists = await CategoryUtils.FindCategoryByName(name);

      if (isAlreadyExists) {
        throw Error(CategoryConstant.CATEGORY_ALL_READY_EXISTS);
      }

      const { filename } = req.file || {};

      let data = {
        name,
        description,
        createdBy: decoded.userId,
        image: filename,
      };

      let Created_Category = await CategogyService.createCategory({ ...data });
      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        CategoryConstant.CATEGORY_CREATED,
        Created_Category
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Error validating login OTP'
      );
    }
  }


  async createProduct(req = Request, res = Response) {
    try {

      const token =
      req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Authentication token is required');
    }

       const decoded = await AuthUtils.DecodeToken(String(token).trim());
       console.log("Decoded User:", decoded);

       let data = { ...req.body, createdBy: decoded.userId , files: req.files.map(file => file.filename) };
      
      const product = await ProductService.createProduct(data);

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        'Product created successfully',
        product
      );
    } catch (error) {
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Error creating product'
      );
    }
  }

}

export default new Supplier_Controller();
