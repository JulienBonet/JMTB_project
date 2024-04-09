const db = require("../../database/client");

// EDIT DIRECTOR

const findDirectorById = (id) =>
  db.query("SELECT * FROM director WHERE id = ?", [id]).then(([rows]) => rows);

const insertDirector = (name) =>
  db.query("INSERT INTO director (name) VALUES (?);", [name]);

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

const deleteDirector = (id) =>
  db.query("DELETE FROM director WHERE id = ?;", [id]);

// EDIT CASTING

const findCastingById = (id) =>
  db.query("SELECT * FROM casting WHERE id = ?", [id]).then(([rows]) => rows);

const insertCasting = (name) =>
  db.query("INSERT INTO casting (name) VALUES (?);", [name]);

const editCasting = async (name, pitch, wikilink, imdblink, id) => {
  const query = `
        UPDATE casting
        SET name = ?, pitch = ?, wikilink = ?, imdblink = ?
        WHERE id = ?
      `;

  const result = await db.query(query, [name, pitch, wikilink, imdblink, id]);

  return result;
};

const editCastingImage = (imageUrl, id) =>
  db
    .query("UPDATE casting SET image = ? WHERE id = ?", [imageUrl, id])
    .then(([result]) => result);

const deleteCasting = (id) =>
  db.query("DELETE FROM casting WHERE id = ?;", [id]);

module.exports = {
  findDirectorById,
  insertDirector,
  editDirector,
  editDirectorImage,
  deleteDirector,
  findCastingById,
  insertCasting,
  editCasting,
  editCastingImage,
  deleteCasting,
};
