const bloodRequirementServices = require('../services/bloodRequirementServices');
const commFunctions = require('../utils/common');
const mailServices = require("../services/mailServices");

const BloodRequirementController = {
  createRequest: async (req, res) => {
    try {
      const { fullName, email, contact, requireDate, bloodType, description, location, user } = req.body;
      const descryptedUserId = user ? commFunctions.decrypt(user) : null;

      const addRequirementResult = await bloodRequirementServices.addBloodRequirementAsync({
        fullName,
        email,
        contact,
        requireDate,
        bloodType,
        description,
        location,
        userId: descryptedUserId,
      });
      if (!addRequirementResult.success) {
        throw new Error(addRequirementResult.message);
      }

      res.status(200).json(addRequirementResult);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  getAllBloodRequirementRequests: async (req, res) => {
    try {
      const { page, pageSize, search, selectedBloodGroup } = req.query;
      const allRequestsResult = await bloodRequirementServices.getPaginatedBloodRequirementsAsync({ page, pageSize, search, selectedBloodGroup });
      res.status(200).json(allRequestsResult);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  getBloodRequirement: async (req, res) => {
    try {
      const id = req.params.id;
      const bloodRequirementResult = await bloodRequirementServices.getBloodRequirementByIdAsync(id);

      res.status(200).json(bloodRequirementResult);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  updateBloodRequirement: async (req, res) => {
    try {
      const id = req.params.id;
      const {
        fullName, email, contact, requireDate, bloodType, description, location, requireStatus
      } = req.body;

      const updateResult = await bloodRequirementServices.updateBloodRequirementAsync({
        req_id: id,
        fullName,
        email,
        contact,
        requireDate,
        bloodType,
        description,
        location,
        requireStatus,
      });

      if (!updateResult.success)
        throw new Error(updateResult.message);

      res.status(200).json(updateResult);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  deleteBloodRequirementRequestById: async (req, res) => {
    try {
      const id = req.params.id;

      const result = await bloodRequirementServices.deleteBloodRequirementAsync(id);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  approveBloodRequirementRequest: async (req, res) => {
    try {
      const { reqId, userId } = req.body;
      const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;

      const result = await bloodRequirementServices.approveBloodRequirementAsync(reqId, decryptedUserId);

      if (result.success) {
        const bloodRequirement = await bloodRequirementServices.getBloodRequirementByIdAsync(reqId);
        
        const bloodType = bloodRequirement.data.blood_type;

        const mailResult = await mailServices.sendBloodRequirementMail(bloodType);

        res.status(200).json({
          ...result,
          mailMessage: mailResult.message,
        });
      } else {
        res.status(400).json(result);
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

  disApproveBloodRequirementRequest: async (req, res) => {
    try {
      const { reqId, userId } = req.body;
      const decryptedUserId = userId ? commFunctions.decrypt(userId) : null;
      const result = await bloodRequirementServices.disApproveBloodRequirementAsync(reqId, decryptedUserId);
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

module.exports = BloodRequirementController;