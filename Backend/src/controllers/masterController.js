const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const intrestModel = require("../model/intrestsModel");
const villageModel = require("../model/villageModel");
const professionModel = require("../model/professionModel");
const volunteerModel = require("../model/volunteerModel");
const donorModel = require("../model/donorModel");
const userModel = require("../model/userModel")
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const otpModel = require("../model/passwordOtpModel");
const constants = require('../constants/index');
const commonFunc = require("../utils/common");
const transporter = require("../../middelware/emailTranspoter");
const auditServices = require('../services/auditServices');
const masterServices = require('../services/masterServices');
const professionServices = require("../services/professionServices");
const villageServices = require("../services/villageServices");
const interestsServices = require("../services/interestsServices");
const MasterController = {

  AddBothUser: async (req, res) => {
    try {

      const userProfile = req.file ? req.file.filename : null;

      const {
        fullName,
        email,
        contact,
        blood_type,
        gender,
        dob,
        village,
        medicalhistory,
        contactMode,
        pincode,
        address_line1,
        state,
        profession,
        comment,
        password,
      } = req.body;

      const existingDonor = await donorModel.getdonorByEmail(email);
      const existingVolunteer = await volunteerModel.getVolunteerByEmail(email);

      if (existingDonor && existingVolunteer) {
        return res.status(400).json({ error: "Email already registered as both donor and volunteer" });
      } else if (existingDonor) {
        return res.status(400).json({ error: "Email already registered as a donor" });
      } else if (existingVolunteer) {
        return res.status(400).json({ error: "Email already registered as a volunteer" });
      }

      let villageId;
      let existingVillage = await villageModel.getVillageByName(village);

      if (!existingVillage) {
        villageId = await villageModel.addVillage({ villageName: village });
      } else {
        villageId = existingVillage.Id;
      }

      let Id;
      let existingProfession = await professionModel.getProfessionByName(
        profession
      );

      if (!existingProfession) {
        Id = await professionModel.addProfession({
          professionName: profession,
        });
      } else {
        Id = existingProfession.Id;
      }

      const newUser = {
        fullName,
        email,
        password,
        userProfile,
        isdeleted: false,
        isactivated: false,
        deletedOn: null,
        activatedOn: new Date(),
      };

      const userId = await userModel.addUser(newUser);

      const newVolunteer = {
        fullName,
        email,
        contact,
        profession,
        dob: new Date(dob),
        village,
        comment,
        gender,
        contactMode,
        pincode,
        address_line1,
        state,
        userId,
        isdeleted: false,
        isactivated: true,
        deletedOn: null,
        activatedOn: new Date(),
      };

      await volunteerModel.addVolunteer(newVolunteer);

      const newDonor = {
        fullName,
        email,
        gender,
        contact,
        donorProfile: userProfile,
        blood_type,
        medicalhistory,
        dob: new Date(dob),
        village,
        contactMode,
        pincode,
        address_line1,
        state,
        isdeleted: false,
        isactivated: true,
        deletedOn: null,
        activatedOn: new Date(),
      };

      await donorModel.addDonor(newDonor);

      const donorRoleId = await knex("roles")
        .where({ RoleName: "donor" })
        .select("RoleId")
        .first();

      const volunteerRoleId = await knex("roles")
        .where({ RoleName: "volunteer" })
        .select("RoleId")
        .first();

      await knex("userRole").insert([
        { userId, roleId: donorRoleId.RoleId },
        { userId, roleId: volunteerRoleId.RoleId },
      ]);

      const otpCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
      const otpExpiryDate = new Date(Date.now() + 15 * 60 * 1000);
      await otpModel.createPasswordOtp({
        userId, otp: otpCode, otpExpiryDate, isOtpUsed: false, isdeleted: false, isactivated: true, ActivatedAt: new Date()
      });

      const encryptedUserId = commonFunc.encrypt(userId);
      const verifyLink = `${constants.WEBAPP_PATH}/auth/verify-account/${encryptedUserId}`;

      const templatePath = path.join(constants.HTML_PATH, 'verify-otp.html');
      const data = await fs.promises.readFile(templatePath, 'utf8');
      const htmlContent = ejs.render(data, { otpCode, verifyLink });
      
      const mailOptions = {
        from: { name: "Nangal By Cycle", address: "info@nangalbycycle.com" },
        to: email,
        subject: 'Account Verification',
        html: htmlContent,
      };
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "OTP sent Successfully, Please check your imbox and verify your account to proceed." });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //adding village to database
  AddVillage: async (req, res) => {
    try {
      const { villageName } = req.body;

      const existingVillage = await villageModel.getVillageByName(villageName);

      if (existingVillage) {
        return res.status(400).json({ error: "Village already exists" });
      }

      const newUser = {
        villageName,
      };

      const result = await villageModel.addVillage(newUser);

      res.status(200).json({ message: "village added successfully", result });
    } catch (error) {
      console.error("Error adding village:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //adding profession to database
  AddProfession: async (req, res) => {
    try {
      const { professionName } = req.body;

      const existingProfession = await professionModel.getProfessionByName(professionName);

      if (existingProfession) {
        return res.status(400).json({ error: "profession already exists" });
      }

      const newUser = {
        professionName,
      };

      const result = await professionModel.addProfession(newUser);

      res.status(200).json({ message: "profession added successfully", result });
    } catch (error) {
      console.error("Error adding profession:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //adding intrest to database
  AddIntrest: async (req, res) => {
    try {
      const { name } = req.body;

      const existingName = await intrestModel.getAllIntrests(name);

      if (existingName) {
        return res.status(400).json({ error: "option already exists" });
      }

      const newUser = {
        name,
      };

      const result = await intrestModel.addIntrest(newUser);

      res.status(200).json({ message: "option added successfully", result });
    } catch (error) {
      console.error("Error adding option:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get all vilage list
  getAllVillages: async (req, res) => {
    try {
      const allVillagesResult = await villageServices.getAllVillagesAsync();
      res.status(200).json(allVillagesResult);

    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  getAllIntrests: async (req, res) => {
    try {
      const allInterestsResult = await interestsServices.getAllInterestsAsync();
      res.status(200).json(allInterestsResult);

    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  getAllProfession: async (req, res) => {
    try {

      const professionResult = await professionServices.getAllProfessionsAsync();
      res.status(200).json(professionResult);

    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  },

  getAllAuditLogs: async (req, res) => {
    try {
      const { page, pageSize, search, userId } = req.query;

      const decryptedUserId = commonFunc.decrypt(userId);
      const result = await auditServices.getAllAuditLogsAsync({ page, pageSize, search, userId: decryptedUserId });

      res.status(200).json(result);
    } catch (error) {
      const resultObject = {
        message: error.message,
        statusCode: 400,
        success: false,
        data: null
      };
      res.status(500).json(resultObject);
    }
  },

  getCommunityStats: async (req, res) => {
    try {
      const result = await masterServices.getCommunityStatsAsync();
      res.status(200).json(result);
    } catch (error) {
      const resultObject = {
        message: error.message,
        statusCode: 400,
        success: false,
        data: null
      };
      res.status(500).json(resultObject);
    }
  }
};


module.exports = MasterController;
