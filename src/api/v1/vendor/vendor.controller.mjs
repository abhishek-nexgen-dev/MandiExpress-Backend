import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import ProductUtils from '../Product/Product.utils.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';

class VendorController {
  /**
   * Find a product by its ID
   * @param req - Express request object
   * @param res - Express response object
   */
  async findProductById(req, res) {
    try {
      const { productId } = req.params; // Extract Product ID from request params
      console.log('Fetching product with ID:', productId);

      // Validate Product ID
      if (!productId) {
        throw new Error('Product ID is required.');
      }

      // Fetch product details using ProductUtils
      const product = await ProductUtils.findProductById(productId);
      console.log('Product details:', product);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        'Product created successfully',
        product
      );
    } catch (error) {
      console.error('Error fetching product by ID:', error.message);

      // Send error response
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || 'Error fetching product by ID'
      );
    }
  }
}

export default new VendorController();
