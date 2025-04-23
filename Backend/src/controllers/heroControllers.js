const heroServices = require("../services/heroServices");
const mailServices = require("../services/mailServices");
const commFunctions = require("../utils/common");

const HeroController = {
    addHero: async (req, res) => {
        try {
            const photo_url = req.file
                ? req.file.filename
                : null;

            const ecryptedUserId = req.headers["user-id"];
            const userId = ecryptedUserId ? commFunctions.decrypt(ecryptedUserId) : null;
            const { name, recognition_title, recognition_description, recognition_date } = req.body;

            const sanitizedRecognitionDate = recognition_date || null;

            var heroResult = await heroServices.addHeroAsync({
                name,
                photo_url,
                recognition_title,
                recognition_description,
                recognition_date: sanitizedRecognitionDate,
            }, userId);

            if (heroResult) {
                await mailServices.sendHeroCreatedMail(heroResult)
            }

            res.status(200).json(heroResult);


        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getPaginatedHeroes: async (req, res) => {
        try {
            const { page, pageSize, search } = req.query;
            const result = await heroServices.getPaginatedHeroesAsync({
                page,
                pageSize,
                search
            });

            res.status(200).json(result);
        } catch (error) {
            const resultObject = {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null,
            };
            res.status(500).json(resultObject);
        }
    },

    getHero: async (req, res) => {
        try {
            const heroId = req.params.id;
            const result = await heroServices.getHeroByIdAsync(heroId);

            res.status(200).json(result);
        } catch (error) {
            const resultObject = {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null,
            };
            res.status(500).json(resultObject);
        }
    },

    updateHero: async (req, res) => {
        try {
            const heroId = req.params.id;
            const ecryptedUserId = req.headers["user-id"];
            const userId = ecryptedUserId ? commFunctions.decrypt(ecryptedUserId) : null;

            const photo_url = req?.file
                ? req.file.filename
                : null;

            const { name, recognition_title, recognition_description, recognition_date } = req.body;

            const sanitizedRecognitionDate = recognition_date && recognition_date !== 'Invalid date' ? recognition_date : null;

            const result = await heroServices.updateHeroAsync({
                hero_id: heroId,
                name,
                photo_url,
                recognition_title,
                recognition_description,
                recognition_date: sanitizedRecognitionDate
            }, userId);

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteHero: async (req, res) => {
        try {
            const heroId = req.params.id;
            const ecryptedUserId = req.headers["user-id"];
            const userId = ecryptedUserId ? commFunctions.decrypt(ecryptedUserId) : null;

            const result = await heroServices.deleteHeroAsync(heroId, userId);

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = HeroController;