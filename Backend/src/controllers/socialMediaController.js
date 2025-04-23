const socialMediaModel = require("../model/socialMedia");
const commFunctions = require("../utils/common");

const mediaController = {

  // Get all donors
  getAllLinks: async (req, res) => {
    try {
      const data = await socialMediaModel.getAllLinks();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error getting all url:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getLinksByUserId: async (req, res) => {
    try {
      const userId = req.params.id;
      const decryptedUserId = commFunctions.decrypt(userId);
      const links = await socialMediaModel.getLinksByUserId(decryptedUserId);
      res.status(200).json( links );
    } catch (error) {
      console.error("Error getting links by user ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateLinksByUserId: async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedLinks = req.body;

      await socialMediaModel.updateLinksByUserId(userId, updatedLinks);

      res.status(200).json({ message: "Links updated successfully" });
    } catch (error) {
      console.error("Error updating links by user ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  AddOrUpdateUrl: async (req, res) => {
    try {
      const encryptedUserId = req.params.id;
      const userId = commFunctions.decrypt(encryptedUserId);
      const {
        google,
        facebook,
        twitter,
        youtube,
        linkedin,
        instagram
      } = req.body;
  
      // Check if user exists
      const existingUser = await socialMediaModel.getUserByUserId(userId);
  
      if (existingUser) {
        // User exists, update their links
        const updatedLinks = {
          google,
          facebook,
          twitter,
          youtube,
          linkedin,
          instagram,
          userId
        };
  
        await socialMediaModel.updateLinksByUserId(userId, updatedLinks);
  
        res.status(200).json({ message: "Links updated successfully" });
      } else {
        // User does not exist, add new links
        const newUrl = {
          google,
          facebook,
          twitter,
          youtube,
          linkedin,
          instagram,
          userId
        };
  
        await socialMediaModel.addLink(newUrl);
  
        res.status(200).json({ message: "Links added successfully" });
      }
    } catch (error) {
      console.error("Error adding or updating links:", error);
      res.status(500).json({ error: error.message });
    }
  }
  
};

module.exports = mediaController