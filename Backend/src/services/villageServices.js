const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "villages";

class VillageServices {

    async addVillageAsync(villName) {
        try {
            const newVill = {
                village_name: villName,
            };
            const [vill_id] = await knex(tableName).insert(newVill);

            return {
                message: "Village Added Successfully",
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

    async getVillageByNameAsync(villName) {
        try {
            const village = await knex(tableName).select('vill_id', 'village_name').where('is_deleted', false).andWhere('village_name', villName).first();
            if (village) {
                return {
                    message: "Fetched Successfully",
                    statusCode: 200,
                    success: true,
                    data: village
                };
            }
            throw new Error("Village not found");
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

    async getAllVillagesAsync() {
        try {
            const villages = await knex(tableName).select('vill_id as villageId', 'village_name as villageName').where('is_deleted', false) .orderBy('village_name', 'asc');;
            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: villages
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

module.exports = new VillageServices();