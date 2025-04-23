exports.up = function(knex) {
    return knex.schema.createTable('Blog', function(table) {
      table.increments('id').primary();
      table.string('title', 255).notNullable().unique();
      table.string('author', 100).notNullable();
      table.dateTime('publish_date').notNullable();
      table.longtext('content');
      table.string('authorProfile', 255);
      table.string('authorDescription', 255);
      table.string('thumbnail', 255);
      table.boolean("isdeleted");
      table.boolean("isactivated");
      table.dateTime("deletedOn");
      table.dateTime("activatedOn");
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('Blog');
  };
