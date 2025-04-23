const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "event_participants";
const constants = require("../constants/index");
const auditServices = require("./auditServices");
const URL = constants.IMAGE_URL;

class event_participantsServices {

    async addParticipantAsync(data) {

        try {
            // Check if participant is already registered for the given event
            const existingParticipant = await knex(tableName)
                .where({
                    email: data.email,
                    event_id: data.event,
                    isDeleted: false
                })
                .first(); // Use `.first()` to get a single record

            if (existingParticipant) {
                throw new Error("Participant already registered for this event");
            }

            // Proceed with adding the new participant
            const newParticipant = {
                name: data.name,
                email: data.email,
                contact: data.contact,
                event_id: data.event,
                user_id: data.user_id,
                uploads: data.upload
            };

            const [id] = await knex(tableName).insert(newParticipant);

            return {
                message: "Registered Successfully",
                statusCode: 201,
                success: true,
                data: id
            };
        } catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getAllParticipantsAsync({
        selectedEvent,
        page = 1,
        pageSize = 10,
        search,
        sortBy = 'id',
        sortOrder = 'desc'
    }) {
        try {
            const offset = (page - 1) * pageSize;

            let query = knex(tableName)
                .select(
                    'event_participants.id',
                    'event_participants.name',
                    'event_participants.email',
                    'event_participants.contact',
                    "event_participants.uploads",
                    "event_participants.attended",
                    'events.title as eventTitle'
                )
                .where('event_participants.isdeleted', false)
                .leftJoin('events', 'event_participants.event_id', 'events.eventId')
                .andWhere('events.isdeleted', false);

            let countQuery = knex(tableName)
                .count('event_participants.id as count')
                .where('event_participants.isdeleted', false);

            if (search) {
                query = query.andWhere(builder => {
                    builder.where('event_participants.name', 'like', `%${search}%`)
                        .orWhere('event_participants.email', 'like', `%${search}%`)
                        .orWhere('event_participants.contact', 'like', `%${search}%`);
                });

                countQuery = countQuery.andWhere(builder => {
                    builder.where('event_participants.name', 'like', `%${search}%`)
                        .orWhere('event_participants.email', 'like', `%${search}%`)
                        .orWhere('event_participants.contact', 'like', `%${search}%`);
                });
            }

            query = query.orderBy(sortBy, sortOrder).limit(pageSize).offset(offset);

            if (selectedEvent) {
                query = query.andWhere('event_participants.event_id', selectedEvent);
                countQuery = countQuery.andWhere('event_participants.event_id', selectedEvent);
            }

            const participants = await query;
            const [{ count }] = await countQuery;

            const processedParticipants = participants.map(participant => {
                participant.uploads = participant.uploads
                    ? `${URL}/gallery/competetion/${participant.uploads}`
                    : null;

                return participant;
            });


            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: {
                    participants: processedParticipants,
                    pagination: {
                        total: parseInt(count, 10),
                        currentPage: page,
                        totalPages: Math.ceil(count / pageSize)
                    },
                    eventTitle: participants.length > 0 ? participants[0].eventTitle : null
                }
            };
        } catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getAllParticipantsSimpleAsync() {
        try {
            let query = knex(tableName)
                .select(
                    'event_participants.id',
                    'event_participants.name',
                    'event_participants.email',
                    'event_participants.contact',
                    "event_participants.uploads",
                    'events.title as eventTitle',
                )
                .where('event_participants.isdeleted', false)
                .leftJoin('events', 'event_participants.event_id', 'events.eventId')
                .andWhere('events.isdeleted', false);

            const participants = await query;

            const processedParticipants = participants.map(participant => {
                participant.uploads = participant.uploads
                    ? `${URL}/gallery/competetion/${participant.uploads}`
                    : null;

                return participant;
            });

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: {
                    participants: processedParticipants,
                    eventTitle: participants.length > 0 ? participants[0].eventTitle : null
                }
            };
        } catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }


    async deleteEventParticipantAsync(id) {
        try {

            await knex(tableName)
                .where('id', id)
                .update({
                    isDeleted: true,
                    deletedOn: new Date(),
                });

            const resultObject = {
                message: "Deleted Successfully",
                statusCode: 200,
                success: true,
                data: null
            };
            return resultObject;

        } catch (err) {
            const resultObject = {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
            return resultObject;
        }
    }

    async getEventParticipantByIdAsync(id) {
        try {
            const participant = await knex(tableName)
                .select(
                    'event_participants.id',
                    'event_participants.name',
                    'event_participants.email',
                    'event_participants.contact',
                    'event_participants.event_id',
                    'events.title as eventTitle'
                )
                .where({
                    'event_participants.id': id,
                    'event_participants.isDeleted': false
                })
                .leftJoin('events', 'event_participants.event_id', 'events.eventId')
                .first();

            if (!participant) {
                throw new Error("Participant not found or has been deleted");
            }

            return {
                message: "Participant fetched successfully",
                statusCode: 200,
                success: true,
                data: participant
            };
        } catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async updateEventParticipantAsync(data) {
        try {
            await knex(tableName)
                .where('id', data.id)
                .update({
                    name: data.name,
                    email: data.email,
                    contact: data.contact,
                    event_id: data.event,
                });

            return {
                message: "Event Participant updated Successfully",
                statusCode: 200,
                success: true,
                data: null
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

    async attendedEventAsync(id) {
        try {

            const beforeUpdate = await knex('event_participants').where({ id }).first();

            const certificateNo = `CERT-${id}-${Date.now()}`;
            console.log("Generated Certificate Number:", certificateNo);
            
            await knex('event_participants')
                .where('id', id)
                .update({
                    attended: true,
                    attendence_time: new Date(),
                    certificate_no: certificateNo
                });

            const afterUpdate = await knex('event_participants').where({ id }).first();

            await auditServices.afterUpdateAsync(beforeUpdate.user_id, 'event_participants', id, beforeUpdate, afterUpdate);

            return {
                message: "Attendance marked successfully",
                statusCode: 200,
                success: true,
                data: afterUpdate
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

    async getAllIssuedCertificatesData(email) {
        try {
            const certificateData = await knex('event_participants')
                .select(
                    'event_participants.*', // Select all fields from event_participants
                    'events.title as eventName', // Get the event title
                    'events.endDateTime' // Get the event end time
                )
                .leftJoin('events', 'event_participants.event_id', 'events.eventId') // Join with events table
                .where({
                    'event_participants.email': email,
                    'event_participants.attended': true,
                    'event_participants.isDeleted': false,
                    'event_participants.isActive': true
                });

            return {
                message: "Certificates retrieved successfully",
                statusCode: 200,
                success: true,
                data: certificateData
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
}


module.exports = new event_participantsServices();