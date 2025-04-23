/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("skilledperson", function (table) {
      table.increments("personId").primary();
      table.string("fullName").notNullable();
      table.string("email").notNullable().unique();
      table.string("contact").notNullable();
      table.datetime('dob').notNullable();
      table.string("village").notNullable();
      table.string("profession").notNullable();
      table.string("intrests").notNullable();
      table.string("gender").notNullable();
      table.string("contactMode").notNullable();
      table.text("comment").nullable();
      table.string('address_line1').notNullable();
      table.string('address_line2').nullable();
      table.string('pincode').notNullable();
      table.string('state').notNullable();
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
    return knex.schema.dropTableIfExists("skilledperson");
  };
  
