const faqModel = require("../model/faqModel");
const commFunctions = require('../utils/common');

const FaqController = {
  createFaq: async (req, res) => {
    try {
      const { question, answer, createdBy } = req.body;

      const decryptedUserId = commFunctions.decrypt(createdBy);
      if (!question) {
        return res.status(400).json({ error: "Mandatory fields are empty" });
      }

      const newFaq = {
        question,
        answer,
        createdBy: decryptedUserId,
        isApproved: false,
        isdeleted: false,
        isUpdated: false,
      };

      const result = await faqModel.addFaq(newFaq);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error Faqing team:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get all Faqs
  getAllFaqs: async (req, res) => {
    try {
      const { searchTerm, sortBy, sortOrder, page, pageSize } = req.query;

      const data = await faqModel.getAllFaqRequest({
        searchTerm,
        sortBy,
        sortOrder,
        page,
        pageSize,
      });

      res.status(200).json(data);
    } catch (error) {
      console.error("Error getting all Faqs:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllApprovedFaqs: async (req, res) => {
    try {
      const data = await faqModel.getAllApprovedFaqs();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error getting all Faqs:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get Faq by ID
  getFaqById: async (req, res) => {
    try {
      const FaqId = req.params.id;
      const Faq = await faqModel.getFaqById(FaqId);

      if (!Faq) {
        return res.status(404).json({ error: "Faq not found" });
      }

      res.status(200).json(Faq);
    } catch (error) {
      console.error("Error getting Faq by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Update Faq by ID
  updateFaqById: async (req, res) => {
    try {
      const faqId = req.params.id;
      const updatedFaqData = req.body;
      const result = await faqModel.updateFaqById(
        faqId,
        updatedFaqData
      );

      if (!result.success) {
        return res.status(404).json({ error: "Faq not found" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error updating Faq by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Delete faq by ID
  deleteFaqById: async (req, res) => {
    try {
      const faqId = req.params.id;
      const deletedFaq = await faqModel.deleteFaqById(faqId);

      if (!deletedFaq) {
        return res.status(404).json({ error: "Faq not found" });
      }

      res.status(200).json({ message: "Faq deleted successfully" });
    } catch (error) {
      console.error("Error deleting Faq by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = FaqController;
