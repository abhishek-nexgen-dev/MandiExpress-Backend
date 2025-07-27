import ProductModel from "./Product.model.mjs";
import ProductUtils from "./Product.utils.mjs";
import { createProductValidator, updateProductValidator } from "./Product.validator.mjs";
import { uploadOnCloudinary } from "../../../utils/Cloudinary.mjs";

class Product_Service {
 
  async createProduct({ data, files }) {
    try {
  
      const validatedData = await createProductValidator.validateAsync(data, {
        abortEarly: false,
      });

   

      let imageUrls = [];
      const imageUploadPromises = files.map(async (file) => {
        console.log("Uploading image:", file.path);
        // const uploadResult = await uploadOnCloudinary(file.path);
        // return uploadResult.url;
      });
      // const imageUrls = await Promise.all(imageUploadPromises);

   
     let productData = { ...validatedData, images: imageUrls };
     console.log("Product Data:", productData);


      // const product = await ProductModel.create(validatedData);

      // return product ;
    } catch (error) {
      console.error("Error creating product:", error.message);
      throw new Error(error.message || "Product creation failed.");
    }
  }


  async updateProduct({ productId, data, files }) {
    try {

      const validatedData = await updateProductValidator.validateAsync(data, {
        abortEarly: false,
      });


      if (files && files.length > 0) {
        const imageUploadPromises = files.map(async (file) => {
          const uploadResult = await uploadOnCloudinary(file.path);
          return uploadResult.url;
        });
        const imageUrls = await Promise.all(imageUploadPromises);
     
        validatedData.images = imageUrls;
      }


      const updatedProduct = await ProductUtils.updateProductById(
        productId,
        validatedData
      );

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
