const db = require("../../database/client");

const findAllKinds = () => {
  return db.query(`SELECT * FROM genre WHERE name IS NOT NULL`, []);
};

const findAllKindsIdDesc = () => {
  return db.query(`SELECT * FROM genre order by id desc`, []);
};

const findAllMoviesByKinds = (genre) => {
  return db.query(
    "SELECT m.* FROM movies m JOIN movie_genre mg ON m.id = mg.movieId JOIN genre g ON mg.genreId = g.id WHERE g.name = ?",
    [genre]
  );
};

const findAllSortedAlpha = (genre) => {
  return db.query(
    "SELECT m.* FROM movies m JOIN movie_genre mg ON m.id = mg.movieId JOIN genre g ON mg.genreId = g.id WHERE g.name = ? ORDER BY m.title ASC;",
    [genre]
  );
};

const findAllSortedZeta = (genre) => {
  return db.query(
    "SELECT m.* FROM movies m JOIN movie_genre mg ON m.id = mg.movieId JOIN genre g ON mg.genreId = g.id WHERE g.name = ? ORDER BY m.title DESC",
    [genre]
  );
};

const findAllSortedYear = (genre) => {
  return db.query(
    "SELECT m.* FROM movies m JOIN movie_genre mg ON m.id = mg.movieId JOIN genre g ON mg.genreId = g.id WHERE g.name = ? ORDER BY m.year ASC",
    [genre]
  );
};

const findAllSortedYearDESC = (genre) => {
  return db.query(
    "SELECT m.* FROM movies m JOIN movie_genre mg ON m.id = mg.movieId JOIN genre g ON mg.genreId = g.id WHERE g.name = ? ORDER BY m.year DESC;",
    [genre]
  );
};

const findGenreByName = (name) => {
  return db.query("SELECT * FROM genre WHERE name = ?", [name]);
};

module.exports = {
  findAllKinds,
  findAllKindsIdDesc,
  findAllMoviesByKinds,
  findAllSortedAlpha,
  findAllSortedZeta,
  findAllSortedYear,
  findAllSortedYearDESC,
  findGenreByName,
};
