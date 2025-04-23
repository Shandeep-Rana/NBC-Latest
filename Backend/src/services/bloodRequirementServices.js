const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "blood_requirement";
const constants = require("../constants/index");
const userServices = require('./userServices');
const auditServices = require('./auditServices');
const rolesServices = require("./rolesServices");

class BloodRequirementServices {

    async addBloodRequirementAsync(data) {
        try {
            const newRequirement = {
                name: data.fullName,
                email: data.email,
                contact: data.contact,
                req_date: data.requireDate,
                location: data.location,
                description: data.description,
                blood_type: data.bloodType,
            }

            if (data.userId) {
                const userResult = await userServices.getUserByIdAsync(data.userId);
                if (!userResult.success) {
                    throw new Error('Invalid User');
                }

                const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
                if (!roleResult.success) {
                    throw new Error('Invalid User Roles');
                }

                const userRoles = roleResult.data;
                if (userRoles.includes(constants.ROLES.Admin)) {
                    newRequirement.isApproved = true;
                    newRequirement.isActivated = true;
                    newRequirement.approvedOn = new Date();
                } else {
                    newRequirement.isApproved = false;
                    newRequirement.isActivated = false;
                }
            } else {
                newRequirement.isApproved = false;
            }

            const [req_id] = await knex(tableName).insert(newRequirement);
            var insertedRequirement = await knex(tableName).where({ req_id: req_id }).first();

            // await auditServices.afterInsertAsync(userId, tableName, donor_id, insertedDonor);

            return {
                message: "Requirement Added Successfully",
                statusCode: 201,
                success: true,
                data: { insertedRequirement }
            };

        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getPaginatedBloodRequirementsAsync({ page = 1, pageSize = 10, selectedBloodGroup, search, sortBy = 'activatedOn', sortOrder = 'desc' }) {
        try {
            const offset = (page - 1) * pageSize;

            let query = knex('blood_requirement')
                .select('*')
                .where('isDeleted', false);

            let countQuery = knex('blood_requirement')
                .count('req_id as count')
                .where('isDeleted', false);

            if (search) {
                query = query.andWhere('name', 'like', `%${search}%`)
                    .orWhere('email', 'like', `%${search}%`)
                    .orWhere('blood_type', 'like', `%${search}%`)
                    .orWhere('location', 'like', `%${search}%`)
                    .orWhere('status', 'like', `%${search}%`);
                countQuery = countQuery.andWhere(function () {
                    this.where('name', 'like', `%${search}%`)
                        .orWhere('email', 'like', `%${search}%`)
                        .orWhere('blood_type', 'like', `%${search}%`)
                        .orWhere('location', 'like', `%${search}%`)
                        .orWhere('status', 'like', `%${search}%`);
                });
            }

            if (selectedBloodGroup) {
                query = query.andWhere('blood_requirement.blood_type', selectedBloodGroup);
                countQuery = countQuery.andWhere('blood_requirement.blood_type', selectedBloodGroup);
            }

            query = query.orderBy(sortBy, sortOrder);
            query = query.limit(pageSize).offset(offset);

            const requests = await query;
            const [{ count }] = await countQuery;

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: {
                    requests,
                    pagination: {
                        total: parseInt(count, 10),
                        currentPage: page,
                        totalPages: Math.ceil(count / pageSize)
                    }
                }
            };

        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async getBloodRequirementByIdAsync(id) {
        try {
            let query = knex('blood_requirement')
                .select(
                    'blood_requirement.*'
                )
                .where('req_id', id).first();

            let bloodRequirement = await query;

            if (bloodRequirement) {
                return {
                    message: "Fetched Successfully",
                    statusCode: 200,
                    success: true,
                    data: bloodRequirement
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

    async updateBloodRequirementAsync(data) {
        try {
            await knex('blood_requirement')
                .where('req_id', data.req_id)
                .update({
                    name: data.fullName,
                    email: data.email,
                    contact: data.contact,
                    req_date: data.requireDate,
                    location: data.location,
                    description: data.description,
                    status: data.requireStatus,
                    blood_type: data.bloodType,
                });

            return {
                message: "Blood Requirement updated Successfully",
                statusCode: 200,
                success: true,
                data: null
            };

        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async deleteBloodRequirementAsync(id) {
        try {

            await knex(tableName)
                .where('req_id', id)
                .update({
                    isDeleted: true,
                    deletedOn: new Date(),
                });

            // await auditServices.afterDeleteAsync(userId, tableName, blogId);

            const resultObject = {
                message: "Deleted Successfully",
                statusCode: 200,
                success: true,
                data: null
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

    async approveBloodRequirementAsync(reqId, userId) {
        try {
            const userResult = await userServices.getUserByIdAsync(userId);
            if (!userResult.success)
                throw new Error('Invalid User');

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if (!roleResult.success)
                throw new Error('Invalid User Role');

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin))
                throw new Error('Ask Admin to approve Request');

            const beforeApproveBloodRequirementRequest = await knex(tableName).where({ req_id: reqId }).first();

            await knex(tableName)
                .where('req_id', reqId)
                .update({
                    isApproved: true,
                    approvedOn: new Date()
                });

            const afterApproveBloodRequirementRequest = await knex(tableName).where({ req_id: reqId }).first();

            await auditServices.afterUpdateAsync(userId, tableName, reqId, beforeApproveBloodRequirementRequest, afterApproveBloodRequirementRequest);

            return {
                message: "Approved Successfully",
                statusCode: 200,
                success: true,
                data: null
            };

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

    async disApproveBloodRequirementAsync(reqId, userId) {
        try {
            const userResult = await userServices.getUserByIdAsync(userId);
            if (!userResult.success)
                throw new Error('Invalid User');

            const roleResult = await rolesServices.getUserRolesByIdAsync(userResult.data.Id);
            if (!roleResult.success)
                throw new Error('Invalid User Role');

            const userRoles = roleResult.data;
            if (!userRoles.includes(constants.ROLES.Admin))
                throw new Error('Ask Admin to disapprove requirement');

            const beforeDisApproveBloodRequirementRequest = await knex(tableName).where({ req_id: reqId }).first();

            await knex(tableName)
                .where('req_id', reqId)
                .update({
                    isApproved: false,
                    approvedOn: null
                });

            const afterDisApproveBloodRequirementRequest = await knex(tableName).where({ req_id: reqId }).first();

            await auditServices.afterUpdateAsync(userId, tableName, reqId, beforeDisApproveBloodRequirementRequest, afterDisApproveBloodRequirementRequest);

            return {
                message: "DisApproved Successfully",
                statusCode: 200,
                success: true,
                data: null
            };
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
module.exports = new BloodRequirementServices();