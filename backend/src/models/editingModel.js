/* eslint-disable no-restricted-syntax */
const db = require("../../database/client");

const findDirectorById = (id) => {
  return db
    .query("SELECT * FROM director WHERE id = ?", [id])
    .then(([rows]) => {
      console.log("Director found:", rows);
      return rows;
    });
};

const editDirector = (name, pitch, wikilink, imdblink, id) => {
  return db
    .query(
      `UPDATE director
        SET
          name = ?,
          pitch = ?,
          wikilink = ?,
          imdblink = ?
        WHERE id = ?;`,
      [name, pitch, wikilink, imdblink, id]
    )
    .then(([result]) => {
      console.log("Rows affected:", result.affectedRows);
      return result;
    });
};

module.exports = {
  findDirectorById,
  editDirector,
};
