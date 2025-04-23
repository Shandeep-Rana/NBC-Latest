/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('gallery', function (table) {
        table.increments('imageId').primary();
            table.string('name').notNullable();
            table.string('image').nullable();
            table.boolean("isdeleted").nullable();
            table.boolean("isactivated").nullable();
            table.dateTime("deletedOn").nullable();
            table.dateTime("activatedOn").nullable();
        });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('gallery');
};