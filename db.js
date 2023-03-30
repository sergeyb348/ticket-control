const  {Sequelize}  = require("sequelize");
require("dotenv").config();

const dbSequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
  }
);

module.exports = dbSequelize;