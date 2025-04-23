const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "events";

const constants = require("../constants/index");
const URL = constants.IMAGE_URL;

module.exports = {
  //adding new event
  addEvent: async (event) => {
    try {
      const [eventId] = await knex(tableName).insert(event);
      return eventId;
    } catch (error) {
      console.error("Error adding event:", error);
      throw error;
    }
  },

  getAllEvents: async ({
    searchTerm,
    sortBy,
    sortOrder,
    page,
    pageSize,
  }) => {
    let query = knex(tableName)
      .select(
        "events.eventId",
        "events.title",
        "events.description",
        "events.thumbnail",
        "events.startDateTime",
        "events.endDateTime",
        "events.organiser",
        "events.contact",
        "events.location",
        "events.isdeleted",
        "events.isactivated",
        "events.deletedOn",
        "events.activatedOn",
        "events.allowParticipants", // Newly added field
        "events.requireUpload", // Newly added field
        "events.maxParticipants", // Newly added field
        "events.eventType", // Newly added field
        "event_category.category_name as categoryName" // Fetch category_name from event_category table
      )
      .leftJoin("event_category", "events.categoryId", "event_category.category_id") // Join to get category_name
      .where("events.isactivated", true).andWhere("events.isdeleted", false)

    // Searching
    if (searchTerm) {
      query = query.where((builder) => {
        builder
          .where("events.title", "like", `%${searchTerm}%`)
          .orWhere("events.description", "like", `%${searchTerm}%`)
          .orWhere("events.organiser", "like", `%${searchTerm}%`)
          .orWhere("events.location", "like", `%${searchTerm}%`);
      });
    }

    // Ordering by the difference between startDateTime and current date/time
    query = query.orderByRaw("ABS(DATEDIFF(startDateTime, NOW()))");

    // Sorting
    if (sortBy && sortOrder) {
      query = query.orderBy(sortBy, sortOrder);
    }

    // Pagination
    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query = query.offset(offset).limit(pageSize);
    }

    const totalCountQuery = knex(tableName)
      .count("* as total")
      .where("isdeleted", false)
      .andWhere("isactivated", true);
    const totalCountResult = await totalCountQuery.first();

    const eventData = await query;

    // Modify each event object to include imageUrl
    const eventsWithImageUrl = eventData.map((event) => {
      const imageUrl = event.thumbnail
        ? `${URL}/thumbnail/${event.thumbnail}`
        : null;
      return { ...event, imageUrl };
    });

    return {
      data: eventsWithImageUrl,
      totalCount: totalCountResult.total,
    };
  },


  // Get all event
  getAllRequestEvents: async ({
    searchTerm,
    sortBy,
    sortOrder,
    page,
    pageSize,
  }) => {
    let query = knex(tableName)
      .select(
        "events.eventId",
        "events.title",
        "events.description",
        "events.thumbnail",
        "events.startDateTime",
        "events.endDateTime",
        "events.organiser",
        "events.contact",
        "events.location",
        "events.isdeleted",
        "events.isactivated",
        "events.deletedOn",
        "events.activatedOn",
        "events.allowParticipants", // Newly added field
        "events.requireUpload", // Newly added field
        "events.maxParticipants", // Newly added field
        "events.eventType", // Newly added field
        "event_category.category_name as categoryName" // Fetch category_name from event_category table
      )
      .leftJoin("event_category", "events.categoryId", "event_category.category_id") // Join to get category_name
      .where("events.isactivated", false)
      .andWhere("events.isdeleted", false)

    // Searching
    if (searchTerm) {
      query = query.where((builder) => {
        builder
          .where("title", "like", `%${searchTerm}%`)
          .orWhere("description", "like", `%${searchTerm}%`)
          .orWhere("organiser", "like", `%${searchTerm}%`)
          .orWhere("location", "like", `%${searchTerm}%`)
      });
    }

    // Ordering by the difference between startDateTime and current date/time
    query = query.orderByRaw("ABS(DATEDIFF(startDateTime, NOW()))");

    // Sorting
    if (sortBy && sortOrder) {
      query = query.orderBy(sortBy, sortOrder);
    }

    // Pagination
    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query = query.offset(offset).limit(pageSize);
    }

    const totalCountQuery = knex(tableName).count("* as total").where("isactivated", false).andWhere("isdeleted", false);;
    const totalCountResult = await totalCountQuery.where("isactivated", false).andWhere("isdeleted", false).first();

    const eventData = await query;

    // Modify each donor object to include imageUrl
    const eventsWithImageUrl = eventData.map(event => {
      const imageUrl = event.thumbnail
        ? `${URL}/thumbnail/${event.thumbnail}`
        : null;
      return { ...event, imageUrl };
    });

    return {
      data: eventsWithImageUrl,
      totalCount: totalCountResult.total,
    };
  },

  getEventById: async (eventId) => {
    try {
      // Fetch the event details along with the category_name from the event_category table
      const event = await knex(tableName)
        .select(
          "events.eventId",
          "events.title",
          "events.description",
          "events.thumbnail",
          "events.startDateTime",
          "events.endDateTime",
          "events.organiser",
          "events.contact",
          "events.location",
          "events.isdeleted",
          "events.isactivated",
          "events.deletedOn",
          "events.activatedOn",
          "events.allowParticipants", // Newly added field
          "events.requireUpload", // Newly added field
          "events.maxParticipants", // Newly added field
          "events.eventType", // Newly added field
          "events.categoryId", // Newly added field
          "event_category.category_name as categoryName" // Fetch category_name from event_category table
        )
        .leftJoin("event_category", "events.categoryId", "event_category.category_id") // Join to get category_name
        .where('events.eventId', eventId)
        .first();

      // If event not found, return null
      if (!event) {
        return null;
      }

      // Fetch event images
      const images = await knex("event_images")
        .where('event_id', eventId)
        .andWhere('isactivated', true)
        .andWhere('isdeleted', false);

      // Return the event details with images
      return {
        ...event,
        images,
      };
    } catch (error) {
      console.error('Error fetching event by ID:', error);
      throw error;
    }
  },

  updateEventById: async (eventId, updatedEventData, thumbnail) => {
    if (thumbnail) {
      updatedEventData.thumbnail = thumbnail;
    }

    // Convert boolean values to integer
    if (updatedEventData.requireUpload !== undefined) {
      updatedEventData.requireUpload = updatedEventData.requireUpload === 'true' || updatedEventData.requireUpload === true ? 1 : 0;
    }

    if (updatedEventData.allowParticipants !== undefined) {
      updatedEventData.allowParticipants = updatedEventData.allowParticipants === 'true' || updatedEventData.allowParticipants === true ? 1 : 0;
    }

    // Set maxParticipants to null if undefined
    if (updatedEventData.maxParticipants === undefined) {
      updatedEventData.maxParticipants = null; // Ensure this is a JavaScript null
    }

    const filteredData = Object.keys(updatedEventData)
      .filter(key => updatedEventData[key] !== undefined && updatedEventData[key] !== null && updatedEventData[key] !== '')
      .reduce((obj, key) => {
        obj[key] = updatedEventData[key];
        return obj;
      }, {});
    return knex(tableName).where('eventId', eventId).update(filteredData);
  },

  updateEventImagesByEventId: async (eventId, additionalThumbnails = []) => {
    // Ensure additionalThumbnails is an array
    if (!Array.isArray(additionalThumbnails)) {
      throw new Error('additionalThumbnails must be an array');
    }

    // Filter out invalid filenames
    const filteredImages = additionalThumbnails.filter(filename => filename !== undefined && filename !== null && filename !== '');

    // Delete existing images for the event
    await knex('event_images').where('event_id', eventId).del();

    // Insert new images if there are any
    if (filteredImages.length > 0) {
      return knex('event_images').insert(
        filteredImages.map(filename => ({ event_id: eventId, name: filename, isactivated: true }))
      );
    }

    return [];
  },


  // Delete event by ID
  deleteEventById: async (eventId) => {
    return knex(tableName)
      .where("eventId", eventId)
      .update({ isActivated: false, isDeleted: true, deletedOn: knex.fn.now() });
  },

  // New method to delete images by eventId
  deleteImagesByEventId: async (eventId) => {
    return knex('event_images').where("event_id", eventId).del();
  },

  updateIsActivatedByEventId: async (eventId) => {
    try {
      const updatedCount = await knex(tableName)
        .where("eventId", eventId)
        .andWhere("isactivated", false)
        .update({ isactivated: true });

      return updatedCount;
    } catch (error) {
      console.error("Error updating isActivated by event ID:", error);
      throw error;
    }
  },

  //events by organniserId
  getEventsByOrganiserId: async ({ organiserId, searchTerm, page, pageSize }) => {
    try {
      let query = knex(tableName).where("organiserId", organiserId).andWhere("isdeleted", false);

      // Searching
      if (searchTerm) {
        query.where((builder) => {
          builder
            .where("title", "like", `%${searchTerm}%`)
            .orWhere("description", "like", `%${searchTerm}%`)
            .orWhere("organiser", "like", `%${searchTerm}%`)
            .orWhere("location", "like", `%${searchTerm}%`);
        });
      }

      // Pagination
      if (page && pageSize) {
        const offset = (page - 1) * pageSize;
        query = query.offset(offset).limit(pageSize);
      }

      // Execute the query
      const events = await query;

      return events;
    } catch (error) {
      console.error("Error retrieving events by organiserId:", error);
      throw error;
    }
  }

};
