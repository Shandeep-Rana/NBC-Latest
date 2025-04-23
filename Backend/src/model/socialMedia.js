const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "socialMedia";

module.exports = {
  //adding new user
  addLink: async (url) => {
    try {
      const [Id] = await knex(tableName).insert(url);
      return Id;
    } catch (error) {
      console.error("Error adding url:", error);
      throw error;
    }
  },

  // Get all users
  getAllLinks: async () => {
    let query = knex(tableName).select(
      // "google",
      "instagram",
      "youtube",
      "linkedin",
      "twitter",
      "facebook",
      "userId",
    );

    return {
      data: await query,
    };
  },

  //get link by user id
  getLinksByUserId: async (userId) => {
    try {
      const links = await knex(tableName)
        .select(
          "instagram",
          "youtube",
          "linkedin",
          "twitter",
          "facebook",
          "userId"
        )
        .where("userId", userId);
       // Create a single object with all links
       const linksObject = {};
       links.forEach(link => {
           Object.entries(link).forEach(([key, value]) => {
               // Exclude userId field
               if (key !== 'userId') {
                   linksObject[key] = value;
               }
           });
       });

       return linksObject;
   } catch (error) {
       console.error("Error getting links by userId:", error);
       throw error;
   }
},

  updateLinksByUserId: async (userId, updatedLinks) => {
    try {
      await knex(tableName)
        .where("userId", userId)
        .update(updatedLinks);
    } catch (error) {
      console.error("Error updating links by userId:", error);
      throw error;
    }
  },

  getUserByUserId: async (userId) => {
    return knex(tableName).where("userId", userId).first();
  },

};
