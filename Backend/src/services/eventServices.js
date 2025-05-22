const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "events";
const constants = require("../constants/index");
const URL = constants.IMAGE_URL;

class EventServices {
    async getPaginatedEvents({ page = 1, pageSize = 9 }) {
        try {
            const offset = (page - 1) * pageSize;
            const currentDate = new Date().toISOString();

            const query = knex(tableName)
                .select('*')
                .where('isDeleted', false)
                .andWhere('isactivated', true)
                .orderByRaw(`
                    (startDateTime <= ? AND endDateTime >= ?) DESC,
                    (startDateTime > ?) DESC,
                    (endDateTime < ?) ASC,
                    CASE WHEN startDateTime <= ? AND endDateTime >= ? THEN startDateTime ELSE NULL END ASC,
                    CASE WHEN startDateTime > ? THEN startDateTime ELSE NULL END ASC,
                    CASE WHEN endDateTime < ? THEN endDateTime ELSE NULL END DESC
                `, [currentDate, currentDate, currentDate, currentDate, currentDate, currentDate, currentDate, currentDate])
                .limit(pageSize)
                .offset(offset);

            const countQuery = knex(tableName)
                .count('* as total')
                .where('isDeleted', false);

            const [events, countResult] = await Promise.all([query, countQuery]);
            const total = parseInt(countResult[0].total, 10);
            const hasMore = (page * pageSize) < total;

            const eventsWithImageUrl = events.map(event => {
                const imageUrl = event.thumbnail
                    ? `${URL}/thumbnail/${event.thumbnail}`
                    : null;
                return { ...event, imageUrl };
            });

            return {
                message: 'Events fetched successfully',
                statusCode: 200,
                success: true,
                data: {
                    eventsWithImageUrl,
                    total,
                    hasMore,
                },
            };

        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getAllEvents() {
        try {
            const currentDate = new Date().toISOString();

            const query = knex(tableName)
                .select('*')
                .where('isDeleted', false)
                .andWhere('isactivated', true)
                .orderByRaw(`
                    (startDateTime <= ? AND endDateTime >= ?) DESC,
                    (startDateTime > ?) DESC,
                    (endDateTime < ?) ASC,
                    CASE WHEN startDateTime <= ? AND endDateTime >= ? THEN startDateTime ELSE NULL END ASC,
                    CASE WHEN startDateTime > ? THEN startDateTime ELSE NULL END ASC,
                    CASE WHEN endDateTime < ? THEN endDateTime ELSE NULL END DESC
                `, [currentDate, currentDate, currentDate, currentDate, currentDate, currentDate, currentDate, currentDate]);

            const countQuery = knex(tableName)
                .count('* as total')
                .where('isDeleted', false)
                .andWhere('isactivated', true);

            const [events, countResult] = await Promise.all([query, countQuery]);
            const total = parseInt(countResult[0].total, 10);

            const eventsWithImageUrl = events.map(event => {
                const imageUrl = event.thumbnail
                    ? `${URL}/thumbnail/${event.thumbnail}`
                    : null;
                return { ...event, imageUrl };
            });

            return {
                message: 'Events fetched successfully',
                statusCode: 200,
                success: true,
                data: {
                    eventsWithImageUrl,
                    total
                },
            };

        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async isTitleExistAsync(title) {
        try {
            let event = await knex(tableName).select('eventId').where('title', title).andWhere('isdeleted', false).first();

            if (!event) { return false; }


            return true;
        }
        catch (err) {
            return false;
        }
    }

    async getEventByTitleAsync(title) {
        try {
            let event = await knex(tableName).where('title', title).andWhere('isactivated', true).andWhere('isdeleted', false).first();
            if (!event) {
                throw new Error("No Event found");
            }

            event.thumbnail = event.thumbnail ? `${URL}/thumbnail/${event.thumbnail}` : null;

            const images = await knex("event_images").where('event_id', event.eventId).andWhere('isactivated', true).andWhere('isdeleted', false);

            const imagesWithUrl = images.map(image => ({
                imageUrl: `${URL}/additionalThumbnail/${image.name}`
            }));

            return {
                message: "Fetched Successfully",
                success: true,
                data: { ...event, imagesWithUrl }
            }
        }
        catch (err) {
            return {
                message: err.message,
                success: false
            }
        }
    }
}

module.exports = new EventServices();