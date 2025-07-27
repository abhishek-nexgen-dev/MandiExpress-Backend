import ProductModel from "./Product.model.mjs";
import ProductUtils from "./Product.utils.mjs";
import { createProductValidator, updateProductValidator } from "./Product.validator.mjs";
import { uploadOnCloudinary } from "../../../utils/Cloudinary.mjs";
import AuthUtils from "../Auth/Auth.utils.mjs";
import OtpSchema from "../Otp/Otp.Schema.mjs";
import OtpService from "../Otp/Otp.service.mjs";

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
        throw new Error("Product creation failed.");
      }

      return product;
    } catch (error) {
      console.error("Error creating product:", error.message);
      throw new Error(error.message || "Product creation failed.");
    }
  }


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

  // 'supplier', 'vendor'
  async Live_auction({
    SupplierId,
    ProductId,
    VendorId,
    Bid_Amount,
    Email,
    Name
  }) {
    try {

     let product = await ProductUtils.findProductById(ProductId);

      if (!product) {
        throw new Error("Product not found.");
      }

      let FInd_User = await AuthUtils.FindByEmail(Email);

      if (!FInd_User) {
        throw new Error("Please Enter Correct Email Id to Place Bid.");
      }

     
//  {
//         bidderId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'User', // Reference to the bidder
//           required: true,
//         },
//         amount: {
//           type: Number,
//           required: true,
//           min: 0,
//         },
//         bidTime: {
//           type: Date,
//           default: Date.now,
//         },
//       },
      

      const updatedProduct = await ProductModel.findById(ProductId)

      updatedProduct.push({
        name: FInd_User.name,
        email: FInd_User.email,
        bidderId: VendorId,
        amount: Bid_Amount,
        bidTime: new Date().toTimeString(),
      })

      updatedProduct.save();

      return {
        message: "Live auction started successfully.",
        product: updatedProduct,
      };
    } catch (error) {
      console.error("Error starting live auction:", error.message);
      throw new Error(error.message || "Live auction failed.");
    }
  }

  async genOtpToPlaceBid({ email }) {
    try {
    
      let findUserByEmail = await AuthUtils.FindByEmail(email);
      if (!findUserByEmail) {
        throw new Error("Please Enter Correct Id to Place Bid.");
      }

      let GenOtp = OtpService.generateOtp(email);
      if (!GenOtp) {
        throw new Error("Failed to generate OTP.");
      }

      const SendOtp = await OtpService.sendOtp(email, GenOtp);

      return {
        name: findUserByEmail.name,
        email: findUserByEmail.email,
        
      };
    } catch (error) {
      console.error("Error generating OTP:", error.message);
      throw new Error(error.message || "Failed to generate OTP.");
    }
  }
}

export default new Product_Service();
