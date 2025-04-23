const EventCategoryServices = require('../services/eventCategoryServices');

const EventCategoryController = {
    createEventCategory: async (req, res) => {
        try {
            const { category } = req.body;

            const existingCategoryResult = await EventCategoryServices.getCategoryByNameAsync(category);

            if (existingCategoryResult.success) {
                return res.status(409).json({
                    message: "Category already exists",
                    success: false
                });
            }

            const newCategory = {
                category
            };

            const result = await EventCategoryServices.addSpecializedCategoryAsync(newCategory);

            res.status(result.statusCode).json(result);

        } catch (error) {
            res.status(500).json({ message: error.message, success: false });
        }
    },

    getAllEventCategories: async (req, res) => {
        try {
            const allEventCategoriesResult = await EventCategoryServices.getAllEventCategoriesAsync();

            res.status(200).json(allEventCategoriesResult);

        } catch (error) {
            res.status(500).json({ message: error.message, success: false });
        }
    },


};

module.exports = EventCategoryController;