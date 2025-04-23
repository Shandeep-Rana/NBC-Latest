/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("users", function (table) {
      table.increments("userId").primary();
      table.string("fullName").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.string("userProfile").nullable();
      table.boolean("isdeleted");
      table.boolean("isactivated");
      table.dateTime("deletedOn");
      table.dateTime("activatedOn");
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("users");
  };