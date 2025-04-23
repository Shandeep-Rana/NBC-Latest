const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "specialized_category";

class SpecializedCategoryServices {

    async addSpecializedCategoryAsync(data) {
        try {

            console.log(data)

            // Check if the category exists in the database
            const existingCategory = await knex('specialized_category')
                .where({
                    category: data,
                    isDeleted: false
                })
                .first();

            if (existingCategory) {
                return {
                    message: "Category already exists",
                    statusCode: 400, // Set an appropriate status code
                    success: false,
                    data: null
                };
            }

            // Insert the new category if it doesn't exist
            const newCategory = {
                category: data,
                isDeleted: false,
                addedOn: knex.fn.now()
            };

            const [id] = await knex('specialized_category').insert(newCategory);

            return {
                message: "Category added successfully",
                statusCode: 201,
                success: true,
                data: id
            };
        } catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getCategoryByNameAsync(category) {
        try {

            const specializedCategory = await knex('specialized_category')
                .select('id', 'category')
                .where('isDeleted', false)
                .andWhere('category', category)
                .first();

            if (specializedCategory) {
                return {
                    message: "Category fetched successfully",
                    statusCode: 200,
                    success: true,
                    data: specializedCategory
                };
            }

            throw new Error("Category not found");
        } catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getAllCategoriesAsync() {
        try {
            // Fetch all non-deleted categories, ordered by category name (ascending)
            const categories = await knex('specialized_category')
                .select('id as categoryId', 'category as categoryName')
                .where('isDeleted', false)
                .orderBy('category', 'asc');

            // Return success response with the list of categories
            return {
                message: "Categories fetched successfully",
                statusCode: 200,
                success: true,
                data: categories
            };
        } catch (error) {
            // Return error response if something goes wrong
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }
}

module.exports = new SpecializedCategoryServices();