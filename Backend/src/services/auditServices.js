const { ROLES } = require("../constants");
const knexConfig = require("../knexfile");
const rolesServices = require("./rolesServices");
const knex = require("knex")(knexConfig["development"]);
const table = "audit_logs";

class AuditServices {
    async afterInsertAsync(userId = null, tableName, recordId, newData) {
        const newInsertAuditEntry = {
            user_id: userId ? userId : null,
            action: "CREATE",
            table_name: tableName,
            record_id: recordId,
            new_data: JSON.stringify(newData)
        }

        await knex(table).insert(newInsertAuditEntry);
    }

    async afterUpdateAsync(userId, tableName, recordId, oldData, newData) {
        const newUpdateAuditEntry = {
            user_id: userId,
            action: "UPDATE",
            table_name: tableName,
            record_id: recordId,
            old_data: JSON.stringify(oldData),
            new_data: JSON.stringify(newData)
        }

        await knex(table).insert(newUpdateAuditEntry);
    }

    async afterDeleteAsync(userId, tableName, recordId) {
        const newDeleteAuditEntry = {
            user_id: userId,
            action: "DELETE",
            table_name: tableName,
            record_id: recordId,
        }

        await knex(table).insert(newDeleteAuditEntry);
    }

    async getAllAuditLogsAsync({ page = 1, pageSize = 10, search, userId, sortBy = 'timestamp', sortOrder = 'desc' }) {
        try {
            const offset = (page - 1) * pageSize;

            let query = knex(table).select('audit_logs.*', 'users.full_name as username')
                .leftJoin('users', 'audit_logs.user_id', 'users.user_id');

            let countQuery = knex(table).count('id as count');
            if (userId) {
                const userRoleRes = await rolesServices.getUserRolesByIdAsync(userId);

                if (!userRoleRes.success)
                    throw new Error(userRoleRes.message);

                if (!userRoleRes.data.includes(ROLES.Admin)) {
                    throw new Error("You are not authorized to view audit logs");
                }

            }
            else {
                throw new Error("User not found");
            }

            if (search) {
                query = query.where((q) => {
                    q.where('action', 'like', `%${search}%`)
                        .orWhere('table_name', 'like', `%${search}%`);
                });

                countQuery = countQuery.where((q) => {
                    q.where('action', 'like', `%${search}%`)
                        .orWhere('table_name', 'like', `%${search}%`);
                });
            }

            query = query.orderBy(sortBy, sortOrder);
            query = query.limit(pageSize).offset(offset);

            var logs = await query;
            const [{ count }] = await countQuery;

            const resultObject = {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: {
                    logs,
                    pagination: {
                        total: parseInt(count, 10),
                        currentPage: page,
                        totalPages: Math.ceil(count / pageSize)
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
}
module.exports = new AuditServices();