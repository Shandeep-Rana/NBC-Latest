const constants = require("../constants/index");
const userServices = require("../services/userServices");
const roleServices = require("../services/rolesServices");
const volunteerServices = require("../services/volunteerServices");
const villageServices = require("../services/villageServices");
const professionServices = require("../services/professionServices");
const mailServices = require("../services/mailServices");
const commFunctions = require("../utils/common");
const interestsServices = require("../services/interestsServices");
const guestUserServices = require("../services/guestUserServices");
const guestUserEventParticipationServices = require("../services/guestUserEventParticipationServices");

module.exports = {

    addGuestUser: async (req, res) => {
        try {
            const { name, email, contact, event } = req.body;

            let guestUserId;

            const existingRegisteredUser = await userServices.getUserByEmailAsync(email);
            const existingUserResult = await guestUserServices.getGuestUserByEmailAsync(email);

            if (existingRegisteredUser && existingRegisteredUser.success) {
                return res.status(400).json({
                    message: "Email is already registered as a user. Please log in to register for the event.",
                    success: false
                });
            }

            if (existingUserResult.success) {
                guestUserId = existingUserResult.data.id;
            } else {
                const createGuestUserResult = await guestUserServices.addGuestUserAsync({
                    name,
                    email,
                    contact
                });

                if (!createGuestUserResult.success) {
                    return res.status(500).json({
                        message: createGuestUserResult.message,
                        success: false
                    });
                }

                guestUserId = createGuestUserResult.data;
            }

            const registerResult = await guestUserEventParticipationServices.addGuestUserParticipantAsync({
                userId: guestUserId,
                eventId: event
            });

            if (!registerResult.success) {
                if (registerResult.message.includes("Participant already registered for this event")) {
                    return res.status(400).json({
                        message: "Guest user already registered for this event",
                        success: false
                    });
                }

                return res.status(400).json({
                    message: registerResult.message,
                    success: false
                });
            }

            return res.status(201).json({
                message: "Guest user registered for event successfully",
                success: true,
                data: {
                    guestUserId,
                    participantId: registerResult.data
                }
            });

        } catch (error) {
            if (!res.headersSent) {
                return res.status(500).json({
                    message: error.message,
                    success: false
                });
            }
        }
    },

    deleteGuestUser: async (req, res) => {
        try {
            const id = req.params.id;
            
            const getVolResult = await volunteerServices.getVolunteerAsync(volId);
            if (!getVolResult.success) throw new Error(getVolResult.message);

            const getRoleRes = await roleServices.getUserRolesByIdAsync(
                getVolResult.data.userId
            );
            if (!getRoleRes.success) throw new Error(getRoleRes.message);
            const roles = getRoleRes.data;
            const delVolResult = await volunteerServices.deleteVolunteerAsync(
                userId,
                volId
            );
            if (!delVolResult.success) throw new Error(delVolResult.message);

            if (roles.length === 1 && roles.includes(constants.ROLES.Volunteer)) {
                await userServices.deleteUserAsync(userId, getVolResult.data.userId);
            }
            await roleServices.deleteUserFromRoleAsync(getVolResult.data.userId, constants.ROLES.Volunteer);

            res.status(200).json({ message: "Deleted Successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message, success: false });
        }
    },
};
