const userModel = require("../model/userModel");
const commonFunc = require('../utils/common');
const userServices = require('../services/userServices');
const otpServices = require('../services/otpServices');
const constants = require('../constants/index');
const villageServices = require('../services/villageServices');
const professionServices = require('../services/professionServices');
const volunteerServices = require('../services/volunteerServices');
const roleServices = require('../services/rolesServices');
const mailServices = require('../services/mailServices');
const donorServices = require('../services/donorServices');
const skilledPersonServices = require('../services/skilledPersonServices');
const interestServices = require('../services/interestsServices');

const UserController = {

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      var result = await userServices.loginUserAsync({ email, password });
      return res.status(200).json(result);
    }
    catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  registerAsBoth: async (req, res) => {
    try {
      const ecryptedUserId = req.headers["user-id"];
      const userId = ecryptedUserId ? commFunctions.decrypt(ecryptedUserId) : null;
      const userProfile = req.file ? req.file.filename : null;
      const { fullName, email, password, mobile, dob, gender, contactMode, village, addressLine1, addressLine2, pincode, state, profession, bloodType, medicalHistory } = req.body;

      const existingUserResult = await userServices.getUserByEmailAsync(email);

      if (existingUserResult.success)
        throw new Error("User already exists with this email address");

      let villageId;
      const existingVillResult = await villageServices.getVillageByNameAsync(village);
      if (existingVillResult.success)
        villageId = existingVillResult.data.vill_id;
      else {
        const addVillageResult = await villageServices.addVillageAsync(village);
        if (addVillageResult.success) {
          villageId = addVillageResult.data
        }
      }

      let professionId;
      let existingProfessionResult = await professionServices.getProfessionByNameAsync(profession);
      if (existingProfessionResult.success) {
        professionId = existingProfessionResult.data.profession_id;
      }
      else {
        const addProfessionResult = await professionServices.addProfessionAsync(profession);
        if (addProfessionResult.success) {
          professionId = addProfessionResult.data;
        }
      }

      const createUserResult = await userServices.createUserAsync(userId, { fullName, email, password, mobile, dob, gender, userProfile, contactMode, villageId, addressLine1, addressLine2, pincode, state });
      if (!createUserResult.success) {
        throw new Error(createUserResult.message);
      }

      const newUserId = createUserResult.data;

      const addVolunteerResult = await volunteerServices.addVolunteerAsync(userId, { professionId, volUserId: newUserId });
      if (!addVolunteerResult.success) {
        throw new Error(addVolunteerResult.message);
      }

      const addDonorResult = await donorServices.addDonorAsync(userId, { bloodType, medicalHistory, donorUserId: newUserId });
      if (!addDonorResult.success) {
        throw new Error(addDonorResult.message);
      }

      const addUserToVolRoleResult = await roleServices.addUserToRoleAsync(newUserId, constants.ROLES.Volunteer);
      const addUserToDonRoleResult = await roleServices.addUserToRoleAsync(newUserId, constants.ROLES.Donor);
      if (!addUserToVolRoleResult.success || !addUserToDonRoleResult.success) {
        throw new Error(addUserToVolRoleResult.message);
      }

      const sentVerifyMailResult = await mailServices.sendVerifyOtpMail(newUserId, email);
      if (!sentVerifyMailResult.success) {
        throw new Error(sentVerifyMailResult.message);
      }

      res.status(200).json({ message: "An email has been sent to your account. Please check your imbox and verify your account to proceed.", success: true });
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  VerifyEmailForVolunteer: async (req, res) => {
    try {
      const {
        email,
      } = req.body;

      const existingUserResult = await userServices.getUserByEmailAsync(email);

      if (!existingUserResult.success) {
        return res.status(404).json({
          message: "Email not registered.",
          success: false,
        });
      }

      if (existingUserResult.success) {
        const userRolesResult = await roleServices.getUserRolesByIdAsync(
          existingUserResult.data.id
        );
        if (!userRolesResult.success) {
          throw new Error(userRolesResult.message);
        }

        if (!userRolesResult.data.includes(constants.ROLES.Donor)) {
          return res.status(404).json({
            message: "Email is not registered as a donor.",
            success: false,
          });
        }

        if (
          userRolesResult.data.includes(constants.ROLES.Volunteer) ||
          userRolesResult.data.includes(constants.ROLES.SkilledPerson) ||
          userRolesResult.data.includes(constants.ROLES.Admin)
        )
          throw new Error("User already exists with this email address");
      }
      res.status(200).json({
        message:
          "Successfully verified",
        success: true,
      });
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { otp, userId } = req.body;
      const decodedUserId = decodeURIComponent(userId); 
      const decryptedUserId = commonFunc.decrypt(decodedUserId);

      const otpRecordRes = await otpServices.getOtpByUserIdAsync(decryptedUserId);

      if (!otpRecordRes.success)
        return res.status(404).json(otpRecordRes);

      if (otpRecordRes.data.is_otp_used)
        return res.status(400).json({ error: "OTP has already been used", success: false });

      const currentTime = new Date();
      const diff = otpRecordRes.data.expiry_date - currentTime;

      if (diff < 0)
        return res.status(400).json({ error: "OTP has expired", success: false });

      if (otpRecordRes.data.otp !== otp)
        return res.status(400).json({ error: "Invalid OTP", success: false });

      await otpServices.updateOtpUsedAsync(decryptedUserId);
      var verifyRes = await userServices.verifyUserAccountAsync(decryptedUserId);
      return res.status(200).json(verifyRes);

    }
    catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  resendVerifyOtp: async (req, res) => {
    try {
      const { userId } = req.body;
      const decryptedUserId = commonFunc.decrypt(userId);

      const user = await userServices.getUserByIdAsync(decryptedUserId);
      if (!user.success) {
        return res.status(404).json({ error: "User not found", success: false });
      }

      const email = user.data.Email;

      const resendResult = await mailServices.sendVerifyOtpMail(decryptedUserId, email);

      if (!resendResult.success) {
        return res.status(resendResult.statusCode).json({ error: resendResult.message, success: false });
      }

      return res.status(200).json({ message: "New OTP sent successfully", success: true });

    } catch (error) {
      return res.status(500).json({ error: error.message, success: false });
    }
  },

  getUserDetailsByEmail: async (req, res) => {
    try {
      const email = req.params.email;
      const userRes = await userServices.getUserDetailsByEmailAsync(email);

      if (!userRes.success)
        return res.status(404).json(userRes);

      res.status(200).json(userRes);
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },


  getUserDetailsByid: async (req, res) => {
    try {
      const id = req.params.id;
      const decryptedUserId = commonFunc.decrypt(id);

      const userRes = await userServices.getUserByIdAsync(decryptedUserId);

      if (!userRes.success)
        return res.status(404).json(userRes);

      res.status(200).json(userRes);
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },


  updateUserById: async (req, res) => {
    try {
      const userProfile = req.file ? req.file.filename : null;
      const encryptedUserId = req.params.id;
      const userId = commonFunc.decrypt(encryptedUserId);
      const { fullName, mobile, dob, gender, contactMode, village, addressLine1, addressLine2, pincode, state, about, profession = null, interests = null } = req.body;

      const userRolesRes = await roleServices.getUserRolesByIdAsync(userId);
      if (!userRolesRes.success)
        throw new Error(userRolesRes.message);

      let villageId;
      const existingVillResult = await villageServices.getVillageByNameAsync(
        village
      );
      if (existingVillResult.success)
        villageId = existingVillResult.data.vill_id;
      else {
        const addVillageResult = await villageServices.addVillageAsync(village);
        if (addVillageResult.success) {
          villageId = addVillageResult.data;
        }
      }

      let professionId;
      let existingProfessionResult =
        await professionServices.getProfessionByNameAsync(profession);
      if (existingProfessionResult.success) {
        professionId = existingProfessionResult.data.profession_id;
      } else {
        const addProfessionResult = await professionServices.addProfessionAsync(
          profession
        );
        if (addProfessionResult.success) {
          professionId = addProfessionResult.data;
        }
      }

      let existingInterestResult = await interestServices.getInterestByNameAsync(interests);
      if (!existingInterestResult.success)
        throw new Error(existingInterestResult.message);
      let interestId = existingInterestResult.data.interest_id;

      const userRoles = userRolesRes.data;
      if (userRoles.includes(constants.ROLES.Volunteer)) {
        await volunteerServices.updateVolunteerByUserIdAsync(userId, { profession: professionId, interests: interestId });
      }
      else if (userRoles.includes(constants.ROLES.SkilledPerson)) {
        await skilledPersonServices.updateSkilledPersonByUserIdAsync(userId, { profession: professionId, interests: interestId });
      }
      else {
        throw new Error("User not found");
      }

      const updatedUserRes = await userServices.updateUserAsync(userId, userId, {
        fullName, mobile, dob, gender, userProfile, contactMode, village: villageId, addressLine1, addressLine2, pincode, state, about
      });
      res.status(200).json(updatedUserRes);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  updateUserProfileById: async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUserData = req.body;

      // Check if userProfile needs to be updated
      if (updatedUserData.userProfile) {
        await userModel.updateUserProfileById(userId, updatedUserData.userProfile);
      }

      const updatedUser = await userModel.updateUserById(userId, updatedUserData);

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "Updated Successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateAdminDetails: async (req, res) => {
    try {
      const userId = req.params.id;
      const data = req.body;
      const decryptedUserId = commonFunc.decrypt(userId);
      const user = await userModel.updateAdminDetailsAsync(decryptedUserId, data);

      if (!user)
        return res.status(404).json({ error: "User not found" });

      res.status(200).json({ message: "Updated Successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const userExistRes = await userServices.getUserByEmailAsync(email);
      if (!userExistRes.success)
        return res.status(404).json(userExistRes);

      const userRes = await userServices.getUserByIdAsync(userExistRes.data.id);
      if (!userRes.success)
        return res.status(404).json(userExistRes);

      if (!userRes.data.isActive)
        return res.status(400).json({ error: "Account is not verified", success: false });

      const userRolesRes = await roleServices.getUserRolesByIdAsync(userExistRes.data.id);
      if (!userRolesRes.success)
        return res.status(400).json(userRolesRes);

      if (userRolesRes.data.length === 1 && userRolesRes.data.includes(constants.ROLES.Donor))
        return res.status(404).json({ error: "User not found", success: false });

      const forgotMailRes = await mailServices.sendForgotPasswordMail(userExistRes.data.id, email);
      return res.status(200).json(forgotMailRes);
    } catch (error) {
      return res.status(500).json({ error: error.message, success: false });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { userId, otp, password } = req.body;

      var decryptedUserId = commonFunc.decrypt(userId);
      const otpRecordRes = await otpServices.getOtpByUserIdAsync(decryptedUserId);

      if (!otpRecordRes.success)
        return res.status(404).json(otpRecordRes);

      if (otpRecordRes.data.is_otp_used)
        return res.status(400).json({ error: "OTP has already been used", success: false });

      const currentTime = new Date().getTime();
      const diff = otpRecordRes.data.expiry_date - currentTime;

      if (diff < 0)
        return res.status(400).json({ error: "OTP has expired" });

      if (!otpRecordRes.data.otp === otp)
        return res.status(400).json({ error: "Invalid OTP", success: false });

      await otpServices.updateOtpUsedAsync(decryptedUserId);
      var restPassRes = await userServices.resetPasswordAsync(decryptedUserId, password);
      return res.status(200).json(restPassRes);
    }
    catch (error) {
      return res.status(500).json({ error: error.message, success: false });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { userId, oldPassword, password } = req.body;
      const decryptedUserId = commonFunc.decrypt(userId);
      var changePassRes = await userServices.changePasswordAsync(decryptedUserId, oldPassword, password);
      res.status(200).json(changePassRes);
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  }
};

module.exports = UserController;
