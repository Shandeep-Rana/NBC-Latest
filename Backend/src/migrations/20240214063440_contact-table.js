/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('contact', function (table) {
        table.increments('contactId').primary();
            table.string('name').notNullable;
            table.string('email').notNullable().unique();
            table.text('subject').notNullable();
            table.string('phone').notNullable();
            table.text('description');
        });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('contact');
};
