const db = require("../../database/client");

const findAllFocusSortedNameAsc = () => {
  return db.query(
    `SELECT f.id, f.name, f.pitch, f.image, f.categoryId, fc.name AS category_name
     FROM focus f
     LEFT JOIN focuscategory fc ON f.categoryId = fc.id
     ORDER BY f.name ASC;`,
    []
  );
};

const findAllFocusSortedIdDesc = () => {
  return db.query(
    `SELECT f.id, f.name, f.pitch, f.image, f.categoryId, fc.name AS category_name
     FROM focus f
     LEFT JOIN focuscategory fc ON f.categoryId = fc.id
     ORDER BY f.id DESC;`,
    []
  );
};

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

const findAllFocusCategory = () => {
  return db.query(`SELECT * FROM focuscategory;`, []);
};

const findFocusCategoryById = (id) => {
  return db.query(`SELECT * FROM focuscategory WHERE id = ?;`, [id]);
};

const findFocusCategoryByName = (name) => {
  return db.query(`SELECT * FROM focuscategory WHERE name = ?;`, [name]);
};

module.exports = {
  findAllFocusSortedNameAsc,
  findAllFocusSortedIdDesc,
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
  findAllFocusCategory,
  findFocusCategoryById,
  findFocusCategoryByName,
};
