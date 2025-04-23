/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('event_participants', function(table) {
      table.increments('id').primary(); // Auto-incrementing primary key
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('contact').notNullable();
      table.boolean('isDeleted').defaultTo(false);
      table.boolean('isActive').defaultTo(true);
      table.timestamp('addedOn').defaultTo(knex.fn.now());
      table.timestamp('deletedOn').nullable();
      table.integer('event_id').unsigned().references('eventId').inTable('events').onDelete('CASCADE');
      table.integer('user_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('event_participants');
  };
