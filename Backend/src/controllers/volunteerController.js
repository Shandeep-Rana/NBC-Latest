const constants = require("../constants/index");
const userServices = require("../services/userServices");
const roleServices = require("../services/rolesServices");
const volunteerServices = require("../services/volunteerServices");
const villageServices = require("../services/villageServices");
const professionServices = require("../services/professionServices");
const mailServices = require("../services/mailServices");
const commFunctions = require("../utils/common");
const interestsServices = require("../services/interestsServices");
// const mobileOtpServices = require("../services/mobileOtpServices");

module.exports = {
  addVolunteer: async (req, res) => {
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
  
      // If the user already exists, handle it and return early
      if (existingUserResult.success) {
        const userRolesResult = await roleServices.getUserRolesByIdAsync(
          existingUserResult.data.id
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
  
          const addVolunteerResult = await volunteerServices.addVolunteerAsync(
            userId,
            { professionId, volUserId: existingUserResult.data.id}
          );
          if (!addVolunteerResult.success)
            return res.status(500).json({ message: addVolunteerResult.message, success: false });
  
          const sentVerifyMailResult = await mailServices.sendVerifyOtpMail(
            existingUserResult.data.id,
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
  
      // Create new user
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
  
      const volUserId = createUserResult.data;
  
      // Add volunteer
      const addVolunteerResult = await volunteerServices.addVolunteerAsync(
        userId,
        { professionId, volUserId }
      );
      if (!addVolunteerResult.success) {
        return res.status(500).json({ message: addVolunteerResult.message, success: false });
      }
  
      // Assign role to user
      const addUserToRoleResult = await roleServices.addUserToRoleAsync(
        volUserId,
        constants.ROLES.Volunteer
      );
      if (!addUserToRoleResult.success) {
        return res.status(500).json({ message: addUserToRoleResult.message, success: false });
      }
  
      // Send OTP for email verification
      let id = "null"
      const sentVerifyMailResult = await mailServices.sendVerifyOtpMail(
        volUserId,
        email,
        id
      );
      if (!sentVerifyMailResult.success) {
        return res.status(500).json({ message: sentVerifyMailResult.message, success: false });
      }
  
      // Return success response
      return res.status(200).json({
        message: "An OTP has been sent to your email.",
        success: true,
      });
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({ message: error.message, success: false });
      }
    }
  },

  UpgradeToVolunteer: async (req, res) => {
    try {
      const {
        email,
        password,
        profession,
        interest,
      } = req.body;

      const existingUserResult = await userServices.getUserByEmailAsync(email);
      const userId = existingUserResult.data.id;

      await userServices.resetPasswordAsync(userId, password);

      const addUserToRoleResult = await roleServices.addUserToRoleAsync(userId, constants.ROLES.Volunteer);

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

      const addVolunteerResult = await volunteerServices.addVolunteerAsync(
        userId,
        { professionId, interestId, volUserId: userId }
      );

      if (!addVolunteerResult.success) {
        throw new Error(addVolunteerResult.message);
      }

      const sentVerifyMailResult = await mailServices.sendVerifyOtpMail(
        existingUserResult.data.id,
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


  getAllVolunteers: async (req, res) => {
    try {
      const {
        page,
        pageSize,
        search = null,
        selectedVillage = null,
        isActive = false,
      } = req.query;
      const allVolResult = await volunteerServices.getAllVolunteersAsync({
        page,
        pageSize,
        search,
        selectedVillage,
        isActive,
      });
      res.status(200).json(allVolResult);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  getVolunteer: async (req, res) => {
    try {
      const volId = req.params.id;
      const volResult = await volunteerServices.getVolunteerAsync(volId);

      res.status(200).json(volResult);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  updateVolunteer: async (req, res) => {
    try {
      const volId = req.params.id;
      const ecryptedUserId = req.headers["user-id"];
      const userId = ecryptedUserId
        ? commFunctions.decrypt(ecryptedUserId)
        : null;

      const {
        fullName,
        mobile,
        dob,
        gender,
        contactMode,
        village,
        addressLine1,
        addressLine2,
        pincode,
        state,
        about,
        profession,
        interests,
      } = req.body;

      const getVolResult = await volunteerServices.getVolunteerAsync(volId);
      if (!getVolResult.success) throw new Error(getVolResult.message);

      const existingVillResult = await villageServices.getVillageByNameAsync(
        village
      );
      if (!existingVillResult.success)
        throw new Error(existingVillResult.message);
      let villageId = existingVillResult.data.vill_id;

      let existingProfessionResult =
        await professionServices.getProfessionByNameAsync(profession);
      if (!existingProfessionResult.success)    
        throw new Error(existingProfessionResult.message);
      let professionId = existingProfessionResult.data.profession_id;
      let existingInterestResult =
        await interestsServices.getInterestByNameAsync(interests);

      if (!existingInterestResult.success)
        throw new Error(existingInterestResult.message);
      let interestId = existingInterestResult.data.interest_id;
      const updateUserResult = await userServices.updateUserAsync(
        userId,
        getVolResult.data.userId,
        {
          fullName,
          mobile,
          dob,
          gender,
          userProfile: commFunctions.extractUserProfile(
            getVolResult.data.userProfile
          ),
          contactMode,
          village: villageId,
          addressLine1,
          addressLine2,
          pincode,
          state,
          about,
        }
      );

      if (!updateUserResult.success) throw new Error(updateUserResult.message);

      const updateVolResult = await volunteerServices.updateVolunteerAsync(
        userId,
        volId,
        { profession: professionId, interests: interestId }
      );
      if (!updateVolResult.success) throw new Error(updateVolResult.message);

      res.status(200).json(updateVolResult);
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  deleteVolunteer: async (req, res) => {
    try {
      const volId = req.params.id;
      const ecryptedUserId = req.headers["user-id"];
      const userId = ecryptedUserId
        ? commFunctions.decrypt(ecryptedUserId)
        : null;

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
