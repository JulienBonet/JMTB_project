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

// EDIT STUDIO

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

// EDIT COUNTRY

const findCountryById = (id) =>
  db.query("SELECT * FROM country WHERE id = ?", [id]).then(([rows]) => rows);

const insertCountry = (name) =>
  db.query("INSERT INTO country (name) VALUES (?);", [name]);

const editCountry = async (name, id) => {
  const query = `
      UPDATE country SET name = ? WHERE id = ?
    `;

  const result = await db.query(query, [name, id]);

  return result;
};

const editCountryImage = (imageUrl, id) =>
  db
    .query("UPDATE country SET image = ? WHERE id = ?", [imageUrl, id])
    .then(([result]) => result);

const deleteCountry = (id) =>
  db.query("DELETE FROM country WHERE id = ?;", [id]);

// EDIT GENRE

const findGenreById = (id) =>
  db.query("SELECT * FROM genre WHERE id = ?", [id]).then(([rows]) => rows);

const insertGenre = (name) =>
  db.query("INSERT INTO genre (name) VALUES (?);", [name]);

const editGenre = async (name, id) => {
  const query = `
      UPDATE genre
      SET name = ?
      WHERE id = ?
    `;

  const result = await db.query(query, [name, id]);

  return result;
};

const deleteGenre = (id) => db.query("DELETE FROM genre WHERE id = ?;", [id]);

// EDIT LANGUAGE

const findLanguageById = (id) =>
  db.query("SELECT * FROM language WHERE id = ?", [id]).then(([rows]) => rows);

const insertLanguage = (name) =>
  db.query("INSERT INTO language (name) VALUES (?);", [name]);

const editLanguage = async (name, id) => {
  const query = `
      UPDATE language
      SET name = ?
      WHERE id = ?
    `;

  const result = await db.query(query, [name, id]);

  return result;
};

const deleteLanguage = (id) => db.query("DELETE FROM tag WHERE id = ?;", [id]);

// EDIT TAG

const findTagById = (id) =>
  db.query("SELECT * FROM tag WHERE id = ?", [id]).then(([rows]) => rows);

const insertTag = (name) =>
  db.query("INSERT INTO tag (name) VALUES (?);", [name]);

const editTag = async (name, id) => {
  const query = `
    UPDATE tag
    SET name = ?
    WHERE id = ?
  `;

  const result = await db.query(query, [name, id]);

  return result;
};

const deleteTag = (id) => db.query("DELETE FROM tag WHERE id = ?;", [id]);

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
  findCountryById,
  insertCountry,
  editCountry,
  editCountryImage,
  deleteCountry,
  findGenreById,
  insertGenre,
  editGenre,
  deleteGenre,
  findLanguageById,
  insertLanguage,
  editLanguage,
  deleteLanguage,
  findTagById,
  insertTag,
  editTag,
  deleteTag,
};
