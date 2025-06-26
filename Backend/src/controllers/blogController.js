const blogServices = require("../services/blogServices");
const mailServices = require("../services/mailServices");
const rolesServices = require("../services/rolesServices");
const skilledPersonServices = require("../services/skilledPersonServices");
const volunteerServices = require("../services/volunteerServices");
const commFunctions = require('../utils/common');

const BlogController = {

  addBlog: async (req, res) => {
    try {
      const thumbnail_url = req.files["thumbnail"]
        ? req.files["thumbnail"][0].filename
        : null;

      const { title, content, author, publish_date } = req.body;

      const existingBlogResult = await blogServices.getBlogByTitleAsync(title);

      if (existingBlogResult.success) {
        throw new Error("Blog already exist with this title");
      }

      const descryptedUserId = author ? commFunctions.decrypt(author) : null;
      var blogResult = await blogServices.addBlogAsync({
        title,
        content,
        author: descryptedUserId,
        thumbnail_url,
        publish_date,
      });
      res.status(200).json(blogResult);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getPaginatedBlogs: async (req, res) => {
    try {
      const { page, pageSize, search, userId, isPublished, isApproved } = req.query;
      const descryptedUserId = userId ? commFunctions.decrypt(userId) : null;
      const result = await blogServices.getPaginatedBlogsAsync({
        page,
        pageSize,
        search,
        userId: descryptedUserId,
        isPublished,
        isApproved
      });
      res.status(200).json(result);
    } catch (error) {
      const resultObject = {
        message: error.message,
        statusCode: 400,
        success: false,
        data: null,
      };
      res.status(500).json(resultObject);
    }
  },

  getBlogById: async (req, res) => {
    try {
      const id = req.params.id;
      const blogResult = await blogServices.getBlogByIdAsync(id);

      const authorId = blogResult.data.author;

      const userRolesRes = await rolesServices.getUserRolesByIdAsync(authorId);
      if (!userRolesRes.success)
        throw new Error(userRolesRes.message);

      let profession = null;

      if (userRolesRes.data.includes("volunteer")) {
        const volunteer = await volunteerServices.getVolunteerByUserIdAsync(authorId);
        if (volunteer.success) {
          profession = volunteer.data.profession;
        }
      } else if (userRolesRes.data.includes("skilled person")) {
        const person = await skilledPersonServices.getSkilledPersonByUserIdAsync(authorId);
        if (person.success) {
          profession = person.data.profession;
        }
      }

      // Only add profession to the response if it's available
      if (profession !== null) {
        blogResult.data.profession = profession;
      }

      res.status(200).json(blogResult);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBlogByTitle: async (req, res) => {
    try {
      const title = req.params.title;
      const blogResult = await blogServices.getBlogByTitleAsync(title);

      const authorId = blogResult.data.author;

      const userRolesRes = await rolesServices.getUserRolesByIdAsync(authorId);
      if (!userRolesRes.success)
        throw new Error(userRolesRes.message);

      let profession = null;

      if (userRolesRes.data.includes("volunteer")) {
        const volunteer = await volunteerServices.getVolunteerByUserIdAsync(authorId);
        if (volunteer.success) {
          profession = volunteer.data.profession;
        }
      } else if (userRolesRes.data.includes("skilled person")) {
        const person = await skilledPersonServices.getSkilledPersonByUserIdAsync(authorId);
        if (person.success) {
          profession = person.data.profession;
        }
      }

      // Only add profession to the response if it's available
      if (profession !== null) {
        blogResult.data.profession = profession;
      }

      res.status(200).json(blogResult);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateBlog: async (req, res) => {
    try {
      const blogId = req.params.id;
      const ecryptedUserId = req.headers["user-id"];
      const userId = ecryptedUserId ? commFunctions.decrypt(ecryptedUserId) : null;

      const thumbnail_url = req?.files["thumbnail"]
        ? req.files["thumbnail"][0].filename
        : null;

      const { title, content, publish_date } = req.body;
      const result = await blogServices.updateBlogAsync({ title, blog_id: blogId, content, thumbnail_url, publish_date }, userId);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const blogId = req.params.id;
      const ecryptedUserId = req.headers["user-id"];
      const userId = ecryptedUserId ? commFunctions.decrypt(ecryptedUserId) : null;

      const result = await blogServices.deleteBlogAsync(blogId, userId);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  approveBlog: async (req, res) => {
    try {
      const { blogId, userId } = req.body;
      const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
      const result = await blogServices.approveBlogAsync(blogId, decryptedUserId);
      res.status(200).json(result);

      const blog = await blogServices.getBlogByIdAsync(blogId);

      if (blog.success) {
        const currentDate = new Date();
        const publishDate = new Date(blog?.data?.publish_date);

        if (publishDate <= currentDate) {
          await mailServices.sendBlogCreatedMail(blog?.data);
        }
      }

    } catch (error) {
      const resultObject = {
        message: error.message,
        statusCode: 400,
        success: false,
        data: null
      };
      res.status(500).json(resultObject);
    }
  },

  disApproveBlog: async (req, res) => {
    try {
      const { blogId, userId } = req.body;
      const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
      const result = await blogServices.disApproveBlogAsync(blogId, decryptedUserId);
      res.status(200).json(result);

    } catch (error) {
      const resultObject = {
        message: error.message,
        statusCode: 400,
        success: false,
        data: null
      };
      res.status(500).json(resultObject);
    }
  },

  publishBlog: async (req, res) => {
    try {
      const { blogId, userId } = req.body;
      const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
      const result = await blogServices.publishBlogAsync(blogId, decryptedUserId);

      const blog = await blogServices.getBlogByIdAsync(blogId);

      if (blog) {
        await mailServices.sendBlogCreatedMail(blog?.data)
      }

      res.status(200).json(result);

    } catch (error) {
      const resultObject = {
        message: error.message,
        statusCode: 400,
        success: false,
        data: null
      };
      res.status(500).json(resultObject);
    }
  },

  UnpublishBlog: async (req, res) => {
    try {
      const { blogId, userId } = req.body;
      const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
      const result = await blogServices.UnpublishBlogAsync(blogId, decryptedUserId);
      res.status(200).json(result);

    } catch (error) {
      const resultObject = {
        message: error.message,
        statusCode: 400,
        success: false,
        data: null
      };
      res.status(500).json(resultObject);
    }
  },

  addBlogComment: async (req, res) => {
    try {
      const { content, blogId, parentId, authorName, authorEmail } = req.body;

      var blogResult = await blogServices.addBlogCommentAsync({
        content,
        blogId,
        parentId,
        authorName,
        authorEmail,
      });
      res.status(200).json(blogResult);

    } catch (error) {
      const resultObject = {
        message: error.message,
        statusCode: 400,
        success: false,
        data: null
      };
      res.status(500).json(resultObject);
    }
  },

  getAllBlogComments: async (req, res) => {
    try {
      const { blogId } = req.query;
      const result = await blogServices.getAllBlogCommentsAsync(blogId);

      res.status(200).json(result);

    } catch (error) {
      const resultObject = {
        message: error.message,
        statusCode: 400,
        success: false,
        data: null
      };
      res.status(500).json(resultObject);
    }
  },
};

module.exports = BlogController;
