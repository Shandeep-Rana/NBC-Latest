const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "event_participants";
const constants = require("../constants/index");
const auditServices = require("./auditServices");
const URL = constants.IMAGE_URL;

class event_participantsServices {

    async addParticipantAsync(data) {

        try {

            const existingParticipant = await knex(tableName)
                .where({
                    email: data.email,
                    event_id: data.event,
                    isDeleted: false
                })
                .first();

            if (existingParticipant) {
                throw new Error("Participant already registered for this event");
            }

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

            const participantQuery = knex('event_participants')
                .select(
                    'event_participants.id',
                    'event_participants.name',
                    'event_participants.email',
                    'event_participants.contact',
                    'event_participants.uploads',
                    'event_participants.attended',
                    'events.title as eventTitle',
                    knex.raw(`'registered' as userType`)
                )
                .leftJoin('events', 'event_participants.event_id', 'events.eventId')
                .where('event_participants.isDeleted', false)
                .andWhere('events.isDeleted', false);

            const guestQuery = knex('guestuser')
                .select(
                    'guestuser.id',
                    'guestuser.name',
                    'guestuser.email',
                    'guestuser.contact',
                    'guestuser.upload as uploads',
                    'guest_event_participants.has_attended as attended',
                    'events.title as eventTitle',
                    knex.raw(`'guest' as userType`)
                )
                .innerJoin('guest_event_participants', 'guestuser.id', 'guest_event_participants.guest_user_id')
                .leftJoin('events', 'guest_event_participants.event_id', 'events.eventId')
                .where('guestuser.isDeleted', false)
                .andWhere('guest_event_participants.is_deleted', false)
                .andWhere('events.isDeleted', false);

            // Add filters
            if (selectedEvent) {
                participantQuery.andWhere('event_participants.event_id', selectedEvent);
                guestQuery.andWhere('guest_event_participants.event_id', selectedEvent);
            }

            if (search) {
                participantQuery.andWhere(builder => {
                    builder.where('event_participants.name', 'like', `%${search}%`)
                        .orWhere('event_participants.email', 'like', `%${search}%`)
                        .orWhere('event_participants.contact', 'like', `%${search}%`);
                });

                guestQuery.andWhere(builder => {
                    builder.where('guestuser.name', 'like', `%${search}%`)
                        .orWhere('guestuser.email', 'like', `%${search}%`)
                        .orWhere('guestuser.contact', 'like', `%${search}%`);
                });
            }

            const [participants, guestUsers] = await Promise.all([
                participantQuery,
                guestQuery
            ]);

            const allParticipants = [...participants, ...guestUsers].map(p => ({
                ...p,
                uploads: p.uploads ? `${URL}/gallery/competetion/${p.uploads}` : null
            }));

            // Sort combined data
            const sortedParticipants = allParticipants.sort((a, b) => {
                const aVal = a[sortBy];
                const bVal = b[sortBy];
                return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
            });

            // Paginate in-memory
            const paginated = sortedParticipants.slice(offset, offset + pageSize);

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: {
                    participants: paginated,
                    pagination: {
                        total: allParticipants.length,
                        currentPage: page,
                        totalPages: Math.ceil(allParticipants.length / pageSize)
                    },
                    eventTitle: paginated.length > 0 ? paginated[0].eventTitle : null
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

    async getAllArtGalleryParticipantsSimpleAsync() {
        try {
            let query = knex(tableName)
                .select(
                    'event_participants.id',
                    'event_participants.name',
                    'event_participants.email',
                    'event_participants.contact',
                    'event_participants.uploads',
                    'events.title as eventTitle',
                )
                .where('event_participants.isdeleted', false)
                .andWhere('event_participants.event_id', 133) // Filter by event_id = 133
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