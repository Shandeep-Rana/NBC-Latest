/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('specialized_category', function(table) {
      table.increments('id').primary();
      table.string('category').notNullable();
      table.boolean('isDeleted').defaultTo(false);
      table.boolean('isActive').defaultTo(true);
      table.timestamp('addedOn').defaultTo(knex.fn.now());
      table.timestamp('deletedOn').nullable();
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('specialized_category');
  };
