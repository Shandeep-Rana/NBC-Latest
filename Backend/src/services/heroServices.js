const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "nangal_heroes";
const auditServices = require('../services/auditServices');
const constants = require("../constants/index");
const URL = constants.IMAGE_URL;

class HeroServices {
    async addHeroAsync(data, userId) {
        try {
            const newHero = {
                name: data.name,
                photo_url: data.photo_url ? data.photo_url : null,
                recognition_title: data.recognition_title,
                recognition_description: data.recognition_description,
                recognition_date: data.recognition_date
            }

            const [hero_id] = await knex(tableName).insert(newHero);
            var insertedHero = await knex(tableName).where({ hero_id: hero_id }).first();

            await auditServices.afterInsertAsync(userId, tableName, hero_id, insertedHero);

            insertedHero.photo_url = insertedHero.photo_url
                ? `${URL}/heroes/${insertedHero.photo_url}`
                : null;

            const resultObject = {
                message: "Hero Added Successfully",
                statusCode: 201,
                success: true,
                data: { insertedHero }
            };
            return resultObject;
        } catch (err) {
            const resultObject = {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
            return resultObject;
        }
    }

    async getPaginatedHeroesAsync({ page = 1, pageSize = 10, search, sortBy = 'hero_id', sortOrder = 'desc' }) {
        try {
            const offset = (page - 1) * pageSize;

            let query = knex(tableName).select('*').where('is_deleted', false);
            let countQuery = knex(tableName).count('hero_id as count').where('is_deleted', false);

            if (search) {
                query = query.where('recognition_title', 'like', `%${search}%`)
                    .orWhere('name', 'like', `%${search}%`);
                countQuery = countQuery.where('recognition_title', 'like', `%${search}%`)
                    .orWhere('name', 'like', `%${search}%`);
            }

            query = query.orderBy(sortBy, sortOrder);
            query = query.limit(pageSize).offset(offset);

            var heroes = await query;
            const [{ count }] = await countQuery;
            const total = parseInt(count, 10);
            const hasMore = (page * pageSize) < total;

            heroes = heroes.map(hero => {
                hero.photo_url = hero.photo_url
                    ? `${URL}/heroes/${hero.photo_url}`
                    : null;
                return hero;
            });

            const resultObject = {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: {
                    heroes,
                    pagination: {
                        total: parseInt(count, 10),
                        currentPage: page,
                        totalPages: Math.ceil(count / pageSize),
                        hasMore
                    }
                }
            };

            return resultObject;
        } catch (err) {
            const resultObject = {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };

            return resultObject;
        }
    }

    async getHeroByIdAsync(id) {
        try {

            let hero = await knex(tableName).where('hero_id', id).first();

            if (hero) {
                hero.photo_url = hero.photo_url
                    ? `${URL}/heroes/${hero.photo_url}`
                    : null;

                return {
                    message: "Fetched Successfully",
                    statusCode: 200,
                    success: true,
                    data: hero
                };
            }
            throw new Error('Fetch Failed');

        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async updateHeroAsync(data, userId) {
        try {

            const heroBeforeUpdate = (await this.getHeroByIdAsync(data.hero_id)).data;

            await knex(tableName)
                .where('hero_id', data.hero_id)
                .update({
                    name: data.name,
                    photo_url: data.photo_url,
                    recognition_title: data.recognition_title,
                    recognition_description: data.recognition_description,
                    recognition_date: data.recognition_date
                });

            const heroAfterUpdate = (await this.getHeroByIdAsync(data.hero_id)).data;

            await auditServices.afterUpdateAsync(userId, tableName, data.hero_id, heroBeforeUpdate, heroAfterUpdate);

            return {
                message: "Hero updated Successfully",
                statusCode: 200,
                success: true,
                data: null
            };
        }
        catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }
    async deleteHeroAsync(heroId, userId) {
        try {
            await knex(tableName)
                .where('hero_id', heroId)
                .update({
                    is_deleted: true,
                    deleted_on: new Date()
                });

            await auditServices.afterDeleteAsync(userId, tableName, heroId);

            const resultObject = {
                message: "Deleted Successfully",
                statusCode: 200,
                success: true,
                data: null
            };
            return resultObject;
        }
        catch (err) {
            const resultObject = {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
            return resultObject;
        }
    }
}
module.exports = new HeroServices();