import ProductModel from "./Product.model.mjs";
import ProductUtils from "./Product.utils.mjs";
import { createProductValidator, updateProductValidator } from "./Product.validator.mjs";
import { uploadOnCloudinary } from "../../../utils/Cloudinary.mjs";

class Product_Service {

  async createProduct(data) {
    try {

      console.log("Creating product with data:", data);

      const validatedData = await createProductValidator.validateAsync(data, {
        abortEarly: false,
      });

      console.log("Validated Data:", validatedData);


      const imageUploadPromises = data.files.map(async (file) => {
        console.log("Uploading file:", file);
        const uploadResult = await uploadOnCloudinary(file);
        return uploadResult.url;
      });
      const UploadImageUrls = await Promise.all(imageUploadPromises);

    


      validatedData.images = UploadImageUrls;



      const product = await ProductModel.create(validatedData);

      if (!product) {
        throw new Error("Product creation failed.");
      }

      return product;
    } catch (error) {
      console.error("Error creating product:", error.message);
      throw new Error(error.message || "Product creation failed.");
    }
  }

  /**
   * Update an existing product
   * @param {String} productId - The ID of the product to update
   * @param {Object} data - The updated product data
   * @param {Array} files - Array of uploaded product image files
   * @returns {Object} - The updated product
   */
  async updateProduct({ productId, data, files }) {
    try {
      console.log("Updating product with ID:", productId);

      // Validate the input data
      const validatedData = await updateProductValidator.validateAsync(data, {
        abortEarly: false,
      });

      // If new images are provided, upload them to Cloudinary
      if (files && files.length > 0) {
        const imageUploadPromises = files.map(async (file) => {
          console.log("Uploading file:", file.path);
          const uploadResult = await uploadOnCloudinary(file.path);
          return uploadResult.url;
        });
        const imageUrls = await Promise.all(imageUploadPromises);

        console.log("Uploaded Image URLs:", imageUrls);

        // Add the new image URLs to the validated data
        validatedData.images = imageUrls;
      }

      // Update the product in the database
      const updatedProduct = await ProductUtils.updateProductById(
        productId,
        validatedData
      );

      if (!updatedProduct) {
        throw new Error("Product update failed.");
      }

      return {
        message: "Product updated successfully.",
        product: updatedProduct,
      };
    } catch (error) {
      console.error("Error updating product:", error.message);
      throw new Error(error.message || "Product update failed.");
    }
  }
}

export default new Product_Service();
