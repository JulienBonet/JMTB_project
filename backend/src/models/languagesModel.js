const db = require("../../database/client");

const findAllLanguagesIdDesc = () => {
  return db.query(`SELECT * FROM language order by id desc`, []);
};

module.exports = {
  findAllLanguagesIdDesc,
};
