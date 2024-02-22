const db = require("../../database/client");

const findAll = () => {
  return db.query(`SELECT * FROM movies;`, []);
};

module.exports = {
  findAll,
};
