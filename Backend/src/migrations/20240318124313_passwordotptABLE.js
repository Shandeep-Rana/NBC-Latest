/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('PasswordOtp', function (table) {
        table.increments('Id').primary().notNullable();
        table.integer('userId').unsigned().notNullable();
        table.integer('otp').notNullable();
        table.dateTime('otpExpiryDate').notNullable();
        table.boolean('isOtpUsed');
        table.boolean('isdeleted');
        table.boolean('isactivated');
        table.dateTime('ActivatedAt');
        
        table.foreign('userId').references('userId').inTable('users').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('PasswordOtp');
};