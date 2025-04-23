
exports.up = function (knex) {
    return knex.schema.createTable('faq', function (table) {
        table.increments('faqId').primary();
        table.string('question').notNullable();
        table.text('answer').nullable();
        table.integer('createdBy').unsigned().nullable();
        table.boolean("isApproved");
        table.boolean("isdeleted");
        table.dateTime("deletedOn").nullable();
        table.boolean("isUpdated");
        table.dateTime('updatedOn').nullable();
        table.foreign("createdBy").references("userId").inTable("users");
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('faq');
};