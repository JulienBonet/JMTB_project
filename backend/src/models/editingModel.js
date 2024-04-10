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

// EDIT SCREENWRITER

const findScreenwriterById = (id) =>
  db
    .query("SELECT * FROM screenwriter WHERE id = ?", [id])
    .then(([rows]) => rows);

const insertScreenwriter = (name) =>
  db.query("INSERT INTO screenwriter (name) VALUES (?);", [name]);

const editScreenwriter = async (name, pitch, wikilink, imdblink, id) => {
  const query = `
        UPDATE screenwriter
        SET name = ?, pitch = ?, wikilink = ?, imdblink = ?
        WHERE id = ?
      `;

  const result = await db.query(query, [name, pitch, wikilink, imdblink, id]);

  return result;
};

const editScreenwriterImage = (imageUrl, id) =>
  db
    .query("UPDATE screenwriter SET image = ? WHERE id = ?", [imageUrl, id])
    .then(([result]) => result);

const deleteScreenwriter = (id) =>
  db.query("DELETE FROM screenwriter WHERE id = ?;", [id]);

// EDIT COMPOSITOR

const findCompositorById = (id) =>
  db.query("SELECT * FROM music WHERE id = ?", [id]).then(([rows]) => rows);

const insertCompositor = (name) =>
  db.query("INSERT INTO music (name) VALUES (?);", [name]);

const editCompositor = async (name, pitch, wikilink, imdblink, id) => {
  const query = `
        UPDATE music
        SET name = ?, pitch = ?, wikilink = ?, imdblink = ?
        WHERE id = ?
      `;

  const result = await db.query(query, [name, pitch, wikilink, imdblink, id]);

  return result;
};

const editCompositorImage = (imageUrl, id) =>
  db
    .query("UPDATE music SET image = ? WHERE id = ?", [imageUrl, id])
    .then(([result]) => result);

const deleteCompositor = (id) =>
  db.query("DELETE FROM music WHERE id = ?;", [id]);

// EDIT STDUIO

const findStudioById = (id) =>
  db.query("SELECT * FROM studio WHERE id = ?", [id]).then(([rows]) => rows);

const insertStudio = (name) =>
  db.query("INSERT INTO studio (name) VALUES (?);", [name]);

const editStudio = async (name, pitch, wikilink, imdblink, id) => {
  const query = `
      UPDATE studio
      SET name = ?, pitch = ?, wikilink = ?, imdblink = ?
      WHERE id = ?
    `;

  const result = await db.query(query, [name, pitch, wikilink, imdblink, id]);

  return result;
};

const editStudioImage = (imageUrl, id) =>
  db
    .query("UPDATE studio SET image = ? WHERE id = ?", [imageUrl, id])
    .then(([result]) => result);

const deleteStudio = (id) => db.query("DELETE FROM studio WHERE id = ?;", [id]);

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
  findScreenwriterById,
  insertScreenwriter,
  editScreenwriter,
  editScreenwriterImage,
  deleteScreenwriter,
  findCompositorById,
  insertCompositor,
  editCompositor,
  editCompositorImage,
  deleteCompositor,
  findStudioById,
  insertStudio,
  editStudio,
  editStudioImage,
  deleteStudio,
};
