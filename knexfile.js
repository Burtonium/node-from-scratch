module.exports = {
  
  development: {
    client: 'postgres',
    connection: {
      database: 'brtnzr_db',
      user:     'ubuntu',
      password: 'ayylmao'
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/development'
    }
  },
  
  test: {
    client: 'postgres',
    connection: {
      database: 'test',
      user:     'ubuntu',
      password: 'ayylmao'
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/development'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/db/migrations'
    }
  }
};
