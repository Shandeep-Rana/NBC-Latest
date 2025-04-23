const userModel = require("../model/userModel");
const passwordOtpModel = require("../model/passwordOtpModel");
const commonFunc = require('../utils/common');

const changePassword = async (req, res) => {
  try {
    const { userId, otp, password } = req.body;

    var decryptedUserId = commonFunc.decrypt(userId);
    const otprecord = await passwordOtpModel.getPasswordOtpByUserId(decryptedUserId);

    if (!otprecord) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentTime = new Date().getTime();
    const diff = otprecord.otpExpiryDate - currentTime;

    if (diff < 0) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    if(otprecord.isOtpUsed === 1) {
      return res.status(400).json({ error: "OTP has already been used" });
    }

    if (otprecord.isdeleted === 0 && otprecord.otp === otp) {
      await userModel.updateUserPassword(decryptedUserId, password);
      // Update OTP record to mark it as used
      await passwordOtpModel.updateIsOtpUsed(decryptedUserId);
      return res.status(200).json({ message: "Password changed successfully" });   

    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = changePassword;
