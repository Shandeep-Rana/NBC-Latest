/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("user_roles", function (table) {
      table.integer("role_id").unsigned().notNullable();
      table.integer("user_id").unsigned().notNullable();
      table.boolean("is_deleted");
      table.dateTime("deleted_on");
  
      table.foreign("userId").references("userId").inTable("users");
      table.foreign("roleId").references("roleId").inTable("roles");
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("user_roles");
  };
  