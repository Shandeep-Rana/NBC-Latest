const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "donors";
const auditServices = require('../services/auditServices');
const constants = require("../constants/index");
const URL = constants.IMAGE_URL;

class DonorServices {
    async addDonorAsync(userId, data) {
        try {
            const newDonor = {
                blood_type: data.bloodType,
                medical_history: data.medicalHistory,
                user_id: data.donorUserId
            }

            const [donor_id] = await knex(tableName).insert(newDonor);
            var insertedDonor = await knex(tableName).where({ donor_id: donor_id }).first();

            await auditServices.afterInsertAsync(userId, tableName, donor_id, insertedDonor);
            return {
                message: "Donor Added Successfully",
                statusCode: 201,
                success: true,
                data: donor_id
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

    async getAllDonorsAsync({ page = 1, pageSize = 10, search, selectedBloodGroup, sortBy = 'donor_id', sortOrder = 'desc' }) {
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
                    'donors.blood_type as bloodType',
                    'donors.medical_history as medicalHistory',
                    'donors.donor_id as donorId',
                )
                .leftJoin('users', 'donors.user_id', 'users.user_id')
                .leftJoin('villages', 'users.village', 'villages.vill_id')
                .where('users.is_deleted', false).andWhere('donors.is_deleted', false);

            let countQuery = knex(tableName)
                .count('donor_id as count')
                .leftJoin('users', 'donors.user_id', 'users.user_id')
                .leftJoin('villages', 'users.village', 'villages.vill_id')
                .where('users.is_deleted', false)
                .andWhere('donors.is_deleted', false);

            if (search) {
                query = query.andWhere(builder => {
                    builder.where('users.address_line1', 'like', `%${search}%`)
                        .orWhere('users.address_line2', 'like', `%${search}%`)
                        .orWhere('users.full_name', 'like', `%${search}%`)
                        .orWhere('users.mobile', 'like', `%${search}%`)
                        .orWhere('villages.village_name', 'like', `%${search}%`);
                });

                countQuery = countQuery.andWhere(builder => {
                    builder.where('users.address_line1', 'like', `%${search}%`)
                        .orWhere('users.address_line2', 'like', `%${search}%`)
                        .orWhere('villages.village_name', 'like', `%${search}%`);
                });
            }

            if (selectedBloodGroup) {
                query = query.andWhere('donors.blood_type', selectedBloodGroup);
                countQuery = countQuery.andWhere('donors.blood_type', selectedBloodGroup);
            }

            query = query.orderBy(sortBy, sortOrder);
            query = query.limit(pageSize).offset(offset);

            let donors = await query;
            const [{ count }] = await countQuery;

            const processedDonors = donors.map(donor => {
                donor.userProfile = donor.userProfile
                    ? `${URL}/userProfile/${donor.userProfile}`
                    : null;

                return donor;
            });

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: {
                    donors: processedDonors,
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

    async getDonorAsync(donorId) {
        try {
            let donor = await knex(tableName)
                .select(
                    'donors.donor_id as donorId',
                    'donors.blood_type as bloodType',
                    'donors.medical_history as medicalHistory',
                    'donors.user_id as userId',
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
                .leftJoin('users', 'donors.user_id', 'users.user_id')
                .leftJoin('villages', 'users.village', 'villages.vill_id')
                .where('users.is_deleted', false).andWhere('donors.is_deleted', false).andWhere('donors.donor_id', donorId)
                .first();

            if (!donor)
                throw new Error("Donor not found");

            donor.userProfile = donor.userProfile
                ? `${URL}/userProfile/${donor.userProfile}`
                : null;

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: donor,
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

    async updateDonorAsync(userId, donorId, data) {
        try {
            const donorBeforeUpdate = await knex(tableName).where({ donor_id: donorId }).first();

            await knex(tableName)
                .where('donor_id', donorId)
                .update({
                    blood_type: data.bloodType,
                    medical_history: data.medicalHistory,
                });

            const donorAfterUpdate = await knex(tableName).where({ donor_id: donorId }).first();
            await auditServices.afterUpdateAsync(userId, tableName, donorId, donorBeforeUpdate, donorAfterUpdate);

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

    async updateDonorByUserIdAsync(userId, data) {
        try {
            await knex(tableName)
                .where('user_id', userId)
                .update({
                    blood_type: data.bloodType,
                    medical_history: data.medicalHistory,
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

    async deleteDonorAsync(userId, donorId) {
        try {
            await knex(tableName)
                .where('donor_id', donorId)
                .update({
                    is_deleted: true,
                    deleted_on: new Date(),
                });

            await auditServices.afterDeleteAsync(userId, tableName, donorId);

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

    async getDonorsByBloodType(bloodType) {
        try {
            const donors = await knex(tableName)
                .select(
                    'donors.donor_id as donorId',
                    'donors.blood_type as bloodType',
                    'users.full_name as name',
                    'users.email as email',
                    'users.mobile as mobile'
                )
                .leftJoin('users', 'donors.user_id', 'users.user_id')
                .where('donors.blood_type', bloodType)
                .andWhere('users.is_deleted', false)
                .andWhere('donors.is_deleted', false);

            return {
                message: "Donors fetched successfully",
                statusCode: 200,
                success: true,
                data: donors,
            };

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

module.exports = new DonorServices();