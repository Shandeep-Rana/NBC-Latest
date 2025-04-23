const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "professions";

class ProfessionServices {

    async addProfessionAsync(proffessionName) {
        try {
            const newProfession = {
                profession_name: proffessionName,
            };
            const [profession_id] = await knex(tableName).insert(newProfession);

            return {
                message: "Profession Added Successfully",
                statusCode: 201,
                success: true,
                data: profession_id
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

    async getProfessionByNameAsync(proffessionName) {
        try {
            const proffession = await knex(tableName).select('profession_id', 'profession_name').where('is_deleted', false).andWhere('profession_name', proffessionName).first();

            if (proffession) {
                return {
                    message: "Fetched Successfully",
                    statusCode: 200,
                    success: true,
                    data: proffession
                };
            }
            throw new Error("Profession not found");
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

    async getAllProfessionsAsync() {
        try {
            const professions = await knex(tableName).select('profession_id as professionId', 'profession_name as professionName').where('is_deleted', false);
            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: professions
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

module.exports = new ProfessionServices();