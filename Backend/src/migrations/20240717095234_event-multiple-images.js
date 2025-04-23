/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('event_images', function (table) {
        table.increments('image_id').primary();
            table.string('name').notNullable();
            table.integer("event_id").unsigned().notNullable();
            table.boolean("isdeleted").nullable();
            table.boolean("isactivated").nullable();
            table.dateTime("deletedOn").nullable();
            table.dateTime("activatedOn").nullable();
            table.foreign("event_id").references("eventId").inTable("events");
        });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('event_images');
};
