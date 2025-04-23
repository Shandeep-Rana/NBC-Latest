const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "interests";

class InterestsServices {

    async addInterestAsync(interest) {
        try {
            const newInterest = {
                interest: interest,
            };
            const [interest_id] = await knex(tableName).insert(newInterest);

            return {
                message: "Added Successfully",
                statusCode: 201,
                success: true,
                data: interest_id
            };
        }
        catch (error) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getInterestByNameAsync(interestName) {
        try {
            // Make sure interestName is defined and valid
            if (!interestName) {
                throw new Error("Interest name is required");
            }

            const data = await knex(tableName)
                .select('interest_id', 'interest')
                .where('is_deleted', false)
                .andWhere('interest', interestName)
                .first();

            if (!data) {
                throw new Error("Interest not found");
            }

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: data
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


    async getAllInterestsAsync() {
        try {
            const interests = await knex(tableName).select('interest_id as interestId', 'interest').where('is_deleted', false);
            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: interests
            };
        }
        catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            }
        }
    }
}

module.exports = new InterestsServices();