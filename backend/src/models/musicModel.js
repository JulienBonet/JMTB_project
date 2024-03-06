const db = require("../../database/client");

const findAllArtistAsc = () => {
  return db.query(
    `SELECT * 
    FROM music
    WHERE name IS NOT NULL 
    ORDER BY SUBSTRING_INDEX(name, ' ', -1) ASC;`,
    []
  );
};

const findAllArtistDesc = () => {
  return db.query(
    `SELECT * 
    FROM music
    WHERE name IS NOT NULL 
    ORDER BY SUBSTRING_INDEX(name, ' ', -1) DESC;`,
    []
  );
};

const findAllMoviesByArtistId = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_music mm ON m.id = mm.movieId
    JOIN music mu ON mm.musicId = mu.id
    WHERE mu.id = ? AND mu.name IS NOT NULL`,
    [id]
  );
};

const findAllMoviesByArtistIdAsc = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_music mm ON m.id = mm.movieId
    JOIN music mu ON mm.musicId = mu.id
    WHERE mu.id = ? AND mu.name IS NOT NULL
      ORDER BY m.title ASC;`,
    [id]
  );
};

const findAllMoviesByArtistIdDesc = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_music mm ON m.id = mm.movieId
    JOIN music mu ON mm.musicId = mu.id
    WHERE mu.id = ? AND mu.name IS NOT NULL
        ORDER BY m.title DESC;`,
    [id]
  );
};

const findAllMoviesByArtistIdYearAsc = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_music mm ON m.id = mm.movieId
    JOIN music mu ON mm.musicId = mu.id
    WHERE mu.id = ? AND mu.name IS NOT NULL
        ORDER BY m.year ASC;`,
    [id]
  );
};

const findAllMoviesByArtistIdYearDesc = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_music mm ON m.id = mm.movieId
    JOIN music mu ON mm.musicId = mu.id
    WHERE mu.id = ? AND mu.name IS NOT NULL
        ORDER BY m.year DESC;`,
    [id]
  );
};

const findAllByLetter = (letter) => {
  const query = `
    SELECT *
    FROM music
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
  findAllByLetter, // Exportez la fonction findAllByLetter
};