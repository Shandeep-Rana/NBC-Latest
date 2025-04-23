const userServices = require('../services/userServices');
const eventParticipationServices = require("../services/eventParticipationServices");

const ParticipantController = {
  createParticipant: async (req, res) => {
    try {
      const upload = req.file ? req.file.filename : null;

      const { name, email, contact, event } = req.body;

      const existingUserResult = await userServices.getUserByEmailAsync(email);
      console.log(existingUserResult)

      if (!existingUserResult.success || !existingUserResult.data) {
        return res.status(400).json({
          message: 'You are not registered User',
          success: false,
          data: null
        });
      }

      const user = existingUserResult.data ? existingUserResult.data.id : null;

      const newEventParticipant = {
        name,
        email,
        contact,
        event,
        user_id: user,
        upload
      };

      const result = await eventParticipationServices.addParticipantAsync(newEventParticipant);

      res.status(200).json(result);

    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },


  getAllParticipants: async (req, res) => {
    try {
      const { page, pageSize, search, sortBy, sortOrder, selectedEvent } = req.query;

      const allParticipantsResult = await eventParticipationServices.getAllParticipantsAsync({
        selectedEvent,
        page,
        pageSize,
        search,
        sortBy,
        sortOrder
      });

      res.status(200).json(allParticipantsResult);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  getAllParticipantswithoutpagination: async (req, res) => {
    try {
      // Fetch all participants without any filters
      const participantsResult = await eventParticipationServices.getAllParticipantsSimpleAsync();

      res.status(200).json(participantsResult);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  getEventParticipant: async (req, res) => {
    try {
      const id = req.params.id;
      const Result = await eventParticipationServices.getEventParticipantByIdAsync(id);

      res.status(200).json(Result);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  updateEventParticipant: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, email, contact, event } = req.body;

      const updateResult = await eventParticipationServices.updateEventParticipantAsync({
        id: id,
        name,
        email,
        contact,
        event,
      });

      if (!updateResult.success)
        throw new Error(updateResult.message);

      res.status(200).json(updateResult);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },


  deleteEventParticipantById: async (req, res) => {
    try {
      const id = req.params.id;

      const result = await eventParticipationServices.deleteEventParticipantAsync(id);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllIssuedCertificates: async (req, res) => {
    try {
      const {email} = req.body;
      const result = await eventParticipationServices.getAllIssuedCertificatesData(email);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  attendedEvent: async (req, res) => {
    try {
      const { id } = req.body;
      const result = await eventParticipationServices.attendedEventAsync(id);
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

module.exports = ParticipantController;