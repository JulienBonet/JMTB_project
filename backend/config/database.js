const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("jmdb", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
