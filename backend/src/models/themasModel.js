const db = require("../../database/client");

const findAllThemaIdDesc = () => {
  return db.query(
    `SELECT *
      FROM thema
      order by id desc`,
    []
  );
};

module.exports = {
  findAllThemaIdDesc,
};
