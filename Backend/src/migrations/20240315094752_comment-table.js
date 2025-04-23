exports.up = function(knex) {
    return knex.schema.createTable('Comments', function(table) {
      table.increments('CommentID').primary();
      table.integer('ParentID').unsigned().references('CommentID').inTable('Comments');
      table.integer('BlogId').unsigned();
      table.foreign('BlogId').references('id').inTable('Blog').onDelete('CASCADE'); 
      table.string('Name');
      table.string('Email');
      table.text('Comment');
      table.dateTime('DatePosted').defaultTo(knex.fn.now());
      table.dateTime('DateDeleted');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('Comments');
  };