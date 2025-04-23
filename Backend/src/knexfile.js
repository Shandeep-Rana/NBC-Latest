
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: '185.199.53.75',
      database: 'nbc',
      user: 'nbc',
      password: 'g3jJ1#1{1@4',
      port: 3306,
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
  },

  production: {
    client: 'mysql',
    connection: {
      host: '185.199.53.75',
      database: 'nbc',
      user: 'nbc',
      password: 'g3jJ1#1{1@4',
      port: 3306
    },
    seeds: {
      directory: './seeds',
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};