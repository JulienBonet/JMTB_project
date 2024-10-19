const db = require("../../database/client");

// EDIT DIRECTOR

const findDirectorById = (id) =>
  db.query("SELECT * FROM director WHERE id = ?", [id]).then(([rows]) => rows);

const findDirectorByName = (name) =>
  db.query("SELECT * FROM director WHERE name = ?", [name]);

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

const findCastingByName = (name) =>
  db.query("SELECT * FROM casting WHERE name = ?", [name]);

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

const findScreenwriterByName = (name) =>
  db.query("SELECT * FROM screenwriter WHERE name = ?", [name]);

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

const findCompositorByName = (name) =>
  db.query("SELECT * FROM music WHERE name = ?", [name]);

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

// const findStudioByName = (name) =>
//   db.query("SELECT * FROM studio WHERE name = ?", [name]);
const findStudioByName = async (name) => {
  const [rows] = await db.query("SELECT id FROM studio WHERE name = ?", [name]);
  return rows.length > 0 ? rows[0].id : null;
};

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

// EDIT THEMA

const findThemaById = (id) =>
  db.query("SELECT * FROM thema WHERE id = ?", [id]).then(([rows]) => rows);

const insertThema = (name) =>
  db.query("INSERT INTO thema (name) VALUES (?);", [name]);

const editThema = async (name, pitch, id) => {
  const query = `
        UPDATE thema
        SET name = ?, pitch = ?
        WHERE id = ?
      `;

  const result = await db.query(query, [name, pitch, id]);

  return result;
};

const editThemaImage = (imageUrl, id) =>
  db
    .query("UPDATE thema SET image = ? WHERE id = ?", [imageUrl, id])
    .then(([result]) => result);

const deleteThema = (id) => db.query("DELETE FROM thema WHERE id = ?;", [id]);

// EDIT COUNTRY

const findCountryById = (id) =>
  db.query("SELECT * FROM country WHERE id = ?", [id]).then(([rows]) => rows);

const findCountryByName = (name) =>
  db.query("SELECT * FROM country WHERE name = ?", [name]);

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

const findGenreByName = (name) => {
  db.query("SELECT * FROM genre WHERE name = ?", [name])
    .then(([rows]) => {
      console.info(`SQL results: ${JSON.stringify(rows)}`);
      return rows;
    })
    .catch((err) => {
      console.error(`Error executing SQL query: ${err}`);
      throw err;
    });
};

const findGenreById = (id) =>
  db.query("SELECT * FROM genre WHERE id = ?", [id]).then(([rows]) => rows);

const insertGenre = async (name) => {
  console.info("name in insert genre", name);
  const [result] = await db.query("INSERT INTO genre (name) VALUES (?);", [
    name,
  ]);
  console.info("Result from INSERT query:", result);
  return { insertId: result.insertId };
};

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

const findLanguageByName = (name) =>
  db.query("SELECT * FROM language WHERE name = ?", [name]);

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

const deleteLanguage = (id) =>
  db.query("DELETE FROM language WHERE id = ?;", [id]);

// EDIT TAG

// const findTagById = (id) =>
//   db.query("SELECT * FROM tag WHERE id = ?", [id]).then(([rows]) => rows);
const findTagById = async (tagId) => {
  const [rows] = await db.query("SELECT id FROM tag WHERE id = ?", [tagId]);
  return rows.length > 0 ? rows[0].id : null;
};

const findTagByName = (name) =>
  db.query("SELECT * FROM tag WHERE name = ?", [name]);

const findTagByNameInBackend = async (name) => {
  const [results] = await db.query("SELECT * FROM tag WHERE name = ?", [name]);
  return results.length > 0 ? results[0] : null; // Retourne le premier tag trouvé ou null
};

// const insertTag = (name) =>
//   db.query("INSERT INTO tag (name) VALUES (?);", [name]);
const insertTag = (name) =>
  db.query("INSERT INTO tag (name) VALUES (?);", [name]).then((result) => {
    return result; // Assurez-vous de retourner le résultat ici
  });

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
  findDirectorByName,
  insertDirector,
  editDirector,
  editDirectorImage,
  deleteDirector,
  findCastingById,
  findCastingByName,
  insertCasting,
  editCasting,
  editCastingImage,
  deleteCasting,
  findScreenwriterById,
  findScreenwriterByName,
  insertScreenwriter,
  editScreenwriter,
  editScreenwriterImage,
  deleteScreenwriter,
  findCompositorById,
  findCompositorByName,
  insertCompositor,
  editCompositor,
  editCompositorImage,
  deleteCompositor,
  findStudioById,
  findStudioByName,
  insertStudio,
  editStudio,
  editStudioImage,
  deleteStudio,
  findThemaById,
  insertThema,
  editThema,
  editThemaImage,
  deleteThema,
  findCountryById,
  findCountryByName,
  insertCountry,
  editCountry,
  editCountryImage,
  deleteCountry,
  findGenreByName,
  findGenreById,
  insertGenre,
  editGenre,
  deleteGenre,
  findLanguageById,
  findLanguageByName,
  insertLanguage,
  editLanguage,
  deleteLanguage,
  findTagById,
  findTagByName,
  findTagByNameInBackend,
  insertTag,
  editTag,
  deleteTag,
};
