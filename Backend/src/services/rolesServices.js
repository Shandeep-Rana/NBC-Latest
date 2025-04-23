const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);
const roleTableName = "roles";
const userRoleTableName = "user_roles";

class RoleServices {

    async getUserRolesByIdAsync(userId) {
        try {
            let roles = await knex(roleTableName)
                .select('roles.role_name as roleName')
                .leftJoin(userRoleTableName, 'roles.role_id', 'user_roles.role_id')
                .where('user_roles.user_id', userId).andWhere('user_roles.is_deleted', false);

            if (roles.length === 0)
                throw new Error("No roles found for the user");

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: roles.map(role => role.roleName)
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

    async addUserToRoleAsync(userId, roleName) {
        try {
            const roleResult = await this.getRoleByRoleName(roleName);
            if (roleResult.success) {
                const role = roleResult.data;
                await knex(userRoleTableName).insert({ role_id: role.role_id, user_id: userId });
                return {
                    message: "Role Assigned Successfully",
                    statusCode: 201,
                    success: true
                };
            }
            return {
                message: "Role Assigned Failed",
                statusCode: 400,
                success: false
            };
        }
        catch (error) {
            return {
                message: error.message,
                statusCode: 400,
                success: false
            };
        } 
    }

    async getRoleByRoleName(roleName) {
        try {
            const role = await knex(roleTableName).select('*').where('role_name', roleName).first();

            if (role) {
                return {
                    message: "Fetched Successfully",
                    statusCode: 200,
                    success: true,
                    data: role
                };
            }
            throw new Error("Role not found");
        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
                data: null
            };
        }
    }

    async deleteUserFromRoleAsync(userId, roleName) {
        try {
            const role = await knex(roleTableName).select('*').where('role_name', roleName).first();
            await knex(userRoleTableName)
                .where('role_id', role.role_id)    
                .andWhere('user_id', userId)
                .update({
                    is_deleted: true,
                    deleted_on: new Date(),
                });

            return {
                message: "Deleted Successfully",
                statusCode: 200,
                success: true,
            };
        } catch (err) {
            return {
                message: err.message,
                statusCode: 400,
                success: false,
            };
        }
    }
}

module.exports = new RoleServices();