import dotenv from "dotenv";
dotenv.config();

const knexConf = {
  development: {
    client: process.env.DB_CLIENT || "pg",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_MIG

      //   database: process.env.DB_DATABASE
    },
    migrations: {
      directory: "./migrations",
    },
  },
};

export default knexConf;
