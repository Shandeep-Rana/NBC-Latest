const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "Comments";

module.exports = {
  //adding new Comment
  addComment: async (Comment) => {
    try {
      const [CommentId] = await knex(tableName).insert(Comment);
      return CommentId;
    } catch (error) {
      console.error("Error adding Comment:", error);
      throw error;
    }
  },

  // Get all Comment
  getAllComments: async ({
    searchTerm,
    sortBy,
    sortOrder,
    page,
    pageSize,
  }) => {
    let query = knex(tableName).select(
      "CommentId",
      "name",
      "email",
      "comment",
      "DatePosted",
      "DateDeleted",
    );

    // Searching
    if (searchTerm) {
      query = query.where((builder) => {
        builder
          .where("name", "like", `%${searchTerm}%`)
          .orWhere("email", "like", `%${searchTerm}%`)
          .orWhere("comment", "like", `%${searchTerm}%`)
      });
    }

      // Ordering by the difference between startDateTime and current date/time
    query = query.orderByRaw("ABS(DATEDIFF(DatePosted, NOW()))");

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

  // Get Comment by ID
  getCommentByBlogId: async (BlogId) => {
    return knex(tableName).where("BlogId", BlogId);
  },
  // Get Comment by ID
  getCommentByCommentId: async (CommentId) => {
    return knex(tableName).where("CommentId", CommentId);
  },

  // Update Comment by ID
  updateCommentById: async (CommentId, updatedCommentData) => {
    return knex(tableName).where("CommentId", CommentId).update(updatedCommentData);
  },

  // Delete Comment by ID
  deleteCommentById: async (CommentId) => {
    return knex(tableName).where("CommentId", CommentId).del();
  },

};
