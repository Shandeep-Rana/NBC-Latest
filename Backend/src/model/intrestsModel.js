const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "intrests";

module.exports = {
  //adding new user
  addIntrest: async (intrests) => {
    try {
      const [Id] = await knex(tableName).insert(intrests);
      return Id;
    } catch (error) {
      console.error("Error adding intrest:", error);
      throw error;
    }
  },

  // Get all users
  getAllIntrests: async ({ searchTerm }) => {
    let query = knex(tableName).select("id", "name");

    if (searchTerm) {
      query = query.where((builder) => {
        builder.where("name", "like", `%${searchTerm}%`);
      });
    }

    return {
      data: await query,
    };
  },

  getIntrestByName: async (name) => {
    return knex
      .select('name')
      .from('intrests')
      .where('intrests.name', name)
      .first();
  },
};
