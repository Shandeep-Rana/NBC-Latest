/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('feedback', function (table) {
        table.increments('id').primary();
            table.string('name').notNullable;
            table.string('email').notNullable();
            table.string('contact').notNullable();
            table.text('description');
            table.integer('stars').notNullable();
            table.dateTime('addedOn');
        });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('feedback');
};
