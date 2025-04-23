/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('roles').del()
  await knex('roles').insert([
    {role_id: 1, role_name: 'admin'},
    {role_id: 2, role_name: 'volunteer'},
    {role_id: 3, role_name: 'donor'},
    {role_id: 4, role_name: 'skilled person'}
  ]);
};
