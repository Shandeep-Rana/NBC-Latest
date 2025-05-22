const eventModel = require("../model/eventsModel");
const constants = require("../constants/index");
const URL = constants.IMAGE_URL;
const eventServices = require('../services/eventServices');
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const commFunctions = require('../utils/common');
const roleServices = require('../services/rolesServices');
const mailServices = require("../services/mailServices");

const eventController = {

  getPaginatedEvents: async (req, res) => {
    try {
      const { page, pageSize } = req.query;

      const result = await eventServices.getPaginatedEvents({ page, pageSize });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllForEvents: async (req, res) => {
    try {

      const result = await eventServices.getAllEvents();

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getEventByTitle: async (req, res) => {
    try {
      // const title = req.params.title;

      const { title } = req.body;
      const eventRes = await eventServices.getEventByTitleAsync(title);

      if (!eventRes)
        return res.status(404).json({ error: "Event not found", success: false });

      res.status(200).json(eventRes);
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  createEvent: async (req, res) => {
    try {
      const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].filename : null;
      const uploadedImages = req.files['additionalThumbnail']?.map((file) => file.filename);
      const { title, organiser, description, contact, startDateTime, endDateTime, location, userId, eventType, eventCategory, requireUpload,
        allowParticipants, maxParticipants } = req.body;

      const decodedUserId = decodeURIComponent(userId);
      const decryptedUserId = commFunctions.decrypt(decodedUserId);

      const isTitleExist = await eventServices.isTitleExistAsync(title);
       console.log(isTitleExist)

      if (isTitleExist)
        throw new Error(`Event with title(${title}) is already existed`);

      const startDate = new Date(startDateTime);
      const endDate = new Date(endDateTime);
      const currentDate = new Date();

      if (endDate <= startDate)
        return res.status(400).json({ error: "endDateTime must be after startDateTime" });

      const userRoleRes = await roleServices.getUserRolesByIdAsync(decryptedUserId);

      if (!userRoleRes.success)
        return res.status(400).json({ error: "Invalid User Role" });

      const userRoles = userRoleRes.data;
      let isActivated = userRoles.includes(constants.ROLES.Admin) ? true : false

      if (!isActivated) {
        if (startDate <= currentDate)
          return res.status(400).json({ error: "startDateTime must be in the future" });
      }

      const requireUploadValue = requireUpload === 'true' || requireUpload === true ? 1 : 0;
      const allowParticipantsValue = allowParticipants === 'true' || allowParticipants === true ? 1 : 0;
      const maxParticipantsValue = allowParticipantsValue === 'false' || allowParticipantsValue == 0 ? null : maxParticipants;

      const newEvent = {
        title,
        description,
        thumbnail,
        contact,
        startDateTime,
        endDateTime,
        organiser,
        organiserId: decryptedUserId,
        location,
        isdeleted: false,
        isactivated: isActivated,
        deletedOn: null,
        activatedOn: new Date(),
        eventType,
        categoryId: eventCategory,
        requireUpload: requireUploadValue,
        allowParticipants: allowParticipantsValue,
        maxParticipants: maxParticipantsValue
      };
      const eventId = await eventModel.addEvent(newEvent);

      // Insert additional thumbnails into 'event_images' table
      if (uploadedImages && uploadedImages.length > 0) {
        uploadedImages.forEach(async (image) => {
          await knex('event_images').insert({
            name: image,
            event_id: eventId,
            isactivated: isActivated
          });
        });
      }

      const eventDetails = {
        eventId,
        title,
        description,
        date: `${startDate.toDateString()} - ${endDate.toDateString()}`,
        location,
        organiser,
        allowParticipants,
        thumbnail: thumbnail
          ? `${URL}/thumbnail/${thumbnail}`
          : null,
      };

      if (isActivated) {
        await mailServices.sendEventCreatedMail(eventDetails);
      }


      res.status(200).json({ message: "Event added and email sent successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  // Get all events
  getAllevents: async (req, res) => {
    try {
      const {
        searchTerm,
        sortBy,
        sortOrder,
        page,
        pageSize,
      } = req.query;

      const data = await eventModel.getAllEvents({
        searchTerm,
        sortBy,
        sortOrder,
        page,
        pageSize,
      });

      res.status(200).json(data);
    } catch (error) {
      console.error("Error getting all events:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get all events
  getAllrequestevents: async (req, res) => {
    try {
      const {
        searchTerm,
        sortBy,
        sortOrder,
        page,
        pageSize,
      } = req.query;

      const data = await eventModel.getAllRequestEvents({
        searchTerm,
        sortBy,
        sortOrder,
        page,
        pageSize,
      });

      res.status(200).json(data);
    } catch (error) {
      console.error("Error getting all events:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //approval of the event
  updateEventActivation: async (req, res) => {
    try {
      const eventId = req.params.id;

      // Call the model function to update isActivated
      const updatedCount = await eventModel.updateIsActivatedByEventId(eventId);

      const eventDetails = await eventModel.getEventById(eventId);
      console.log(eventDetails)

      if (eventDetails) {
        // Extract and format startDateTime and endDateTime
        const startDate = new Date(eventDetails.startDateTime);
        const endDate = new Date(eventDetails.endDateTime);
        const formattedDate = `${startDate.toDateString()} - ${endDate.toDateString()}`;

        const thumbnailUrl = eventDetails.thumbnail
          ? `${URL}/thumbnail/${eventDetails.thumbnail}`
          : null;

        // Update eventDetails with formatted date
        const updatedEventDetails = {
          ...eventDetails,
          date: formattedDate,
          thumbnail: thumbnailUrl
        };

        console.log(updatedEventDetails)

        // Send email with updated event details
        await mailServices.sendEventCreatedMail(updatedEventDetails);
      }

      if (updatedCount === 0) {
        return res.status(404).json({ error: "Event not found or already activated" });
      }

      res.status(200).json({ message: "Event activation updated successfully" });
    } catch (error) {
      console.error("Error updating event activation:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get event by ID
  geteventById: async (req, res) => {
    try {
      const eventId = req.params.id;
      const event = await eventModel.getEventById(eventId);

      if (!event) {
        return res.status(404).json({ error: "event not found" });
      }
      const imagesWithUrl = event.images.map(image => ({
        imageUrl: `${URL}/additionalThumbnail/${image.name}`
      }));

      const imageUrl = event.thumbnail
        ? `${URL}/thumbnail/${event.thumbnail}`
        : null;

      const eventWithImageUrl = {
        ...event,
        imageUrl,
        images: imagesWithUrl
      };

      res.status(200).json(eventWithImageUrl);
    } catch (error) {
      console.error("Error getting event by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllEventsByOrganiserId: async (req, res) => {
    try {
      const {
        searchTerm,
        page,
        pageSize,
      } = req.query;
      const organiserId = req.params.id;
      const decryptedUserId = commFunctions.decrypt(organiserId);
      if (!decryptedUserId) {
        return res.status(404).json({ error: "organiserId not found" });
      }
      const events = await eventModel.getEventsByOrganiserId({
        organiserId: decryptedUserId,
        searchTerm,
        page,
        pageSize,
      });

      if (!events) {
        return res.status(404).json({ error: "event not found" });
      }
      res.status(200).json(events);
    } catch (error) {
      console.error("Error getting events by organiserId:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Update event by ID
  updateEventById: async (req, res) => {
    try {
      const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].filename : null;
      const uploadedImages = req.files['additionalThumbnail']?.map((file) => file.filename);

      const eventId = req.params.id;
      const updatedEventData = req.body;

      // Set maxParticipants to null if undefined
      if (updatedEventData.maxParticipants === undefined) {
        updatedEventData.maxParticipants = null; // Ensure this is a JavaScript null
      }

      const updatedevent = await eventModel.updateEventById(
        eventId,
        updatedEventData,
        thumbnail
      );

      // Update event images
      const updatedEventImages = await eventModel.updateEventImagesByEventId(eventId, uploadedImages);
      if (!updatedEventImages) {
        return res.status(404).json({ error: "Event images not updated" });
      }

      // Check if updatedEventData is empty
      if (Object.keys(updatedEventData).length === 0) {
        return res.status(400).json({ error: "No data provided for update" });
      }

      if (!updatedevent) {
        return res.status(404).json({ error: "event not found" });
      }

      res.status(200).json({ message: "event updated successfully" });
    } catch (error) {
      console.error("Error updating event by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Delete event by ID
  deleteEventById: async (req, res) => {
    try {
      const eventId = req.params.id;
      const deletedevent = await eventModel.deleteEventById(eventId);

      await eventModel.deleteImagesByEventId(eventId);


      if (!deletedevent) {
        return res.status(404).json({ error: "event not found" });
      }

      res.status(200).json({ message: "event deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};

module.exports = eventController;
