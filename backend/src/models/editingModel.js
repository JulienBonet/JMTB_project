const db = require("../../database/client");

const findDirectorById = (id) =>
  db.query("SELECT * FROM director WHERE id = ?", [id]).then(([rows]) => rows);

const editDirector = async (name, pitch, wikilink, imdblink, id) => {
  const query = `
        UPDATE director
        SET name = ?, pitch = ?, wikilink = ?, imdblink = ?
        WHERE id = ?
      `;

  const result = await db.query(query, [name, pitch, wikilink, imdblink, id]);

  return result;
};

const editDirectorImage = (imageUrl, id) =>
  db
    .query("UPDATE director SET image = ? WHERE id = ?", [imageUrl, id])
    .then(([result]) => result);

module.exports = {
  findDirectorById,
  editDirector,
  editDirectorImage,
};
