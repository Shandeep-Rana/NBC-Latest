exports.up = function (knex) {
    return knex.schema.createTable("events", function (table) {
      table.increments("eventId").primary();
      table.string("title").notNullable();
      table.text("description").notNullable();
      table.string("contact").notNullable();
      table.string("thumbnail").notNullable();
      table.dateTime("startDateTime").notNullable();
      table.dateTime("endDateTime").notNullable();
      table.string("organiser").nullable();
      table.string("organiserId").notNullable();
      table.boolean("isdeleted");
      table.boolean("isactivated");
      table.dateTime("deletedOn");
      table.dateTime("activatedOn");
      table.string("location").notNullable();
      table.foreign('organiserId').references("userId").inTable("users");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("events");
  };
