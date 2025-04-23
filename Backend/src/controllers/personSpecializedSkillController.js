const personSpecializedCategoryServices = require('../services/personSpecializedCategoryServices');
const specializedCategoryServices = require('../services/specializedCategoryServices');
const userServices = require('../services/userServices');
const commFunctions = require("../utils/common");

const PersonSpecializedSkillController = {
    addPersonSpecializedSkill: async (req, res) => {
        try {
            const { category, description, userId } = req.body;

            const id = userId
                ? commFunctions.decrypt(userId)
                : null;

            const person = await userServices.getUserByIdAsync(id)
            const personId = person.data.personId;

            let CategoryId;
            const existingCategoryResult = await specializedCategoryServices.getCategoryByNameAsync(
                category
            );
            if (existingCategoryResult.success) {
                CategoryId = existingCategoryResult.data.id;
            }
            else {
                const addCategoryResult = await specializedCategoryServices.addSpecializedCategoryAsync(category);
                if (addCategoryResult.success) {
                    CategoryId = addCategoryResult.data;
                }
            }

            const newPersonCategorySkill = {
                categoryId: CategoryId, description, personId
            };

            const personaSkillResult = await personSpecializedCategoryServices.addPersonSpecializedSkillAsync(newPersonCategorySkill);

            res.status(personaSkillResult.statusCode).json(personaSkillResult);

        } catch (error) {
            res.status(500).json({ message: error.message, success: false });
        }
    },

    getAllPersonhavingSpecializedSkill: async (req, res) => {
        try {
            const {
                search,
                selectedSkill,
                page,
                pageSize,
            } = req.query;
    
            const result = await personSpecializedCategoryServices.getAllPersonSpecializedSkillsAsync({
                search,
                selectedSkill,
                page,
                pageSize
            });
            res.status(200).json(result);
        } catch (error) {
          res.status(500).json({ message: error.message, success: false });
        }
      },

    getSkillsForPerson: async (req, res) => {
        try {
            const { userId } = req.body;

            const id = userId
                ? commFunctions.decrypt(userId)
                : null;

            const person = await userServices.getUserByIdAsync(id);
            const personId = person.data.personId;

            const skillsResult = await personSpecializedCategoryServices.getAllSkillsForPersonAsync(personId);

            res.status(skillsResult.statusCode).json(skillsResult);

        } catch (error) {
            res.status(500).json({ message: error.message, success: false });
        }
    },

    getPersonSpecializedSkillById: async (req, res) => {
        try {
            const { id } = req.params;

            const skillResult = await personSpecializedCategoryServices.getPersonSpecializedSkillByIdAsync(id);

            res.status(skillResult.statusCode).json(skillResult);
        } catch (error) {
            res.status(500).json({ message: error.message, success: false });
        }
    },

    deletePersonSpecializedSkill: async (req, res) => {
        try {
            const { userId } = req.body;

            const deleteResult = await personSpecializedCategoryServices.deletePersonSpecializedSkillAsync(userId);

            res.status(deleteResult.statusCode).json(deleteResult);

        } catch (error) {
            res.status(500).json({ message: error.message, success: false });
        }
    },

    updatePersonSpecializedSkillbyId: async (req, res) => {
        try {
            const { id } = req.params;
            const { category, description } = req.body;

            let CategoryId;
            const existingCategoryResult = await specializedCategoryServices.getCategoryByNameAsync(category);
            if (existingCategoryResult.success) {
                CategoryId = existingCategoryResult.data.id;
            } else {
                const addCategoryResult = await specializedCategoryServices.addSpecializedCategoryAsync(category);
                if (addCategoryResult.success) {
                    CategoryId = addCategoryResult.data;
                }
            }

            const updatedSkill = { categoryId: CategoryId, description };

            const updateResult = await personSpecializedCategoryServices.updateSkillByIdAsync(id, updatedSkill);

            res.status(updateResult.statusCode).json(updateResult);
        } catch (error) {
            res.status(500).json({ message: error.message, success: false });
        }
    }
};

module.exports = PersonSpecializedSkillController;