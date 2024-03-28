const db = require("../../database/client");

const findAllTagIdDesc = () => {
  return db.query(`SELECT * FROM tag order by id desc`, []);
};

module.exports = {
  findAllTagIdDesc,
};
