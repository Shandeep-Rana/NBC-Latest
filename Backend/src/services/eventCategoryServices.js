const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "event_category";

class EventCategoryServices {

    async addEventCategoryAsync(data) {
        try {
            const existingEventCategory = await knex(tableName)
                .where({
                    category: data
                })
                .first();

            if (existingEventCategory) {
                return {
                    message: " event Category already exists",
                    statusCode: 400, // Set an appropriate status code
                    success: false,
                    data: null
                };
            }

            // Insert the new category if it doesn't exist
            const newEventCategory = {
                category: data,
                description: data,
                addedOn: knex.fn.now()
            };

            const [id] = await knex(tableName).insert(newEventCategory);

            return {
                message: "Event Category added successfully",
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

    async getEventCategoryByNameAsync(category) {
        try {

            const specializedCategory = await knex(tableName)
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

    async getAllEventCategoriesAsync() {

        try {

            const EventCategories = await knex(tableName)
                .select('category_id as categoryId', 'category_name as categoryName')
                .orderBy('category_name', 'asc');

            // Return success response with the list of categories
            return {
                message: "Event Categories fetched successfully",
                statusCode: 200,
                success: true,
                data: EventCategories
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
}

module.exports = new EventCategoryServices();