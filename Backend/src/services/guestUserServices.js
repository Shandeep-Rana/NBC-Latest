const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "guestuser";
const auditServices = require('../services/auditServices');
const constants = require("../constants/index");
const URL = constants.IMAGE_URL;

class GuestUserServices {
    async addGuestUserAsync( data) {
        try {
            const newGuestUser = {
                name: data.name,
                email: data.email,
                contact: data.contact,
                // upload: data.upload
            }

            const [id] = await knex(tableName).insert(newGuestUser);

            return {
                message: "Guest user Added Successfully",
                statusCode: 201,
                success: true,
                data: id
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

    async getGuestUserByEmailAsync(email) {
        try {
            let user = await knex(tableName).select('id').where('email', email).andWhere('isDeleted', false).first();
            if (user) {
                return {
                    message: "Fetched Successfully",
                    statusCode: 200,
                    success: true,
                    data: user
                };
            }
            throw new Error("Guest User not found");
        }
        catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            }
        }
    }

    async deleteGuestUserAsync(id) {
        try {
            await knex(tableName)
                .where('id', id)
                .update({
                    isDeleted: true,
                    deletedOn: new Date(),
                });

            return {
                message: "Deleted Successfully",
                statusCode: 200,
                success: true,
            };

        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false
            };
        }
    }
}

module.exports = new GuestUserServices();