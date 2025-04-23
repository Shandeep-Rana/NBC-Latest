const specializedCategoryServices = require('../services/specializedCategoryServices');

const SpecializedCategoryController = {
    createCategory: async (req, res) => {
        try {
            const { category } = req.body;

            const existingCategoryResult = await specializedCategoryServices.getCategoryByNameAsync(category);

            if (existingCategoryResult.success) {
                return res.status(409).json({
                    message: "Category already exists",
                    success: false
                });
            }

            const newCategory = {
                category
            };

            const result = await specializedCategoryServices.addSpecializedCategoryAsync(newCategory);

            res.status(result.statusCode).json(result);

        } catch (error) {
            res.status(500).json({ message: error.message, success: false });
        }
    },

    getAllCategories: async (req, res) => {
        try {
            const allCategoriesResult = await specializedCategoryServices.getAllCategoriesAsync();

            res.status(200).json(allCategoriesResult);

        } catch (error) {
            res.status(500).json({ message: error.message, success: false });
        }
    },


};

module.exports = SpecializedCategoryController;