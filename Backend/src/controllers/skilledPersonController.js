const constants = require('../constants/index');
const userServices = require('../services/userServices');
const villageServices = require('../services/villageServices');
const skilledPersonServices = require('../services/skilledPersonServices');
const rolesServices = require('../services/rolesServices');
const mailServices = require('../services/mailServices');
const professionServices = require('../services/professionServices');
const commFunctions = require('../utils/common');
const interestsServices = require('../services/interestsServices');

module.exports = {
  addSkilledPerson: async (req, res) => {
    try {
      const ecryptedUserId = req.headers["user-id"];
      const userId = ecryptedUserId
        ? commFunctions.decrypt(ecryptedUserId)
        : null;
      const userProfile = req.file ? req.file.filename : null;
      const {
        fullName,
        email,
        password,
        mobile,
        dob,
        gender,
        contactMode,
        village,
        addressLine1,
        addressLine2,
        pincode,
        state,
        profession,
      } = req.body;

      const existingUserResult = await userServices.getUserByEmailAsync(email);

      if (existingUserResult.success) {
        const userRolesResult = await rolesServices.getUserRolesByIdAsync(
          existingUserResult.data.user_id
        );

        if (!userRolesResult.success) {
          return res.status(400).json({ message: userRolesResult.message, success: false });
        }

        if (
          userRolesResult.data.includes(constants.ROLES.Volunteer) ||
          userRolesResult.data.includes(constants.ROLES.SkilledPerson) ||
          userRolesResult.data.includes(constants.ROLES.Admin)
        ) {
          return res.status(400).json({ message: "User already exists with this email address", success: false });
        }

        if (
          userRolesResult.data.length === 1 &&
          userRolesResult.data.includes(constants.ROLES.Donor)
        ) {
          let professionId;
          let existingProfessionResult =
            await professionServices.getProfessionByNameAsync(profession);
          if (existingProfessionResult.success)
            professionId = existingProfessionResult.data.profession_id;
          else {
            const addProfessionResult =
              await professionServices.addProfessionAsync(profession);
            professionId = addProfessionResult.data;
          }

          const addSkilledResult = await skilledPersonServices.addSkilledPersonAsync(userId, { professionId, skilledUserId: existingUserResult.data.user_id });
          if (!addSkilledResult.success) throw new Error(addSkilledResult.message);

          const sentVerifyMailResult = await mailServices.sendVerifyOtpMail(
            existingUserResult.data.user_id,
            email,
          );

          if (!sentVerifyMailResult.success)
            return res.status(500).json({ message: sentVerifyMailResult.message, success: false });

          console.log(sentVerifyMailResult.message);
          return res.status(200).json({
            message:
              "An email has been sent to your account. Please check your inbox and verify your account to proceed.",
            success: true,
          });
        }
      }

      // Village and profession handling
      let villageId;
      const existingVillResult = await villageServices.getVillageByNameAsync(village);
      if (existingVillResult.success) {
        villageId = existingVillResult.data.vill_id;
      } else {
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
        const addProfessionResult = await professionServices.addProfessionAsync(profession);
        if (addProfessionResult.success) {
          professionId = addProfessionResult.data;
        }
      }

      const createUserResult = await userServices.createUserAsync(userId, {
        fullName,
        email,
        password,
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
      });
      if (!createUserResult.success) {
        return res.status(500).json({ message: createUserResult.message, success: false });
      }

      const skilledUserId = createUserResult.data;

      const addSkilledResult = await skilledPersonServices.addSkilledPersonAsync(userId, { professionId, skilledUserId });
      if (!addSkilledResult.success) {
        throw new Error(addSkilledResult.message);
      }

      // Assign role to user
      const addUserToRoleResult = await rolesServices.addUserToRoleAsync(
        skilledUserId,
        constants.ROLES.SkilledPerson
      );
      if (!addUserToRoleResult.success) {
        return res.status(500).json({ message: addUserToRoleResult.message, success: false });
      }

      const sentVerifyMailResult = await mailServices.sendVerifyOtpMail(skilledUserId, email, requestId);
      if (!sentVerifyMailResult.success) {
        throw new Error(sentVerifyMailResult.message);
      }

      res.status(200).json({
        message: "An email has been sent to your account. Please check your inbox and verify your account to proceed.",
        success: true
      });

    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  },

  UpgradeToMember: async (req, res) => {
    try {
      const {
        email,
        password,
        profession,
        interest,
      } = req.body;

      const existingUserResult = await userServices.getUserByEmailAsync(email);
      const userId = existingUserResult.data.user_id;

      await userServices.resetPasswordAsync(userId, password);

      const addUserToRoleResult = await rolesServices.addUserToRoleAsync(userId, constants.ROLES.SkilledPerson);

      if (!addUserToRoleResult.success) {
        throw new Error(addUserToRoleResult.message);
      }

      // Retrieve or create profession
      let professionId;
      let existingProfessionResult = await professionServices.getProfessionByNameAsync(profession);
      if (existingProfessionResult.success) {
        professionId = existingProfessionResult.data.profession_id;
      } else {
        const addProfessionResult = await professionServices.addProfessionAsync(profession);
        if (addProfessionResult.success) {
          professionId = addProfessionResult.data.profession_id;
        }
      }

      // Retrieve or create interest
      let interestId;
      let existingInterestResult = await interestsServices.getInterestByNameAsync(interest);
      if (existingInterestResult.success) {
        interestId = existingInterestResult.data.interest_id;
      } else {
        const addInterestResult = await interestsServices.addInterestAsync(interest);
        if (addInterestResult.success) {
          interestId = addInterestResult.data.interest_id;
        }
      }

      const addMemberResult = await skilledPersonServices.addSkilledPersonAsync(
        userId,
        { professionId, interestId, skilledUserId: userId }
      );

      if (!addMemberResult.success) {
        throw new Error(addMemberResult.message);
      }

      const sentVerifyMailResult = await mailServices.sendVerifyOtpMail(
        existingUserResult.data.user_id,
        email
      );
      if (!sentVerifyMailResult.success)
        throw new Error(sentVerifyMailResult.message);

      res.status(200).json({
        message:
          "An email has been sent to your account. Please check your imbox and verify your account to proceed.",
        success: true,
      });

    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  getAllSkilledPersons: async (req, res) => {
    try {
      const { page, pageSize, search, selectedVillage, isActive = false } = req.query;
      const allSkilledPersonsResult = await skilledPersonServices.getAllSkilledPersonsAsync({ page, pageSize, search, selectedVillage, isActive });

      res.status(200).json(allSkilledPersonsResult);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  getSkilledPerson: async (req, res) => {
    try {
      const personId = req.params.id;
      const skilledPerson = await skilledPersonServices.getSkilledPersonAsync(
        personId
      );

      if (!skilledPerson) {
        return res.status(404).json({ error: "Skilled person not found" });
      }

      res.status(200).json(skilledPerson);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  updateSkilledPerson: async (req, res) => {
    try {
      const skilledId = req.params.id;
      const ecryptedUserId = req.headers["user-id"];
      const userId = ecryptedUserId ? commFunctions.decrypt(ecryptedUserId) : null;

      const { fullName, mobile, dob, gender, contactMode, village, addressLine1, addressLine2, pincode, state, about, profession, interests } = req.body;

      const getSkilledResult = await skilledPersonServices.getSkilledPersonAsync(skilledId);

      if (!getSkilledResult.success)
        throw new Error(getSkilledResult.message);

      const existingVillResult = await villageServices.getVillageByNameAsync(village);
      if (!existingVillResult.success)
        throw new Error(existingVillResult.message);
      let villageId = existingVillResult.data.vill_id;

      let existingProfessionResult = await professionServices.getProfessionByNameAsync(profession);
      if (!existingProfessionResult.success)
        throw new Error(existingProfessionResult.message)
      let professionId = existingProfessionResult.data.profession_id;
      let existingInterestResult = await interestsServices.getInterestByNameAsync(interests);

      if (!existingInterestResult.success)
        throw new Error(existingInterestResult.message)
      let interestId = existingInterestResult.data.interest_id;

      const updateUserResult = await userServices.updateUserAsync(userId, getSkilledResult.data.userId,
        { fullName, mobile, dob, gender, userProfile: commFunctions.extractUserProfile(getSkilledResult.data.userProfile), contactMode, village: villageId, addressLine1, addressLine2, pincode, state, about });

      if (!updateUserResult.success)
        throw new Error(updateUserResult.message);

      const updateSkilledResult = await skilledPersonServices.updateSkilledPersonAsync(userId, skilledId, { profession: professionId, interests: interestId });
      if (!updateSkilledResult.success)
        throw new Error(updateSkilledResult.message);

      res.status(200).json(updateSkilledResult);

    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  deleteSkilledPerson: async (req, res) => {
    try {
      const skilledId = req.params.id;
      const ecryptedUserId = req.headers["user-id"];
      const userId = ecryptedUserId ? commFunctions.decrypt(ecryptedUserId) : null;

      const getSkilledResult = await skilledPersonServices.getSkilledPersonAsync(skilledId);

      if (!getSkilledResult.success)
        throw new Error(getSkilledResult.message);
      const getRoleRes = await rolesServices.getUserRolesByIdAsync(getSkilledResult.data.userId);

      if (!getRoleRes.success)
        throw new Error(getRoleRes.message);
      const roles = getRoleRes.data;

      const delSkilledResult = await skilledPersonServices.deleteSkilledPersonAsync(userId, skilledId);
      if (!delSkilledResult.success)

        throw new Error(delSkilledResult.message);
      if (roles.length === 1 && roles.includes(constants.ROLES.SkilledPerson)) {
        await userServices.deleteUserAsync(userId, getSkilledResult.data.userId);
      }
      await rolesServices.deleteUserFromRoleAsync(getSkilledResult.data.userId, constants.ROLES.SkilledPerson);

      res.status(200).json({ message: "Deleted Successfully", success: true });

    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },
};