/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("professions").del();
  await knex("professions").insert([
    { profession_id: 1, profession_name: "Educator" },
    { profession_id: 2, profession_name: "Healthcare Professional" },
    { profession_id: 3, profession_name: "Business Owner" },
    { profession_id: 4, profession_name: "Government Employee" },
    { profession_id: 5, profession_name: "Homemaker" },
    { profession_id: 6, profession_name: "Retired" },
  ]);
};
