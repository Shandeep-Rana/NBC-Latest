const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "faq";

module.exports = {
  //adding new faq
  addFaq: async (faq) => {
    try {
      const [faqId] = await knex(tableName).insert(faq);
      const insertedFaq = await knex(tableName).where({ faqId: faqId }).first();
      const resultObj = {
        message: "Faq Added Successfully",
        data: insertedFaq,
        success: true
      }
      return resultObj;
    } catch (error) {
      const resultObj = {
        message: error.message,
        data: null,
        success: false
      }
      return resultObj;
    }
  },

  // Get all donor
  getAllFaqRequest: async ({
    searchTerm,
    sortBy,
    sortOrder,
    page,
    pageSize,
  }) => {
    let query = knex(tableName).select(
      "faqId",
      "question",
      "answer",
    ).where("isdeleted", false);

    // Searching
    if (searchTerm) {
      query = query.where((builder) => {
        builder
          .where("question", "like", `%${searchTerm}%`)
          .orWhere("answer", "like", `%${searchTerm}%`)
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
  getFaqById: async (faqId) => {
    return knex(tableName).where("faqId", faqId).first();
  },

  // Update donor by ID
  updateFaqById: async (faqId, updatedfaqData) => {
    try {
      await knex(tableName)
        .where("faqId", faqId)
        .update(updatedfaqData);

      const updatedFaq = await knex(tableName)
        .where("faqId", faqId)
        .first();

      const resultObj = {
        message: "Faq Updated Successfully",
        data: updatedFaq,
        success: true
      }
      return resultObj;
    }
    catch (error) {
      const resultObj = {
        message: error.message,
        data: null,
        success: false
      }
      return resultObj;
    }
  },

  // Delete faq by ID
  deleteFaqById: async (faqId) => {
    return knex(tableName).where("faqId", faqId).del();
  },

  // Get donor by email
  getFaqByEmail: async (email) => {
    return knex(tableName).where("email", email).first();
  },

  getAllApprovedFaqs: async () => {
    try {
      let query = knex(tableName).select(
        "faqId",
        "question",
        "answer",
      ).where("isdeleted", false).and("isApproved", true);

      query = query.orderBy("faqId", "desc");

      var data = await query;
      const resultObj = {
        message: "Fetched Successfully",
        data: data,
        success: true
      }
      return resultObj;
    }
    catch (error) {
      const resultObj = {
        message: error.message,
        data: null,
        success: false
      }
      return resultObj;
    }
  },
};
