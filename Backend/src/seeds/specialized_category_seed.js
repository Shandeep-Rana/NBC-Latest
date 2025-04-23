/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries in the specialized_category table
  await knex('specialized_category').del();

  // Inserts seed entries
  await knex('specialized_category').insert([
    { category: 'Art', isDeleted: false, isActive: true, addedOn: knex.fn.now() },
    { category: 'Fitness', isDeleted: false, isActive: true, addedOn: knex.fn.now() },
    { category: 'Technology', isDeleted: false, isActive: true, addedOn: knex.fn.now() }
  ]);
};