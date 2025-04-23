/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('person_specializedskill', function(table) {
      table.increments('id').primary(); 
      table.integer('categoryId').unsigned().notNullable(); 
      table.foreign('categoryId').references('id').inTable('specialized_category').onDelete('CASCADE');
      
      table.integer('perosnId').unsigned().notNullable(); 
      table.foreign('perosnId').references('person_id').inTable('skilled_persons').onDelete('CASCADE');
      
      table.timestamp('addedOn').defaultTo(knex.fn.now()); 
      table.timestamp('updatedOn').nullable(); 
      table.timestamp('deletedOn').nullable();;
      
      table.boolean('isDeleted').defaultTo(false); 
      table.boolean('isActive').defaultTo(true);   
      
      table.longtext('description').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('person_specializedskill');
};