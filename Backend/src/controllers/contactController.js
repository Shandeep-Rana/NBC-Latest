const contactModel = require("../model/contactModel");

const contactController = {
  createContact: async (req, res) => {
    try {
      const { name, email, phone, subject, description } = req.body;

      const newcontact = {
        name,
        email,
        phone,
        subject,
        description,
      };

      const result = await contactModel.addContact(newcontact);

      res.status(200).json({ message: "Thank you for reaching out! We've received your message and will get back to you soon." });
    } catch (error) {
      console.error("Error contacting team:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get all donors
  getAllContactRequests: async (req, res) => {
    try {
      const { searchTerm, sortBy, sortOrder, page, pageSize } = req.query;

      const data = await contactModel.getAllContactRequest({
        searchTerm,
        sortBy,
        sortOrder,
        page,
        pageSize,
      });

      res.status(200).json(data);
    } catch (error) {
      console.error("Error getting all requests:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get donor by ID
  getContactById: async (req, res) => {
    try {
      const contactId = req.params.id;
      const contact = await contactModel.getContactById(contactId);

      if (!contact) {
        return res.status(404).json({ error: "contact not found" });
      }

      res.status(200).json(contact);
    } catch (error) {
      console.error("Error getting request by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Update donor by ID
  updateContactById: async (req, res) => {
    try {
      const contactId = req.params.id;
      const updatedRequestData = req.body;
      const updatedRequest = await contactModel.updateContactById(
        contactId,
        updatedRequestData
      );

      if (!updatedRequest) {
        return res.status(404).json({ error: "request not found" });
      }

      res.status(200).json({ message: "request updated successfully" });
    } catch (error) {
      console.error("Error updating request by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Delete donor by ID
  deleteContactById: async (req, res) => {
    try {
      const donorId = req.params.id;
      const deletedDonor = await contactModel.deleteContactById(donorId);

      if (!deletedDonor) {
        return res.status(404).json({ error: "request not found" });
      }

      res.status(200).json({ message: "request deleted successfully" });
    } catch (error) {
      console.error("Error deleting request by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = contactController;
