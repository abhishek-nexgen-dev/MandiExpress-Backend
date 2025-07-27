import ProductModel from "./Product.model.mjs";

class ProductUtils {

  static async findProductById(productId) {
    try {
      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new Error("Product not found.");
      }
      return product;
    } catch (error) {
      console.error("Error finding product by ID:", error.message);
      throw new Error("Invalid product ID.");
    }
  }

 
  static async findProductsByName(name) {
    try {
      const words = name.split(" ").map((word) => new RegExp(word, "i")); 
      const products = await ProductModel.find({
        title: { $all: words }, 
      });
      return products;
    } catch (error) {
      console.error("Error finding products by name:", error.message);
      throw new Error("Failed to find products by name.");
    }
  }


  static async fetchAllProducts(page = 1, limit = 10) {
    try {
    
      const skip = (page - 1) * limit;


      const products = await ProductModel.find({})
        .skip(skip)
        .limit(limit);

   
      const totalProducts = await ProductModel.countDocuments();

   
      const totalPages = Math.ceil(totalProducts / limit);

      return {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          limit,
        },
      };
    } catch (error) {
      console.error("Error fetching all products with pagination:", error.message);
      throw new Error("Failed to fetch products.");
    }
  }


  static async deleteProductById(productId) {
    try {
      const product = await ProductModel.findByIdAndDelete(productId);
      if (!product) {
        throw new Error("Product not found.");
      }
      return product;
    } catch (error) {
      console.error("Error deleting product by ID:", error.message);
      throw new Error("Failed to delete product.");
    }
  }


  static async updateProductById(productId, updateData) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        updateData,
        { new: true, runValidators: true } // Return the updated document and run validators
      );
      if (!updatedProduct) {
        throw new Error("Product not found.");
      }
      return updatedProduct;
    } catch (error) {
      console.error("Error updating product by ID:", error.message);
      throw new Error("Failed to update product.");
    }
  }
}

export default ProductUtils;