import {
  createCategoryValidator,
  updateCategoryValidator,
} from './Category.validator.mjs';
import CategoryModel from './Category.model.mjs';
import { uploadOnCloudinary } from '../../../utils/Cloudinary.mjs';

class Category_Service {
  async createCategory(data) {
    try {
      const validatedData = await createCategoryValidator.validateAsync(data, {
        abortEarly: false,
      });

      let imageUrl = null;
      const uploadResult = await uploadOnCloudinary(validatedData.image);
      if (!uploadResult?.url) {
        throw new Error('Image upload failed.');
      }

      const category = await CategoryModel.create({
        ...validatedData,
        image: uploadResult.url,
      });

      return category;
    } catch (error) {
      console.error('Error creating category:', error.message);
      throw new Error(error.message || 'Category creation failed.');
    }
  }

  async updateCategory(categoryId, data) {
    try {
      // Validate input using Joi
      const validatedData = await updateCategoryValidator.validateAsync(data, {
        abortEarly: false, // Collect all errors
      });

      // Handle image upload (if image exists)
      if (validatedData.image) {
        const uploadResult = await uploadOnCloudinary(validatedData.image);
        if (!uploadResult?.url) {
          throw new Error('Image upload failed.');
        }
        validatedData.image = uploadResult.url;
      }

      // Update the category in the database
      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        categoryId,
        validatedData,
        { new: true, runValidators: true } // Return the updated document and run validators
      );

      if (!updatedCategory) {
        throw new Error('Category not found.');
      }

      return {
        message: 'Category updated successfully.',
        category: updatedCategory,
      };
    } catch (error) {
      console.error('Error updating category:', error.message);
      throw new Error(error.message || 'Category update failed.');
    }
  }
}

export default new Category_Service();
