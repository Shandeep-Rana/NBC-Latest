/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("donor", function (table) {
    table.increments("donorId").primary();
    table.string("fullName").notNullable();
    table.string("email").notNullable().unique();
    table.string("donorProfile").nullable();
    table.string("gender").notNullable();
    table.longtext("medicalhistory");
    table.string("contact", 'NVARCHAR(20)').notNullable();
    table.date('dob').notNullable();
    table.string("contactMode").notNullable();
    table.string("village").notNullable();
    table.string("blood_type").notNullable();
    table.string('address_line1').notNullable();
    table.string('address_line2').nullable();
    table.string('pincode').notNullable();
    table.string('state').notNullable();
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
  return knex.schema.dropTableIfExists("donor");
};
