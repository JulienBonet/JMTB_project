const db = require("../../database/client");

const findAllFocusByCategoryIdRandom = (id) => {
  return db.query(`SELECT * FROM focus WHERE categoryId = ? ORDER BY RAND();`, [
    id,
  ]);
};

const findAllFocusByCategoryIdAsc = (id) => {
  return db.query(
    `SELECT * FROM focus WHERE categoryId = ? ORDER BY name ASC;`,
    [id]
  );
};

const findAllFocusByCategoryIdDesc = (id) => {
  return db.query(
    `SELECT * FROM focus WHERE categoryId = ? ORDER BY name DESC;`,
    [id]
  );
};

const findAllMoviesByCategoryId = (id) => {
  return db.query(
    `SELECT m.* FROM movies m JOIN movie_focus mf ON mf.movieId = m.id WHERE mf.focusId = ?;`,
    [id]
  );
};

const findAllMoviesByCategoryIdAsc = (id) => {
  return db.query(
    `SELECT m.* FROM movies m JOIN movie_focus mf ON mf.movieId = m.id WHERE mf.focusId = ? ORDER BY m.title ASC;`,
    [id]
  );
};

const findAllMoviesByCategoryIdDesc = (id) => {
  return db.query(
    `SELECT m.* FROM movies m JOIN movie_focus mf ON mf.movieId = m.id WHERE mf.focusId = ? ORDER BY m.title DESC;`,
    [id]
  );
};

const findAllMoviesByCategoryIdYearAsc = (id) => {
  return db.query(
    `SELECT m.* FROM movies m JOIN movie_focus mf ON mf.movieId = m.id WHERE mf.focusId = ? ORDER BY m.year ASC;`,
    [id]
  );
};

const findAllMoviesByCategoryIdYearDesc = (id) => {
  return db.query(
    `SELECT m.* FROM movies m JOIN movie_focus mf ON mf.movieId = m.id WHERE mf.focusId = ? ORDER BY m.year DESC;`,
    [id]
  );
};

const findFocusByName = (name) => {
  return db.query(`SELECT * FROM focus WHERE name = ?;`, [name]);
};

const findFocusById = (id) => {
  return db.query(`SELECT * FROM focus WHERE id = ?;`, [id]);
};

module.exports = {
  findAllFocusByCategoryIdRandom,
  findAllFocusByCategoryIdAsc,
  findAllFocusByCategoryIdDesc,
  findAllMoviesByCategoryId,
  findAllMoviesByCategoryIdAsc,
  findAllMoviesByCategoryIdDesc,
  findAllMoviesByCategoryIdYearAsc,
  findAllMoviesByCategoryIdYearDesc,
  findFocusByName,
  findFocusById,
};
