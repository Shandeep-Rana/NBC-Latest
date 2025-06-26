const galleryServices = require("../services/galleryServices");
const commFunctions = require("../utils/common");

const galleryController = {

  createImage: async (req, res) => {
    try {
      const image = req.file ? req.file.filename : null;
      const { name, userId } = req.body;
      const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
      if (!image || !name) {
        return res.status(400).json({ error: "Mandatory fields are empty" });
      }

      const result = await galleryServices.addImageAsync({ name, image, userId: decryptedUserId });

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

  getPaginatedImages: async (req, res) => {
    try {
      const { page, pageSize, search, userId } = req.query;
      const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
      const result = await galleryServices.getPaginatedImagesAsync({ page, pageSize, search, userId: decryptedUserId });

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

  //delete Image
  deleteImageById: async (req, res) => {
    try {
      const ImageId = req.params.id.split(",");
      const parsedImageIds = ImageId.map((id) => parseInt(id, 10));
      const ecryptedUserId = req.headers["user-id"];
      const userId = ecryptedUserId ? commFunctions.decrypt(ecryptedUserId) : null;
      const result = await galleryServices.deleteImagesAsync(parsedImageIds, userId);

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

  //approveImage 
  approveImage: async (req, res) => {
    try {
      const { imageId, userId } = req.body;
      const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
      const result = await galleryServices.approveImagesAsync(imageId, decryptedUserId);
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

  disApproveImage: async (req, res) => {
    try {
      const { imageId, userId } = req.body;
      const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
      const result = await galleryServices.diApproveImagesAsync(imageId, decryptedUserId);
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

  getAllImages: async (req, res) => {
    try {
      const { category_id } = req.query;

      const result = await galleryServices.getAllImagesAsync(
        'uploaded_at', 
        'desc',            
        category_id || null 
      );

      res.status(result.statusCode).json(result);
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

module.exports = galleryController;
