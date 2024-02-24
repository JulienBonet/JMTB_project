const db = require("../../database/client");

const findAllDirectorsAsc = () => {
  return db.query(
    `SELECT * 
    FROM director 
    ORDER BY SUBSTRING_INDEX(name, ' ', -1) ASC;`,
    []
  );
};

const findAllfindAllDirectorsDesc = () => {
  return db.query(
    `SELECT * 
      FROM director 
      ORDER BY SUBSTRING_INDEX(name, ' ', -1) DESC;`,
    []
  );
};

const findAllMoviesByDirectorId = (id) => {
  return db.query(
    `SELECT m.*
      FROM movies m
      JOIN movie_director md ON m.id = md.movieId
      JOIN director d ON md.directorId = d.id
      WHERE d.id = ?;`,
    [id]
  );
};

const findAllMoviesByDirectorIdAsc = (id) => {
  return db.query(
    `SELECT m.*
      FROM movies m
      JOIN movie_director md ON m.id = md.movieId
      JOIN director d ON md.directorId = d.id
      WHERE d.id = ?
      ORDER BY m.title ASC;`,
    [id]
  );
};

const findAllMoviesByDirectorIdDesc = (id) => {
  return db.query(
    `SELECT m.*
        FROM movies m
        JOIN movie_director md ON m.id = md.movieId
        JOIN director d ON md.directorId = d.id
        WHERE d.id = ?
        ORDER BY m.title DESC;`,
    [id]
  );
};

const findAllMoviesByDirectorIdYearAsc = (id) => {
  return db.query(
    `SELECT m.*
        FROM movies m
        JOIN movie_director md ON m.id = md.movieId
        JOIN director d ON md.directorId = d.id
        WHERE d.id = ?
        ORDER BY m.year ASC;`,
    [id]
  );
};

const findAllMoviesByDirectorIdYearDesc = (id) => {
  return db.query(
    `SELECT m.*
        FROM movies m
        JOIN movie_director md ON m.id = md.movieId
        JOIN director d ON md.directorId = d.id
        WHERE d.id = ?
        ORDER BY m.year DESC;`,
    [id]
  );
};

module.exports = {
  findAllDirectorsAsc,
  findAllfindAllDirectorsDesc,
  findAllMoviesByDirectorId,
  findAllMoviesByDirectorIdAsc,
  findAllMoviesByDirectorIdDesc,
  findAllMoviesByDirectorIdYearAsc,
  findAllMoviesByDirectorIdYearDesc,
};
