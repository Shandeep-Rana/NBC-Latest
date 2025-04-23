const newsServices = require("../services/newsServices");
const rolesServices = require("../services/rolesServices");
const skilledPersonServices = require("../services/skilledPersonServices");
const volunteerServices = require("../services/volunteerServices");
const commFunctions = require('../utils/common');

const NewsController = {

  addNews: async (req, res) => {
    try {
      const thumbnail_url = req.files["thumbnail"]
        ? req.files["thumbnail"][0].filename
        : null;

      const { title, content, author, publish_date } = req.body;

      const descryptedUserId = author ? commFunctions.decrypt(author) : null;
      var newsResult = await newsServices.addNewsAsync({
        title,
        content,
        author: descryptedUserId,
        thumbnail_url,
        publish_date,
      });
      res.status(200).json(newsResult);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getPaginatedNews: async (req, res) => {
    try {
      const { page, pageSize, search, userId, isPublished, isApproved } = req.query;
      const descryptedUserId = userId ? commFunctions.decrypt(userId) : null;
      const result = await newsServices.getPaginatedNewsAsync({
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

  getNewsById: async (req, res) => {
    try {
      const id = req.params.id;
      const newsResult = await newsServices.getNewsByIdAsync(id);
      const authorId = newsResult.data.author;

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
        newsResult.data.profession = profession;
      }

      res.status(200).json(newsResult);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getNewsByTitle: async (req, res) => {
    try {
      const title = req.params.title;
      const newsResult = await newsServices.getNewsByTitleAsync(title);

      const authorId = newsResult.data.author;

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
        newsResult.data.profession = profession;
      }

      res.status(200).json(newsResult);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateNews: async (req, res) => {
    try {
      const newsId = req.params.id;
      const ecryptedUserId = req.headers["user-id"];
      const userId = ecryptedUserId ? commFunctions.decrypt(ecryptedUserId) : null;

      const thumbnail_url = req?.files["thumbnail"]
        ? req.files["thumbnail"][0].filename
        : null;

      const { title, content, publish_date } = req.body;
      const result = await newsServices.updateNewsAsync({ title, news_id: newsId, content, thumbnail_url, publish_date }, userId);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteNews: async (req, res) => {
    try {
      const newsId = req.params.id;
      const ecryptedUserId = req.headers["user-id"];
      const userId = ecryptedUserId ? commFunctions.decrypt(ecryptedUserId) : null;

      const result = await newsServices.deleteNewsAsync(newsId, userId);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  approveNews: async (req, res) => {
    try {
      const { newsId, userId } = req.body;
      const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
      const result = await newsServices.approveNewsAsync(newsId, decryptedUserId);
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

  disapproveNews: async (req, res) => {
    try {
      const { newsId, userId } = req.body;
      const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
      const result = await newsServices.disapproveNewsAsync(newsId, decryptedUserId);
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

  publishNews: async (req, res) => {
    try {
      const { newsId, userId } = req.body;
      const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
      const result = await newsServices.publishNewsAsync(newsId, decryptedUserId);
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

  UnpublishNews: async (req, res) => {
    try {
      const { newsId, userId } = req.body;
      const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
      const result = await newsServices.UnpublishNewsAsync(newsId, decryptedUserId);
      console.log(req.body)
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

  addNewsComment: async (req, res) => {
    try {
      const { content, newsId, parentId, authorName, authorEmail } = req.body;

      var newsResult = await newsServices.addNewsCommentAsync({
        content,
        newsId,
        parentId,
        authorName,
        authorEmail,
      });
      res.status(200).json(newsResult);

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

  getAllNewsComments: async (req, res) => {
    try {
      const { newsId } = req.query;
      const result = await newsServices.getAllNewsCommentsAsync(newsId);

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

module.exports = NewsController;
