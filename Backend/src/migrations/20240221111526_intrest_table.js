exports.up = function(knex) {
    return knex.schema.createTable("intrests", function(table) {
      table.increments("id").primary();
      table.string("name").notNullable();
    }).then(() => {
      // Insert default categories
      return knex("intrests").insert([
        { name: "Social Services" },
        { name: "Education" },
        { name: "Health and Wellness" },
        { name: "Environment" },
        { name: "Sports and Recreation" },
        { name: "Arts and Culture" },
        { name: "Business and Entrepreneurship" },
        { name: "Technology and Innovation" },
      ]);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("intrests");
  };