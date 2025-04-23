const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "password_otp";

class OtpServices {

    async savePasswordOtp(otpData) {
        try {
            const [otp_id] = await knex(tableName).insert(otpData);
            return {
                message: "Otp saved successfully",
                statusCode: 201,
                success: true,
                data: otp_id
            };
        }
        catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false
            };
        }
    }

    async getOtpByUserIdAsync(userId) {
        try {
            const passwordOtp = await knex(tableName).where('user_id', userId).orderBy('created_at', "desc").first();
            if (!passwordOtp) {
                throw new Error("OTP not found for the given user");
            }
            return {
                success: true,
                data: passwordOtp
            };
        }
        catch (error) {
            return {
                message: error.message,
                success: false
            };
        }
    }

    async updateOtpUsedAsync(userId) {
        try {
            await knex(tableName)
                .where('user_id', userId)
                .update({
                    is_otp_used: true
                })
            return true
        }
        catch (error) {
            return false;
        }
    }

    async getLatestOtpByUserId(userId) {
        try {
            // Fetch the latest OTP for the user
            const latestOtp = await knex(tableName)
                .where('user_id', userId)
                .orderBy('created_at', 'desc')
                .first();
            return {
                success: true,
                data: latestOtp
            };
        } catch (error) {
            return {
                message: error.message,
                success: false
            };
        }
    }

}

module.exports = new OtpServices();