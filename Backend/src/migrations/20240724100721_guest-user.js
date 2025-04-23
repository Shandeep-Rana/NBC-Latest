/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("guest_user", function (table) {
      table.increments("user_id").primary();
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.string("contact").notNullable();
      table.string("password").notNullable();
      table.boolean("isdeleted");
      table.boolean("isactivated");
      table.dateTime("deletedOn");
      table.dateTime("activatedOn");
      table.integer('userId').unsigned();
      table.foreign('userId').references('users.userId');
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("volunteers");
  };
  
