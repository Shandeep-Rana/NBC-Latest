/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("socialMedia", function (table) {
      table.increments("accId").primary();
      table.string("google").nullable();
      table.string("linkedin").nullable();
      table.string("youtube").nullable();
      table.string("twitter").nullable();
      table.string("facebook").nullable();
      table.integer('userId').unsigned().nullable();
      table.foreign("userId").references("userId").inTable("users");
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("users");
  };