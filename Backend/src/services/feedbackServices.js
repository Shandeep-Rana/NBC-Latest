const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "feedback";

class FeedbackServices {

    async addFeedbackAsync(data) {
        try {
            const newFeedback = {
                name: data.name,
                contact: data.contact,
                email: data.email,
                description: data.description,
                addedOn: data.addedOn,
                stars: data.stars,
            }
            const [id] = await knex(tableName).insert(newFeedback);

            return {
                message: "Feedback Added Successfully",
                statusCode: 201,
                success: true,
                data: vill_id
            };
        }
        catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }  

    async getAllFeedbacksPaginatedAsync({ page = 1, pageSize = 10, search }) {
        try {
            const offset = (page - 1) * pageSize;
    
            let query = knex('feedback')
                .select(
                    'id',
                    'name',
                    'email',
                    'contact',
                    'description',
                    'stars',
                    'addedOn'
                )
                .where('isDeleted', false)
                .orderBy('addedOn', 'desc');
    
            let countQuery = knex('feedback')
                .count('id as count')
                .where('isDeleted', false);
    
            if (search) {
                query = query.andWhere(builder => {
                    builder.where('name', 'like', `%${search}%`)
                        .orWhere('email', 'like', `%${search}%`)
                        .orWhere('contact', 'like', `%${search}%`)
                        .orWhere('description', 'like', `%${search}%`);
                });
    
                countQuery = countQuery.andWhere(builder => {
                    builder.where('name', 'like', `%${search}%`)
                        .orWhere('email', 'like', `%${search}%`)
                        .orWhere('contact', 'like', `%${search}%`)
                        .orWhere('description', 'like', `%${search}%`);
                });
            }
    
            query = query.limit(pageSize).offset(offset);
    
            let feedbacks = await query;
            const [{ count }] = await countQuery;
    
            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: {
                    feedbacks,
                    pagination: {
                        total: parseInt(count, 10),
                        currentPage: page,
                        totalPages: Math.ceil(count / pageSize)
                    }
                }
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

module.exports = new FeedbackServices();