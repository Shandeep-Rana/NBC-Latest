const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "contact";

module.exports = {
  //adding new contact
  addContact: async (contact) => {
    try {
      const [contactId] = await knex(tableName).insert(contact);
      return contactId;
    } catch (error) {
      console.error("Error in contacting :", error);
      throw error;
    }
  },

  // Get all donor
  getAllContactRequest: async ({
    searchTerm,
    sortBy,
    sortOrder,
    page,
    pageSize,
  }) => {
    let query = knex(tableName).select(
      "contactId",
      "name",
      "email",
      "phone",
      "subject",
      "description"
    );

    // Searching
    if (searchTerm) {
      query = query.where((builder) => {
        builder
          .where("name", "like", `%${searchTerm}%`)
          .orWhere("email", "like", `%${searchTerm}%`)
          .orWhere("phone", "like", `%${searchTerm}%`)
          .orWhere("subject", "like", `%${searchTerm}%`)
          .orWhere("description", "like", `%${searchTerm}%`);
      });
    }

    // Sorting
    if (sortBy && sortOrder) {
      query = query.orderBy(sortBy, sortOrder);
    }

    // Pagination
    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query = query.offset(offset).limit(pageSize);
    }

    const totalCountQuery = knex(tableName).count("* as total");
    const totalCountResult = await totalCountQuery.first();

    return {
      data: await query,
      totalCount: totalCountResult.total,
    };
  },

  // Get donor by ID
  getContactById: async (contactId) => {
    return knex(tableName).where("contactId", contactId).first();
  },

  // Update donor by ID
  updateContactById: async (contactId, updatedContactData) => {
    return knex(tableName)
      .where("contactId", contactId)
      .update(updatedContactData);
  },

  // Delete donor by ID
  deleteContactById: async (contactId) => {
    return knex(tableName).where("contactId", contactId).del();
  },

  // Get donor by email
  getContactByEmail: async (email) => {
    return knex(tableName).where("email", email).first();
  },
};
