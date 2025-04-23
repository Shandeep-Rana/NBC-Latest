const constants = require("../constants/index");
const userServices = require('../services/userServices');
const villageServices = require('../services/villageServices');
const donorServices = require('../services/donorServices');
const roleServices = require('../services/rolesServices');
const commFunctions = require('../utils/common');

const DonorController = {

  createdonor: async (req, res) => {
    try {
      const encryptedUserId = req.headers["user-id"];
      const userId = encryptedUserId ? commFunctions.decrypt(encryptedUserId) : null;

      const userProfile = req.file ? req.file.filename : null;
      const { fullName, email, mobile, dob, bloodType, medicalHistory, gender, contactMode, village, addressLine1, addressLine2, pincode, state } = req.body;

      const existingUserResult = await userServices.getUserByEmailAsync(email);
      let donorUserId;

      if (existingUserResult.success) {
        const existingUser = existingUserResult.data;
        donorUserId = existingUser.id; 

        const userRolesResult = await roleServices.getUserRolesByIdAsync(donorUserId);
        if (!userRolesResult.success || !Array.isArray(userRolesResult.data)) {
          throw new Error("Failed to fetch user roles");
        }

        if (userRolesResult.data.includes(constants.ROLES.Donor)) {
          throw new Error("Donor already exists with this email address");
        }
        const addUserToRoleResult = await roleServices.addUserToRoleAsync(donorUserId, constants.ROLES.Donor);
        if (!addUserToRoleResult.success) {
          throw new Error(addUserToRoleResult.message);
        }

      } else {
        let villageId = null;
        const existingVillResult = await villageServices.getVillageByNameAsync(village);
        if (existingVillResult.success) {
          villageId = existingVillResult.data.vill_id;
        } else {
          const addVillageResult = await villageServices.addVillageAsync(village);
          if (addVillageResult.success) {
            villageId = addVillageResult.data;
          } else {
            throw new Error("Failed to create or retrieve village");
          }
        }
        const createUserResult = await userServices.createUserAsync(userId, {
          fullName,
          email,
          password: constants.DONOR_PASSWORD,
          mobile,
          dob,
          gender,
          userProfile,
          contactMode,
          villageId,
          addressLine1,
          addressLine2,
          pincode,
          state,
          is_active: true,
          activated_on: new Date()
        });

        if (!createUserResult.success) {
          throw new Error(createUserResult.message);
        }

        donorUserId = createUserResult.data; 

        const addUserToRoleResult = await roleServices.addUserToRoleAsync(donorUserId, constants.ROLES.Donor);
        if (!addUserToRoleResult.success) {
          throw new Error(addUserToRoleResult.message);
        }
      }

      const addDonorResult = await donorServices.addDonorAsync(userId, { bloodType, medicalHistory, donorUserId });
      if (!addDonorResult.success) {
        throw new Error(addDonorResult.message);
      }

      res.status(200).json(addDonorResult);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  upgradeTodonor: async (req, res) => {
    try {

      const { bloodType, medicalHistory, user_id } = req.body;

      const userId = user_id ? commFunctions.decrypt(user_id) : null;

      const addDonorResult = await donorServices.addDonorAsync(userId, { bloodType, medicalHistory, donorUserId: userId });
      if (!addDonorResult.success) {
        throw new Error(addDonorResult.message);
      }

      const addUserToRoleResult = await roleServices.addUserToRoleAsync(userId, constants.ROLES.Donor);

      if (!addUserToRoleResult.success) {
        throw new Error(addUserToRoleResult.message);
      }

      const roleNameData = await roleServices.getUserRolesByIdAsync(userId);

      // Access the `data` field from roleNameData
      const roleNameArray = roleNameData.data;

      // Check if roleNameArray is empty
      if (!roleNameArray || roleNameArray.length === 0) {
        return res.status(500).json({ error: "Role name not found" });
      }

      // Respond with the results
      res.status(200).json({ ...addDonorResult, roleNames: roleNameArray });
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  getAllDonors: async (req, res) => {
    try {
      const { page, pageSize, search, selectedBloodGroup } = req.query;
      const allDonorsResult = await donorServices.getAllDonorsAsync({ page, pageSize, search, selectedBloodGroup });
      res.status(200).json(allDonorsResult);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  getDonor: async (req, res) => {
    try {
      const donorId = req.params.id;
      const donorResult = await donorServices.getDonorAsync(donorId);

      res.status(200).json(donorResult);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  updateDonor: async (req, res) => {
    try {
      const donorId = req.params.id;
      const ecryptedUserId = req.headers["user-id"];
      const userId = ecryptedUserId ? commFunctions.decrypt(ecryptedUserId) : null;

      const { fullName, mobile, dob, gender, contactMode, village, addressLine1, addressLine2, pincode, state, about = null, bloodType, medicalHistory } = req.body;

      const getDonorResult = await donorServices.getDonorAsync(donorId);
      if (!getDonorResult.success)
        throw new Error(getDonorResult.message);

      const existingVillResult = await villageServices.getVillageByNameAsync(village);
      if (!existingVillResult.success)
        throw new Error(existingVillResult.message)

      let villageId = existingVillResult.data.vill_id;
      const updateUserResult = await userServices.updateUserAsync(userId, getDonorResult.data.userId,
        { fullName, mobile, dob, gender, userProfile: commFunctions.extractUserProfile(getDonorResult.data.userProfile), contactMode, village: villageId, addressLine1, addressLine2, pincode, state, about });
      if (!updateUserResult.success)
        throw new Error(updateUserResult.message);

      const updateDonorResult = await donorServices.updateDonorAsync(userId, donorId, { bloodType, medicalHistory });
      if (!updateDonorResult.success)
        throw new Error(updateDonorResult.message);

      res.status(200).json(updateDonorResult);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  deleteDonor: async (req, res) => {
    try {
      const donorId = req.params.id;
      const ecryptedUserId = req.headers["user-id"];
      const userId = ecryptedUserId ? commFunctions.decrypt(ecryptedUserId) : null;
      const getDonorResult = await donorServices.getDonorAsync(donorId);
      if (!getDonorResult.success)
        throw new Error(getDonorResult.message);

      const getRoleRes = await roleServices.getUserRolesByIdAsync(getDonorResult.data.userId);
      if (!getRoleRes.success)
        throw new Error(getRoleRes.message);

      const roles = getRoleRes.data;
      const delDonorResult = await donorServices.deleteDonorAsync(userId, donorId);
      if (!delDonorResult.success)
        throw new Error(delDonorResult.message);

      if (roles.length === 1 && roles.includes(constants.ROLES.Donor)) {
        await userServices.deleteUserAsync(userId, getDonorResult.data.userId);
      }
      await roleServices.deleteUserFromRoleAsync(getDonorResult.data.userId, constants.ROLES.Donor);

      res.status(200).json({ message: "Deleted Successfully", success: true });

    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },
};

module.exports = DonorController;