const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const tableName = "users";
const constants = require("../constants/index");
const URL = constants.IMAGE_URL;
const auditServices = require('../services/auditServices');
const bcrypt = require("bcryptjs");
const rolesServices = require('../services/rolesServices');
const commFunctions = require('../utils/common');

class UserServices {
    async createUserAsync(userId, data) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(data.password, salt);

            const newUser = {
                full_name: data.fullName,
                email: data.email,
                hash_password: hashedPassword,
                mobile: data.mobile,
                dob: data.dob,
                gender: data.gender,
                user_profile: data.userProfile,
                contact_mode: data.contactMode,
                village: data.villageId,
                address_line1: data.addressLine1,
                address_line2: data.addressLine2,
                pincode: data.pincode,
                state: data.state,
            }

            const [user_id] = await knex(tableName).insert(newUser);
            var insertedUser = await knex(tableName).where({ user_id: user_id }).first();

            await auditServices.afterInsertAsync(userId, tableName, user_id, insertedUser);

            return {
                message: "User Added Successfully",
                statusCode: 201,
                success: true,
                data: user_id
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

    async loginUserAsync(data) {
        try {
            const userExistRes = await this.getUserByEmailAsync(data.email);
            if (!userExistRes.success) {
                throw new Error('User not found with this email address.');
            }
            const userRes = await this.getUserByIdAsync(userExistRes.data.user_id);

            const user = userRes.data;

            const roleRes = await rolesServices.getUserRolesByIdAsync(user.Id);
            if (!roleRes.success) {
                throw new Error('Role not found.')
            }

            if (roleRes.data.length === 1 && roleRes.data.includes(constants.ROLES.Donor))
                throw new Error('User not found with this email address.');

            if (!user.isActive) {
                throw new Error('Account not verified.')
            }

            const passwordMatch = await bcrypt.compare(data.password, user.hashPassword);
            if (!passwordMatch) {
                throw new Error('Invalid Password.')
            }

            const encryptUserId = commFunctions.encrypt(user.Id);
            const token = commFunctions.generateAuthToken(encryptUserId, user.Email, roleRes.data);
            return {
                message: "Logged in successfully",
                success: true,
                data: {
                    token,
                    roleName: roleRes.data,
                    email: user.email,
                    userProfile: user.userProfile
                }
            }
        }
        catch (error) {
            return {
                message: error.message,
                success: false,
            }
        }
    }

    async getUserByEmailAsync(email) {
        try {
            let user = await knex(tableName).select('*').where('email', email).andWhere('is_deleted', false).first();
            if (user) {
                return {
                    message: "Fetched Successfully",
                    statusCode: 200,
                    success: true,
                    data: user
                };
            }
            throw new Error("User not found");
        }
        catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            }
        }
    }
    async getUserByIdAsync(id) {
        try {
            let user = await knex(tableName)
                .select(
                    'users.user_id as Id',
                    'users.full_name as Name',
                    'users.email as Email',
                    'users.user_profile as userProfile',
                    'users.is_active as isActive',
                    'users.hash_password as hashPassword'
                )
                .where('users.user_id', id)
                .andWhere('users.is_deleted', false)
                .first();

            if (!user) throw new Error("User not found");

            // Fetch user roles
            let userRoles = await rolesServices.getUserRolesByIdAsync(user.Id);

            if (!userRoles.success) throw new Error(userRoles.message);

            // Initialize an empty object to hold merged details
            let roleDetails = {};

            // Fetch Donor details if the user is a Donor
            if (userRoles.data.includes(constants.ROLES.Donor)) {
                let donorDetails = await knex('donors')
                    .select(
                        'donors.donor_id as donorId',
                        'donors.blood_type as bloodType',
                        'donors.medical_history as medicalHistory'
                    )
                    .where('donors.user_id', user.Id)
                    .andWhere('donors.is_deleted', false)
                    .first();

                if (donorDetails) {
                    roleDetails = { ...roleDetails, ...donorDetails };
                }
            }

            // Fetch Volunteer details if the user is a Volunteer
            if (userRoles.data.includes(constants.ROLES.Volunteer)) {
                let volDetails = await knex('volunteers')
                    .select(
                        'volunteers.vol_id as volunteerId',
                        'professions.profession_name as profession',
                        'interests.interest as interests'
                    )
                    .leftJoin('professions', 'volunteers.profession', 'professions.profession_id')
                    .leftJoin('interests', 'volunteers.interests', 'interests.interest_id')
                    .where('volunteers.user_id', user.Id)
                    .first();

                if (volDetails) {
                    roleDetails = { ...roleDetails, ...volDetails };
                }
            }

            // Fetch Skilled Person details if the user is a Skilled Person
            if (userRoles.data.includes(constants.ROLES.SkilledPerson)) {
                let skilledDetails = await knex('skilled_persons')
                    .select(
                        'skilled_persons.person_id as personId',
                        'professions.profession_name as profession',
                        'interests.interest as interests'
                    )
                    .leftJoin('professions', 'skilled_persons.profession', 'professions.profession_id')
                    .leftJoin('interests', 'skilled_persons.interests', 'interests.interest_id')
                    .where('skilled_persons.user_id', user.Id)
                    .first();

                if (skilledDetails) {
                    roleDetails = { ...roleDetails, ...skilledDetails };
                }
            }

            // Merge role details with the user object
            user = { ...user, ...roleDetails };

            // Process user profile URL
            user.userProfile = user.userProfile
                ? `${URL}/userProfile/${user.userProfile}`
                : null;

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: user
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

    async updateUserAsync(userId, id, data) {
        try {
            let userResult = await this.getUserByIdAsync(id);
            if (userResult.success) {

                const beforeUpdateUser = await knex(tableName).where({ user_id: id }).first();

                await knex('users')
                    .where('users.user_id', id)
                    .update({
                        full_name: data.fullName,
                        mobile: data.mobile,
                        dob: data.dob,
                        gender: data.gender,
                        user_profile: data.userProfile,
                        contact_mode: data.contactMode,
                        village: data.village,
                        address_line1: data.addressLine1,
                        address_line2: data.addressLine2,
                        pincode: data.pincode,
                        state: data.state,
                        about: data.about,
                        updated_at: new Date()
                    });

                const afterUpdateUser = await knex(tableName).where({ user_id: id }).first();
                await auditServices.afterUpdateAsync(userId, tableName, id, beforeUpdateUser, afterUpdateUser);

                return {
                    message: "Updated Successfully",
                    statusCode: 200,
                    success: true,
                    data: `${URL}/userProfile/${data.userProfile}`
                };
            }
            throw new Error("User not found");
        }
        catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false
            };
        }
    }

    async updateGuestUserAsync(userId, id, data) {
        try {
            let userResult = await this.getUserByIdAsync(id);
            if (userResult.success) {

                const beforeUpdateUser = await knex(tableName).where({ user_id: id }).first();

                await knex('users')
                    .where('users.user_id', id)
                    .update({
                        full_name: data.fullName,
                        mobile: data.mobile,
                        dob: data.dob,
                        gender: data.gender,
                        village: data.village,
                        address_line1: data.addressLine1,
                        updated_at: new Date()
                    });

                const afterUpdateUser = await knex(tableName).where({ user_id: id }).first();
                await auditServices.afterUpdateAsync(userId, tableName, id, beforeUpdateUser, afterUpdateUser);

                return {
                    message: "Updated Successfully",
                    statusCode: 200,
                    success: true,
                    data: `${URL}/userProfile/${data.userProfile}`
                };
            }
            throw new Error("User not found");
        }
        catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false
            };
        }
    }

    async deleteUserAsync(userId, id) {
        try {
            await knex(tableName)
                .where('user_id', id)
                .update({
                    is_active: false,
                    is_deleted: true,
                    deleted_on: new Date(),
                });

            await auditServices.afterDeleteAsync(userId, tableName, id);

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

    async verifyUserAccountAsync(userId) {
        try {
            await knex(tableName)
                .where("user_id", userId)
                .update({
                    is_active: true,
                    activated_on: new Date()
                });

            return {
                message: "Account Verified Successfully",
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

    async resetPasswordAsync(userId, password) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await knex(tableName)
                .where("user_id", userId)
                .update({
                    hash_password: hashedPassword,
                    updated_at: new Date()
                });

            return {
                message: "Password Reset Successfully",
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

    async getUserDetailsByEmailAsync(email) {
        try {
            let user = await knex(tableName)
                .select(
                    'users.user_id as id',
                    'users.full_name as name',
                    'users.email',
                    'users.mobile',
                    'users.dob',
                    'users.gender',
                    'users.user_profile as userProfile',
                    'users.contact_mode as contactMode',
                    'villages.village_name as village',
                    'users.address_line1 as addressLine1',
                    'users.address_line2 as addressLine2',
                    'users.pincode',
                    'users.state',
                    'users.about'
                )
                .leftJoin('villages', 'users.village', 'villages.vill_id')
                .where('users.email', email).andWhere('users.is_active', true).andWhere('users.is_deleted', false)
                .first();

            if (user) {
                let userRoles = await rolesServices.getUserRolesByIdAsync(user.id);

                if (!userRoles.success)
                    throw new Error(userRoles.message);

                if (userRoles.data.length === 1 && userRoles.data.includes(constants.ROLES.Donor)) {
                    let donorDetails = await knex('donors')
                        .select(
                            'donors.donor_id as donorId',
                            'donors.blood_type as bloodType',
                            'donors.medical_history as medicalHistory'
                        )
                        .where('donors.user_id', user.id).andWhere('donors.is_deleted', false).first();

                    if (!donorDetails)
                        throw new Error("User not found");

                    user = { ...user, ...donorDetails };
                }
                else if (userRoles.data.length === 1 && userRoles.data.includes(constants.ROLES.Volunteer)) {
                    let volDetails = await knex('volunteers')
                        .select(
                            'volunteers.vol_id as volunteerId',
                            'professions.profession_name as profession',
                            'interests.interest as interests'
                        )
                        .leftJoin('professions', 'volunteers.profession', 'professions.profession_id')
                        .leftJoin('interests', 'volunteers.interests', 'interests.interest_id')
                        .where('volunteers.user_id', user.id).first();

                    if (!volDetails)
                        throw new Error("User not found");

                    user = { ...user, ...volDetails };
                }
                else if (userRoles.data.length === 1 && userRoles.data.includes(constants.ROLES.SkilledPerson)) {
                    let skilledDetails = await knex('skilled_persons')
                        .select(
                            'skilled_persons.person_id as personId',
                            'professions.profession_name as profession',
                            'interests.interest as interests'
                        )
                        .leftJoin('professions', 'skilled_persons.profession', 'professions.profession_id')
                        .leftJoin('interests', 'skilled_persons.interests', 'interests.interest_id')
                        .where('skilled_persons.user_id', user.id).first();

                    if (!skilledDetails)
                        throw new Error("User not found");

                    user = { ...user, ...skilledDetails };
                }
                else if (userRoles.data.includes(constants.ROLES.Donor) && userRoles.data.includes(constants.ROLES.Volunteer)) {
                    let donorDetails = await knex('donors')
                        .select(
                            'donors.donor_id as donorId',
                            'donors.blood_type as bloodType',
                            'donors.medical_history as medicalHistory'
                        )
                        .where('donors.user_id', user.id).andWhere('donors.is_deleted', false).first();

                    let volDetails = await knex('volunteers')
                        .select(
                            'volunteers.vol_id as volunteerId',
                            'professions.profession_name as profession',
                            'interests.interest as interests'
                        )
                        .leftJoin('professions', 'volunteers.profession', 'professions.profession_id')
                        .leftJoin('interests', 'volunteers.interests', 'interests.interest_id')
                        .where('volunteers.user_id', user.id).first();

                    if (!donorDetails || !volDetails)
                        throw new Error("User not found");

                    user = { ...user, ...donorDetails, ...volDetails };
                }
                else if (userRoles.data.includes(constants.ROLES.Donor) && userRoles.data.includes(constants.ROLES.SkilledPerson)) {
                    let donorDetails = await knex('donors')
                        .select(
                            'donors.donor_id as donorId',
                            'donors.blood_type as bloodType',
                            'donors.medical_history as medicalHistory'
                        )
                        .where('donors.user_id', user.id).andWhere('donors.is_deleted', false).first();

                    let skilledDetails = await knex('skilled_persons')
                        .select(
                            'skilled_persons.person_id as personId',
                            'professions.profession_name as profession',
                            'interests.interest as interests'
                        )
                        .leftJoin('professions', 'skilled_persons.profession', 'professions.profession_id')
                        .leftJoin('interests', 'skilled_persons.interests', 'interests.interest_id')
                        .where('skilled_persons.user_id', user.id).first();

                    if (!donorDetails || !skilledDetails)
                        throw new Error("User not found");

                    user = { ...user, ...donorDetails, ...skilledDetails };
                }
                else if (userRoles.data.includes(constants.ROLES.Admin)) {
                    user = { ...user };
                }
                else {
                    throw new Error("User not found");
                }

                user.userProfile = user.userProfile
                    ? `${URL}/userProfile/${user.userProfile}`
                    : null;

                return {
                    message: "Fetched Successfully",
                    statusCode: 200,
                    success: true,
                    data: user
                };
            }
            throw new Error("User not found");
        }
        catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            }
        }
    }

    async changePasswordAsync(userId, oldPassword, password) {
        try {
            const userRes = await this.getUserByIdAsync(userId);
            if (!userRes.success)
                throw new Error("User not found")

            const passwordMatch = await bcrypt.compare(oldPassword, userRes.data.hashPassword);
            if (!passwordMatch)
                throw new Error("Incorrect Password")

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await knex(tableName)
                .where("user_id", userId)
                .update({
                    hash_password: hashedPassword,
                    updated_at: new Date()
                });

            return {
                message: "Password Changed Successfully",
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

    async getAllGuestUserAsync({ page = 1, pageSize = 10, search, sortBy = 'user_id', sortOrder = 'desc' }) {
        try {
            const offset = (page - 1) * pageSize;
            const roleId = 5;

            // Query for guest users
            let query = knex('users')
                .select(
                    'users.user_id as userId',
                    'users.full_name as name',
                    'users.email as email',
                    'users.mobile as mobile',
                    'users.dob as dob',
                    'users.gender as gender',
                    'users.user_profile as userProfile',
                    'villages.village_name as village',
                    'users.address_line1 as addressLine1'
                )
                .leftJoin('villages', 'users.village', 'villages.vill_id')
                .leftJoin('user_roles', 'user_roles.user_id', 'users.user_id')
                .where('users.is_deleted', false)
                .andWhere('user_roles.role_id', roleId);


            let countQuery = knex("users")
                .count('users.user_id as count')
                .leftJoin('villages', 'users.village', 'villages.vill_id')
                .leftJoin('user_roles', 'user_roles.user_id', 'users.user_id')
                .where('users.is_deleted', false)
                .andWhere('user_roles.role_id', roleId);

            if (search) {
                query = query.andWhere(builder => {
                    builder.where('users.address_line1', 'like', `%${search}%`)
                        .orWhere('users.address_line2', 'like', `%${search}%`)
                        .orWhere('villages.village_name', 'like', `%${search}%`);
                });

                countQuery = countQuery.andWhere(builder => {
                    builder.where('users.address_line1', 'like', `%${search}%`)
                        .orWhere('users.address_line2', 'like', `%${search}%`)
                        .orWhere('villages.village_name', 'like', `%${search}%`);
                });
            }

            query = query.orderBy(`users.${sortBy}`, sortOrder);
            query = query.limit(pageSize).offset(offset);


            let users = await query;
            const [{ count }] = await countQuery;

            const processedUsers = users.map(user => {
                user.userProfile = user.userProfile
                    ? `${URL}/userProfile/${user.userProfile}`
                    : null;

                return user;
            });

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: {
                    guestUsers: processedUsers,
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

    async getGuestUserByIdAsync(userId) {
        try {
            const roleId = 5;

            // Query for a specific guest user by ID
            let query = knex('users')
                .select(
                    'users.full_name as name',
                    'users.email as email',
                    'users.mobile as mobile',
                    'users.dob as dob',
                    'users.gender as gender',
                    'users.user_profile as userProfile',
                    'villages.village_name as village',
                    'users.address_line1 as addressLine1'
                )
                .leftJoin('villages', 'users.village', 'villages.vill_id')
                .leftJoin('user_roles', 'user_roles.user_id', 'users.user_id')
                .where('users.is_deleted', false)
                .andWhere('user_roles.role_id', roleId)
                .andWhere('users.user_id', userId)
                .first();

            let user = await query;

            if (!user) {
                return {
                    message: "User not found",
                    statusCode: 404,
                    success: false,
                    data: null
                };
            }

            // Process the user profile URL
            user.userProfile = user.userProfile
                ? `${URL}/userProfile/${user.userProfile}`
                : null;

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: user
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

    async getAllActiveUsersAsync() {
        try {
            const users = await knex(tableName)
                .select(
                    'user_id as id',
                    'full_name as name',
                    'email',
                    'mobile',
                    'dob as date_of_birth'
                )
                .where('is_deleted', false)
                .andWhere('is_active', true);

            if (users.length > 0) {
                // Convert date_of_birth to IST for each user
                const istOffset = 330; // IST is UTC+5:30, so 330 minutes
                const usersWithISTDOB = users.map(user => {
                    const userDateOfBirth = new Date(user.date_of_birth);
                    const userDOBInIST = new Date(userDateOfBirth.getTime() + istOffset * 60000);
                    return {
                        ...user,
                        date_of_birth: userDOBInIST.toISOString().slice(0, 10) // Format as YYYY-MM-DD
                    };
                });

                return {
                    message: "Users fetched successfully",
                    statusCode: 200,
                    success: true,
                    data: usersWithISTDOB
                };
            }

            return {
                message: "No active users found",
                statusCode: 404,
                success: false,
                data: []
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

}


module.exports = new UserServices();