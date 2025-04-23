const commentModel = require("../model/commentModel");
const CommentModel = require("../model/commentModel");

const CommentController = {
  addComment: async (req, res) => {
    try {
      const {
       comment,
       name,
       email,
       blogId,
       parentId,
      } = req.body;

      if (
       !comment || !name || !email || !blogId
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const DatePosted = new Date();
      
      const newComment = {
        comment,
        name,
        email,
        blogId,
        parentId,
        DatePosted,
        DateDeleted: null,
      };

    await CommentModel.addComment(newComment);

      res.status(200).json({ message: "Comment added successfully" });
    } catch (error) {
      console.error("Error adding Comment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get all Comments
  getAllComments: async (req, res) => {
    try {
      const {
        searchTerm,
        sortBy,
        sortOrder,
        page,
        pageSize,
      } = req.query;

      const data = await commentModel.getAllComments({
        searchTerm,
        sortBy,
        sortOrder,
        page,
        pageSize,
      });

      res.status(200).json(data);
    } catch (error) {
      console.error("Error getting all Comments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get Comment by ID
  getCommentBlogById: async (req, res) => {
    try {
      const BlogId = req.params.id;
      const Comment = await CommentModel.getCommentByBlogId(BlogId);

      if (!Comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      res.status(200).json(Comment);
    } catch (error) {
      console.error("Error getting Comment by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get Comment by ID
  getCommentById: async (req, res) => {
    try {
      const CommentId = req.params.id;
      const Comment = await CommentModel.getCommentByCommentId(CommentId);

      if (!Comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      res.status(200).json(Comment);
    } catch (error) {
      console.error("Error getting Comment by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Update Comment by ID
  updateCommentById: async (req, res) => {
    try {
      const CommentId = req.params.id;
      const updatedCommentData = req.body;
      const updatedComment = await CommentModel.updateCommentById(
        CommentId,
        updatedCommentData
      );

     
      // Check if updatedCommentData is empty
      if (Object.keys(updatedCommentData).length === 0) {
        return res.status(400).json({ error: "No data provided for update" });
      }

      if (!updatedComment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      res.status(200).json({ message: "Comment updated successfully" });
    } catch (error) {
      console.error("Error updating Comment by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Delete Comment by ID
  deleteCommentById: async (req, res) => {
    try {
      const CommentId = req.params.id;
      const deletedComment = await CommentModel.deleteCommentById(CommentId);

      if (!deletedComment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting Comment by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = CommentController;
