const db = require("../../database/client");

const findAllKinds = () => {
  return db.query(`SELECT * FROM genre WHERE genre IS NOT NULL`, []);
};

const findAllMoviesByKinds = (genre) => {
  return db.query(
    "SELECT m.* FROM movies m JOIN movie_genre mg ON m.id = mg.movieId JOIN genre g ON mg.genreId = g.id WHERE g.genre = ?",
    [genre]
  );
};

const findAllSortedAlpha = (genre) => {
  return db.query(
    "SELECT m.* FROM movies m JOIN movie_genre mg ON m.id = mg.movieId JOIN genre g ON mg.genreId = g.id WHERE g.genre = ? ORDER BY m.title ASC;",
    [genre]
  );
};

const findAllSortedZeta = (genre) => {
  return db.query(
    "SELECT m.* FROM movies m JOIN movie_genre mg ON m.id = mg.movieId JOIN genre g ON mg.genreId = g.id WHERE g.genre = ? ORDER BY m.title DESC",
    [genre]
  );
};

const findAllSortedYear = (genre) => {
  return db.query(
    "SELECT m.* FROM movies m JOIN movie_genre mg ON m.id = mg.movieId JOIN genre g ON mg.genreId = g.id WHERE g.genre = ? ORDER BY m.year ASC",
    [genre]
  );
};

const findAllSortedYearDESC = (genre) => {
  return db.query(
    "SELECT m.* FROM movies m JOIN movie_genre mg ON m.id = mg.movieId JOIN genre g ON mg.genreId = g.id WHERE g.genre = ? ORDER BY m.year DESC;",
    [genre]
  );
};

module.exports = {
  findAllKinds,
  findAllMoviesByKinds,
  findAllSortedAlpha,
  findAllSortedZeta,
  findAllSortedYear,
  findAllSortedYearDESC,
};
