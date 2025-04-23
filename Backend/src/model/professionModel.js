const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "profession";

module.exports = {
  //adding new user
  addProfession: async (intrests) => {
    try {
        const [Id] = await knex(tableName).insert(intrests);
        return Id;
      } catch (error) {
        console.error("Error adding profession:", error);
        throw error;
      }
    },

  // Get all users
  getAllProfession: async ({ searchTerm }) => {
    let query = knex(tableName).select(
     "Id",
     "professionName"
    )

    if (searchTerm) {
      query = query.where((builder) => {
        builder
          .where("professionName", "like", `%${searchTerm}%`)
      });
    }

    return {
      data: await query,
    };
  },

  getProfessionByName: async (professionName) => {
    return knex
      .select('professionName')
      .from('profession')
      .where('profession.professionName', professionName)
      .first();
  },
};
