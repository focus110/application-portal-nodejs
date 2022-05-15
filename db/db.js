const Sequelize = require("sequelize");
const dbConnection = require("../config/dbConfig.js");

module.exports = new Sequelize(
  dbConnection.DB,
  dbConnection.USER,
  dbConnection.PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",

    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
);
