const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig["development"]);

class MasterServices {
    async getCommunityStatsAsync() {
        try {
            const [{ count: heroesCount }] = await knex("nangal_heroes")
                .count('hero_id as count')
                .where('is_deleted', false);

            const [{ count: donorsCount }] = await knex("donors")
                .count('donors.donor_id as count')
                .leftJoin('users', 'donors.user_id', 'users.user_id')
                .where('donors.is_deleted', false)
                .andWhere(function () {
                    this.whereNull('users.user_id').orWhere('users.is_deleted', false);
                });

            const [{ count: eventsCount }] = await knex("events")
                .count('eventId as count')
                .where('isdeleted', false)
                .andWhere('isactivated', true);

            const [{ count: volunteersCount }] = await knex("volunteers")
                .innerJoin('users', 'volunteers.user_id', 'users.user_id')
                .count('volunteers.vol_id as count')
                .where('volunteers.is_deleted', false)
                .andWhere('users.is_active', true)
                .andWhere('users.is_deleted', false);

            const [{ count: MembersCount }] = await knex.raw(`
      SELECT COUNT(*) AS count
      FROM (
        SELECT user_id
        FROM users
        WHERE is_deleted = false
        AND is_active = true

        UNION

        SELECT donors.user_id
        FROM donors
        LEFT JOIN users ON donors.user_id = users.user_id
        WHERE donors.is_deleted = false
        AND (users.user_id IS NULL OR users.is_deleted = false)
      ) AS union_table
    `).then(result => result[0]);

            return {
                message: "Fetched Successfully",
                statusCode: 200,
                success: true,
                data: {
                    heroesCount,
                    donorsCount,
                    eventsCount,
                    volunteersCount,
                    MembersCount,
                },
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
}
module.exports = new MasterServices();