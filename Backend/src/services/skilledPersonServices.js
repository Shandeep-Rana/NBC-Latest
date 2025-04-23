const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "skilled_persons";
const auditServices = require('../services/auditServices');
const constants = require("../constants/index");
const URL = constants.IMAGE_URL;

class SkilledPersonServices {
    async addSkilledPersonAsync(userId, data) {
        try {
            const newRecord = {
                profession: data.professionId,
                user_id: data.skilledUserId
            }

            const [person_id] = await knex(tableName).insert(newRecord);
            var insertedRecord = await knex(tableName).where({ person_id: person_id }).first();

            await auditServices.afterInsertAsync(userId, tableName, person_id, insertedRecord);
            return {
                message: "Added Successfully",
                statusCode: 201,
                success: true,
                data: person_id
            };
        }
        catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getAllSkilledPersonsAsync({ page = 1, pageSize = 10, search, selectedVillage, isActive = null, sortBy = 'person_id', sortOrder = 'desc' }) {
        try {
            const offset = (page - 1) * pageSize;
            let query = knex(tableName)
                .select(
                    'users.full_name as name',
                    'users.email as email',
                    'users.mobile as mobile',
                    'users.dob as dob',
                    'users.gender as gender',
                    'users.user_profile as userProfile',
                    'users.contact_mode as contactMode',
                    'villages.village_name as village',
                    'users.address_line1 as addressLine1',
                    'users.address_line2 as addressLine2',
                    'users.pincode as pincode',
                    'users.state as state',
                    'users.about as about',
                    'skilled_persons.person_id as skilledPersonId',
                    'professions.profession_name as profession',
                    'interests.interest as interests',
                )
                .leftJoin('users', 'skilled_persons.user_id', 'users.user_id')
                .leftJoin('villages', 'users.village', 'villages.vill_id')
                .leftJoin('professions', 'skilled_persons.profession', 'professions.profession_id')
                .leftJoin('interests', 'skilled_persons.interests', 'interests.interest_id')
                .where('users.is_deleted', false).andWhere('skilled_persons.is_deleted', false);

            let countQuery = knex(tableName)
                .count('person_id as count')
                .leftJoin('users', 'skilled_persons.user_id', 'users.user_id')
                .where('skilled_persons.is_deleted', false);

            if (search) {
                query = query.andWhere(builder => {
                    builder.where('users.full_name', 'like', `%${search}%`)
                        .orWhere('users.email', 'like', `%${search}%`);
                });
                countQuery = countQuery.andWhere(builder => {
                    builder.where('users.full_name', 'like', `%${search}%`)
                        .orWhere('users.email', 'like', `%${search}%`);
                });
            }

            if (selectedVillage) {
                query = query.andWhere('users.village', selectedVillage);
                countQuery = countQuery.andWhere('users.village', selectedVillage);
            }

            if (isActive) {
                query = query.andWhere('users.is_active', true);
                countQuery = countQuery.andWhere('users.is_active', true);
            }

            query = query.orderBy(sortBy, sortOrder);
            query = query.limit(pageSize).offset(offset);

            let skilledPersons = await query;
            const [{ count }] = await countQuery;

            const processedSkilledPersons = skilledPersons.map(person => {
                person.userProfile = person.userProfile
                    ? `${URL}/userProfile/${person.userProfile}`
                    : null;

                return person;
            });

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: {
                    skilledPersons: processedSkilledPersons,
                    pagination: {
                        total: parseInt(count, 10),
                        currentPage: page,
                        totalPages: Math.ceil(count / pageSize)
                    }
                }
            };
        }
        catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getSkilledPersonAsync(personId) {
        try {
            let skilledPerson = await knex(tableName)
                .select(
                    'skilled_persons.person_id as skilledPersonId',
                    'professions.profession_name as profession',
                    'interests.interest as interests',
                    'skilled_persons.user_id as userId',
                    'users.full_name as name',
                    'users.email as email',
                    'users.mobile as mobile',
                    'users.dob as dob',
                    'users.gender as gender',
                    'users.user_profile as userProfile',
                    'users.contact_mode as contactMode',
                    'villages.village_name as village',
                    'users.address_line1 as addressLine1',
                    'users.address_line2 as addressLine2',
                    'users.pincode as pincode',
                    'users.state as state',
                    'users.about as about',
                )
                .leftJoin('users', 'skilled_persons.user_id', 'users.user_id')
                .leftJoin('villages', 'users.village', 'villages.vill_id')
                .leftJoin('professions', 'skilled_persons.profession', 'professions.profession_id')
                .leftJoin('interests', 'skilled_persons.interests', 'interests.interest_id')
                .where('users.is_deleted', false).andWhere('skilled_persons.is_deleted', false).andWhere('skilled_persons.person_id', personId)
                .first();

            if (!skilledPerson)
                throw new Error("User not found");

            skilledPerson.userProfile = skilledPerson.userProfile
                ? `${URL}/userProfile/${skilledPerson.userProfile}`
                : null;

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: skilledPerson,
            };

        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null,
            };
        }
    }

    async updateSkilledPersonAsync(userId, personId, data) {
        try {
            const skilledBeforeUpdate = await knex(tableName).where({ person_id: personId }).first();

            await knex(tableName)
                .where('person_id', personId)
                .update({
                    profession: data.profession,
                    interests: data.interests,
                });

            const skilledAfterUpdate = await knex(tableName).where({ person_id: personId }).first();

            await auditServices.afterUpdateAsync(userId, tableName, personId, skilledBeforeUpdate, skilledAfterUpdate);

            return {
                message: "Updated Successfully",
                statusCode: 200,
                success: true,
            };

        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false
            };
        }
    }

    async updateSkilledPersonByUserIdAsync(userId, data) {
        try {
            await knex(tableName)
                .where('user_id', userId)
                .update({
                    profession: data.profession,
                    interests: data.interests,
                });

            return {
                message: "Updated Successfully",
                statusCode: 200,
                success: true,
            };

        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false
            };
        }
    }

    async deleteSkilledPersonAsync(userId, personId) {
        try {
            await knex(tableName)
                .where('person_id', personId)
                .update({
                    is_deleted: true,
                    deleted_on: new Date(),
                });

            await auditServices.afterDeleteAsync(userId, tableName, personId);

            return {
                message: "Deleted Successfully",
                statusCode: 200,
                success: true,
            };

        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false
            };
        }
    }
    async getSkilledPersonByUserIdAsync(userId) {
        try {
            const skilledPerson = await knex(tableName)
                .select(
                    'skilled_persons.person_id as skilledPersonId',
                    'professions.profession_name as profession',
                    'interests.interest as interests',
                    'skilled_persons.user_id as userId',
                    'users.full_name as name',
                    'users.email as email',
                    'users.mobile as mobile',
                    'users.dob as dob',
                    'users.gender as gender',
                    'users.user_profile as userProfile',
                    'users.contact_mode as contactMode',
                    'villages.village_name as village',
                    'users.address_line1 as addressLine1',
                    'users.address_line2 as addressLine2',
                    'users.pincode as pincode',
                    'users.state as state',
                    'users.about as about'
                )
                .leftJoin('users', 'skilled_persons.user_id', 'users.user_id')
                .leftJoin('villages', 'users.village', 'villages.vill_id')
                .leftJoin('professions', 'skilled_persons.profession', 'professions.profession_id')
                .leftJoin('interests', 'skilled_persons.interests', 'interests.interest_id')
                .where('users.is_deleted', false)
                .andWhere('skilled_persons.is_deleted', false)
                .andWhere('skilled_persons.user_id', userId)
                .first();
    
            if (skilledPerson) {
                skilledPerson.userProfile = skilledPerson.userProfile
                    ? `${URL}/userProfile/${skilledPerson.userProfile}`
                    : null;
    
                return {
                    message: "Fetched Successfully",
                    statusCode: 200,
                    success: true,
                    data: skilledPerson,
                };
            } else {
                return {
                    message: "Skilled Person not found",
                    statusCode: 404,
                    success: false,
                    data: null,
                };
            }
        } catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false,
                data: null,
            };
        }
    }
}

module.exports = new SkilledPersonServices();