const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "person_specializedskill";
const categoryTable = "specialized_category";
const personTable = "skilled_persons";

class PersonSpecializedCategoryServices {

    async addPersonSpecializedSkillAsync(data) {
        try {
            // Check if the combination of personId and categoryId already exists
            const existingSkill = await knex(tableName)
                .where({
                    personId: data.personId,
                    categoryId: data.categoryId,
                    isDeleted: false
                })
                .first();

            if (existingSkill) {
                throw new Error("Specialized skill already exists for this person");
            }

            // Prepare the new skill entry
            const newSkill = {
                personId: data.personId,
                categoryId: data.categoryId,
                description: data.description || null,
                isDeleted: false,
                isActive: true,
                addedOn: knex.fn.now()
            };

            // Insert the new record into the 'person_specializedskill' table
            const [id] = await knex(tableName).insert(newSkill);

            // Return success response
            return {
                message: "Specialized skill added successfully",
                statusCode: 201,
                success: true,
                data: id
            };
        } catch (error) {
            // Return error response
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getAllPersonSpecializedSkillsAsync({
        search,
        selectedSkill,
        page = 1,
        pageSize = 10,
        sortBy = 'ps.addedOn',
        sortOrder = 'asc'
    }) {
        try {
            const offset = (page - 1) * pageSize;
    
            // Create the base query
            let query = knex('person_specializedskill as ps')
                .select(
                    'ps.id as personSkillId',
                    'ps.description',
                    'ps.addedOn',
                    'ps.isActive',
                    'sc.category as categoryName',
                    'sp.person_id as personId',
                    'u.full_name as personName',
                    'u.email as personEmail'
                )
                .join('specialized_category as sc', 'ps.categoryId', 'sc.id')
                .join('skilled_persons as sp', 'ps.personId', 'sp.person_id')
                .join('users as u', 'sp.user_id', 'u.user_id')
                .where('ps.isDeleted', false);
    
            // Apply search filter
            if (search) {
                query = query.andWhere(function () {
                    this.where('ps.description', 'like', `%${search}%`)
                        .orWhere('u.full_name', 'like', `%${search}%`)
                        .orWhere('u.email', 'like', `%${search}%`);
                });
            }
    
            // Apply selected skill filter
            if (selectedSkill) {
                query = query.andWhere('sc.category', selectedSkill);
            }
    
            // Apply sorting
            query = query.orderBy(sortBy, sortOrder);
    
            // Apply pagination
            query = query.limit(pageSize).offset(offset);
    
            // Fetch the results
            const skills = await query;
    
            // Count total records for pagination
            const totalCountQuery = knex('person_specializedskill as ps')
                .join('specialized_category as sc', 'ps.categoryId', 'sc.id')
                .join('skilled_persons as sp', 'ps.personId', 'sp.person_id')
                .join('users as u', 'sp.user_id', 'u.user_id')
                .where('ps.isDeleted', false);
    
            // Apply the same filters to the count query
            if (search) {
                totalCountQuery.andWhere(function () {
                    this.where('ps.description', 'like', `%${search}%`)
                        .orWhere('u.full_name', 'like', `%${search}%`)
                        .orWhere('u.email', 'like', `%${search}%`);
                });
            }
    
            if (selectedSkill) {
                totalCountQuery.andWhere('sc.category', selectedSkill);
            }
    
            // Get the total count
            const totalCountResult = await totalCountQuery.count('* as count').first();
            const totalCount = totalCountResult.count;
    
            return {
                message: "Specialized skills fetched successfully",
                statusCode: 200,
                success: true,
                data: {
                    skills,
                    pagination: {
                        total: parseInt(totalCount, 10),
                        currentPage: page,
                        totalPages: Math.ceil(totalCount / pageSize)
                    }
                }
            };
        } catch (error) {
            console.error('Error in service:', error.message);
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getAllSkillsForPersonAsync(personId) {
        try {
            const skills = await knex(tableName + ' as ps')
                .select(
                    'ps.id as id',
                    'ps.description',
                    'ps.addedOn',
                    'ps.isActive',
                    'sc.category as categoryName'
                )
                .join(categoryTable + ' as sc', 'ps.categoryId', 'sc.id')
                .where({
                    'ps.personId': personId,
                    'ps.isDeleted': false
                })
                .orderBy('ps.addedOn', 'asc');

            return {
                message: "Skills for person fetched successfully",
                statusCode: 200,
                success: true,
                data: skills
            };
        } catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async deletePersonSpecializedSkillAsync(id) {
        try {
            await knex(tableName)
                .where("id", id)
                .update({
                    isDeleted: true,
                    isActive: false,
                    deletedOn: knex.fn.now()
                });

            // Return success response
            return {
                message: "Skill deleted successfully",
                statusCode: 200,
                success: true,
                data: null
            };
        } catch (error) {
            // Return error response
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getPersonSpecializedSkillByIdAsync(id) {
        try {
            // Fetch the specialized skill by id
            const skill = await knex(tableName + ' as ps')
                .select(
                    'ps.id as id',
                    'ps.description',
                    'ps.addedOn',
                    'ps.isActive',
                    'sc.category as categoryName',
                    'sp.person_id as personId',
                    'u.full_name as personName',
                    'u.email as personEmail'
                )
                .join(categoryTable + ' as sc', 'ps.categoryId', 'sc.id')
                .join(personTable + ' as sp', 'ps.personId', 'sp.person_id')
                .join('users as u', 'sp.user_id', 'u.user_id')
                .where({
                    'ps.id': id,
                    'ps.isDeleted': false
                })
                .first();

            // If no skill found, throw an error
            if (!skill) {
                throw new Error("Specialized skill not found");
            }

            return {
                message: "Specialized skill fetched successfully",
                statusCode: 200,
                success: true,
                data: skill
            };
        } catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async updateSkillByIdAsync(id, data) {
        try {
            // Check if the skill exists
            const existingSkill = await knex(tableName)
                .where({
                    id,
                    isDeleted: false
                })
                .first();

            if (!existingSkill) {
                throw new Error("Specialized skill not found");
            }

            // Prepare the update data
            const updatedSkill = {
                description: data.description || existingSkill.description,
                categoryId: data.categoryId || existingSkill.categoryId,
                updatedOn: knex.fn.now(),
            };

            // Update the skill in the 'person_specializedskill' table
            await knex(tableName)
                .where({ id })
                .update(updatedSkill);

            return {
                message: "Specialized skill updated successfully",
                statusCode: 200,
                success: true,
                data: id
            };
        } catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }



}

module.exports = new PersonSpecializedCategoryServices();