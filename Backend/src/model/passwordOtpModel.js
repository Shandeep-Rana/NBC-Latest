const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "PasswordOtp";

const passwordOtpModel = {
  // Method to create a new OTP record
  createPasswordOtp: async (Otp) => {
    try {
      const [Id] = await knex(tableName).insert(Otp);
      return Id;
    } catch (error) {
      console.error("Error creating password OTP:", error);
      throw error;
    }
  },

  getPasswordOtpByUserId: async (userId) => {
    try {
      const passwordOtp = await knex(tableName)
        .where("userId", userId)
        .where("isactivated", true)
        .orderBy("ActivatedAt", "desc")
        .first();

      if (!passwordOtp) {
        throw new Error("Password OTP not found for the given user ID");
      }

      return passwordOtp;
    } catch (error) {
      console.error("Error getting password OTP by user ID:", error);
      throw error;
    }
  },

  updateIsOtpUsed: async (userId) => {
    try {
      await knex(tableName)
        .where("userId", userId)
        .update({ isOtpUsed: true, isactivated: false, isdeleted: true });
    } catch (error) {
      console.error("Error updating isotp:", error);
      throw error;
    }
  },
};

module.exports = passwordOtpModel;
