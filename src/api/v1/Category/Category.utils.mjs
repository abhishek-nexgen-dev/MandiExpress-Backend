import CategoryModel from './Category.model.mjs';

class Category_Utils {
  FindCategoryById(categoryId) {
    if (!categoryId) {
      throw new Error('Category ID is required');
    }
    return CategoryModel.findById(categoryId);
  }

  async FindCategoryByName(name) {
    if (!name) {
      throw new Error('Category name is required');
    }
    return await CategoryModel.findOne({ name });
  }
}

export default new Category_Utils();
