const db = require("../../database/client");

const findAllArtistAsc = () => {
  return db.query(
    `SELECT * 
    FROM screenwriter
    WHERE name IS NOT NULL 
    ORDER BY SUBSTRING_INDEX(name, ' ', -1) ASC;`,
    []
  );
};

const findAllArtistDesc = () => {
  return db.query(
    `SELECT * 
    FROM screenwriter
    WHERE name IS NOT NULL 
    ORDER BY SUBSTRING_INDEX(name, ' ', -1) DESC;`,
    []
  );
};

const findAllArtistIdDesc = () => {
  return db.query(
    `SELECT *
    FROM screenwriter
    order by id desc`,
    []
  );
};

const findAllMoviesByArtistId = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_screenwriter ms ON m.id = ms.movieId
    JOIN screenwriter s ON ms.screenwriterId = s.id
    WHERE s.id = ? AND s.name IS NOT NULL`,
    [id]
  );
};

const findAllMoviesByArtistIdAsc = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_screenwriter ms ON m.id = ms.movieId
    JOIN screenwriter s ON ms.screenwriterId = s.id
    WHERE s.id = ? AND s.name IS NOT NULL
      ORDER BY m.title ASC;`,
    [id]
  );
};

const findAllMoviesByArtistIdDesc = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_screenwriter ms ON m.id = ms.movieId
    JOIN screenwriter s ON ms.screenwriterId = s.id
    WHERE s.id = ? AND s.name IS NOT NULL
        ORDER BY m.title DESC;`,
    [id]
  );
};

const findAllMoviesByArtistIdYearAsc = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_screenwriter ms ON m.id = ms.movieId
    JOIN screenwriter s ON ms.screenwriterId = s.id
    WHERE s.id = ? AND s.name IS NOT NULL
        ORDER BY m.year ASC;`,
    [id]
  );
};

const findAllMoviesByArtistIdYearDesc = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_screenwriter ms ON m.id = ms.movieId
    JOIN screenwriter s ON ms.screenwriterId = s.id
    WHERE s.id = ? AND s.name IS NOT NULL
        ORDER BY m.year DESC;`,
    [id]
  );
};

const findAllByLetter = (letter) => {
  const query = `
    SELECT *
    FROM screenwriter
    WHERE SUBSTRING_INDEX(name, ' ', -1) LIKE ?
    ORDER BY SUBSTRING_INDEX(name, ' ', -1) ASC;
  `;
  return db.query(query, [`${letter}%`]);
};

const findScreenwriterByName = (name) => {
  return db.query("SELECT * FROM screenwriter WHERE name = ?", [name]);
};

const findScreenwriterById = (id) => {
  return db.query("SELECT * FROM screenwriter WHERE id = ?", [id]);
};

module.exports = {
  findAllArtistAsc,
  findAllArtistDesc,
  findAllArtistIdDesc,
  findAllMoviesByArtistId,
  findAllMoviesByArtistIdAsc,
  findAllMoviesByArtistIdDesc,
  findAllMoviesByArtistIdYearAsc,
  findAllMoviesByArtistIdYearDesc,
  findAllByLetter,
  findScreenwriterByName,
  findScreenwriterById,
};
