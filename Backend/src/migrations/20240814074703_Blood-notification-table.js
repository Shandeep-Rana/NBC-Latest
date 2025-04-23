/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("blood_requirement", function (table) {
    table.increments("req_id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("contact").notNullable();
    table.string("blood_type").notNullable();
    table.string("location").nullable();
    table.string("status").nullable();
    table.longtext("description").nullable();
    table.date('req_date').notNullable();
    table.boolean("isdeleted").defaultTo(false); // Default value for isdeleted
    table.boolean("isactivated").defaultTo(false); // Default value for isactivated
    table.dateTime("deletedOn").nullable();
    table.dateTime("activatedOn").defaultTo(knex.fn.now()); // Default value for activatedOn
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("blood_requirement");
};
