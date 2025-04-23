exports.up = function(knex) {
    return knex.schema.createTable('news', function(table) {
      table.increments('news_id').primary();
      table.string('title', 255).notNullable();
      table.text('content');
      table.integer('author').unsigned().nullable();
      table.string('thumbnail_url', 255).notNullable();
      table.datetime('publish_date').defaultTo(null);
      table.boolean('is_published').defaultTo(false);
      table.datetime('published_on').defaultTo(null);
      table.boolean('is_approved').defaultTo(false);
      table.datetime('approved_on').defaultTo(null);
      table.datetime('updated_at').defaultTo(null);
      table.boolean('is_deleted').defaultTo(false);
      table.datetime('deleted_on').defaultTo(null);
      table.timestamp('created_on').defaultTo(knex.fn.now());
      table.boolean('is_delete_requested').defaultTo(false);
      table.foreign('author').references('users.user_id');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('news');
  };
  