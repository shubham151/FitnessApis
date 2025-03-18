import knex from 'knex';

let db;

let connectDB = () => {
  db = knex({
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    }
  });
}

let getDB = () => {
  if (!db) {
    throw new Error('Database not initialized!');
  }
  return db;
}

export { connectDB, getDB };

