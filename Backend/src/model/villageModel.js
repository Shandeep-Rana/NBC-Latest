const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "village";

module.exports = {
  //adding new user
  addVillage: async (village) => {
    try {
        const [Id] = await knex(tableName).insert(village);
        return Id;
      } catch (error) {
        console.error("Error adding village:", error);
        throw error;
      }
    },

  // Get all users
  getAllVillage: async ({ searchTerm, sortBy, sortOrder, page, pageSize }) => {
    let query = knex(tableName).select(
     "Id",
     "villageName"
    )

    if (searchTerm) {
      query = query.where((builder) => {
        builder
          .where("villageName", "like", `%${searchTerm}%`)
      });
    }

    return {
      data: await query,
    };
  },

  // // Get user by ID
  // getUserById: async (userId) => {
  //   return knex(tableName).where("userId", userId).first();
  // },

  // // Update user by ID
  // updateUserById: async (userId, updatedUserData) => {
  //   return knex(tableName).where("userId", userId).update(updatedUserData);
  // },

  // // Delete user by ID
  // deleteUserById: async (userId) => {
  //   return knex(tableName).where("userId", userId).del();
  // },

  // Get user by email
  getVillageByName: async (villageName) => {
    return knex
      .select('villageName')
      .from('village')
      .where('village.villageName', villageName)
      .first();
  },
};
