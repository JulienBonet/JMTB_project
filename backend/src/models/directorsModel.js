const db = require("../../database/client");

const findAllArtistAsc = () => {
  return db.query(
    `SELECT * 
    FROM director
    WHERE name IS NOT NULL 
    ORDER BY SUBSTRING_INDEX(name, ' ', -1) ASC;`,
    []
  );
};

const findAllArtistDesc = () => {
  return db.query(
    `SELECT * 
      FROM director
      WHERE name IS NOT NULL 
      ORDER BY SUBSTRING_INDEX(name, ' ', -1) DESC;`,
    []
  );
};

const findAllMoviesByArtistId = (id) => {
  return db.query(
    `SELECT m.*
      FROM movies m
      JOIN movie_director md ON m.id = md.movieId
      JOIN director d ON md.directorId = d.id
      WHERE d.id = ? AND d.name IS NOT NULL;`,
    [id]
  );
};

const findAllMoviesByArtistIdAsc = (id) => {
  return db.query(
    `SELECT m.*
      FROM movies m
      JOIN movie_director md ON m.id = md.movieId
      JOIN director d ON md.directorId = d.id
      WHERE d.id = ? AND d.name IS NOT NULL
      ORDER BY m.title ASC;`,
    [id]
  );
};

const findAllMoviesByArtistIdDesc = (id) => {
  return db.query(
    `SELECT m.*
        FROM movies m
        JOIN movie_director md ON m.id = md.movieId
        JOIN director d ON md.directorId = d.id
        WHERE d.id = ? AND d.name IS NOT NULL
        ORDER BY m.title DESC;`,
    [id]
  );
};

const findAllMoviesByArtistIdYearAsc = (id) => {
  return db.query(
    `SELECT m.*
        FROM movies m
        JOIN movie_director md ON m.id = md.movieId
        JOIN director d ON md.directorId = d.id
        WHERE d.id = ? AND d.name IS NOT NULL
        ORDER BY m.year ASC;`,
    [id]
  );
};

const findAllMoviesByArtistIdYearDesc = (id) => {
  return db.query(
    `SELECT m.*
        FROM movies m
        JOIN movie_director md ON m.id = md.movieId
        JOIN director d ON md.directorId = d.id
        WHERE d.id = ? AND d.name IS NOT NULL
        ORDER BY m.year DESC;`,
    [id]
  );
};

const findAllByLetter = (letter) => {
  console.info("findAllByLetter function called with letter:", letter);
  const query = `
    SELECT *
    FROM director
    WHERE SUBSTRING_INDEX(name, ' ', -1) LIKE ?
    ORDER BY SUBSTRING_INDEX(name, ' ', -1) ASC;
  `;
  return db.query(query, [`${letter}%`]);
};

module.exports = {
  findAllArtistAsc,
  findAllArtistDesc,
  findAllMoviesByArtistId,
  findAllMoviesByArtistIdAsc,
  findAllMoviesByArtistIdDesc,
  findAllMoviesByArtistIdYearAsc,
  findAllMoviesByArtistIdYearDesc,
  findAllByLetter,
};
