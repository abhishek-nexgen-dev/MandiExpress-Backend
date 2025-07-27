import ProductModel from './Product.model.mjs';
import ProductUtils from './Product.utils.mjs';
import {
  createProductValidator,
  updateProductValidator,
} from './Product.validator.mjs';
import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';
import AuthUtils from '../Auth/Auth.utils.mjs';
import OtpSchema from '../Otp/Otp.Schema.mjs';
import OtpService from '../Otp/Otp.service.mjs';

class Product_Service {
  async createProduct(data) {
    try {
      const validatedData = await createProductValidator.validateAsync(data, {
        abortEarly: false,
      });

      const imageUploadPromises = data.files.map(async (file) => {
        const uploadResult = await uploadOnCloudinary(file);
        return uploadResult.url;
      });
      const UploadImageUrls = await Promise.all(imageUploadPromises);
      validatedData.images = UploadImageUrls;
      const product = await ProductModel.create(validatedData);

      if (!product) {
        throw new Error('Product creation failed.');
      }

      return product;
    } catch (error) {
      console.error('Error creating product:', error.message);
      throw new Error(error.message || 'Product creation failed.');
    }
  }

  async updateProduct({ productId, data, files }) {
    try {
      console.log('Updating product with ID:', productId);

      // Validate the input data
      const validatedData = await updateProductValidator.validateAsync(data, {
        abortEarly: false,
      });

      // If new images are provided, upload them to Cloudinary
      if (files && files.length > 0) {
        const imageUploadPromises = files.map(async (file) => {
          console.log('Uploading file:', file.path);
          const uploadResult = await uploadOnCloudinary(file.path);
          return uploadResult.url;
        });
        const imageUrls = await Promise.all(imageUploadPromises);

        console.log('Uploaded Image URLs:', imageUrls);

        // Add the new image URLs to the validated data
        validatedData.images = imageUrls;
      }

      // Update the product in the database
      const updatedProduct = await ProductUtils.updateProductById(
        productId,
        validatedData
      );

      if (!updatedProduct) {
        throw new Error('Product update failed.');
      }

      return {
        message: 'Product updated successfully.',
        product: updatedProduct,
      };
    } catch (error) {
      console.error('Error updating product:', error.message);
      throw new Error(error.message || 'Product update failed.');
    }
  }

  async Live_auction(data) {
    try {
      console.log('Placing bid with data:', data);
      const product = await ProductUtils.findProductById(data.productId);
  
      if (!product) {
        throw new Error('Product not found.');
      }
  
      const newBid = {
        bidderId: data.vendorId,
        amount: data.bidAmount,
        bidTime: new Date(),
        name: data.name,
        email: data.email,
      };
  
      product.bids.push(newBid);
      await product.save();
  
      // ✅ Return only the new bid, not the whole list
      return newBid;
  
    } catch (error) {
      console.error("Error placing bid:", error.message);
      throw new Error(error.message || "Failed to place bid.");
    }
  }
}

export default new Product_Service();
