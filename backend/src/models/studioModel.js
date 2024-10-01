const db = require("../../database/client");

const findAllArtistAsc = () => {
  return db.query(
    `SELECT * 
    FROM studio
    WHERE name IS NOT NULL 
    ORDER BY SUBSTRING_INDEX(name, ' ', -1) ASC;`,
    []
  );
};

const findAllArtistDesc = () => {
  return db.query(
    `SELECT * 
    FROM studio
    WHERE name IS NOT NULL 
    ORDER BY SUBSTRING_INDEX(name, ' ', -1) DESC;`,
    []
  );
};

const findAllArtistIdDesc = () => {
  return db.query(
    `SELECT *
    FROM studio
    order by id desc`,
    []
  );
};

const findAllMoviesByArtistId = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_studio ms ON m.id = ms.movieId
    JOIN studio s ON ms.studioId = s.id
    WHERE s.id = ? AND s.name IS NOT NULL`,
    [id]
  );
};

const findAllMoviesByArtistIdAsc = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_studio ms ON m.id = ms.movieId
    JOIN studio s ON ms.studioId = s.id
    WHERE s.id = ? AND s.name IS NOT NULL
      ORDER BY m.title ASC;`,
    [id]
  );
};

const findAllMoviesByArtistIdDesc = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_studio ms ON m.id = ms.movieId
    JOIN studio s ON ms.studioId = s.id
    WHERE s.id = ? AND s.name IS NOT NULL
        ORDER BY m.title DESC;`,
    [id]
  );
};

const findAllMoviesByArtistIdYearAsc = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_studio ms ON m.id = ms.movieId
    JOIN studio s ON ms.studioId = s.id
    WHERE s.id = ? AND s.name IS NOT NULL
        ORDER BY m.year ASC;`,
    [id]
  );
};

const findAllMoviesByArtistIdYearDesc = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_studio ms ON m.id = ms.movieId
    JOIN studio s ON ms.studioId = s.id
    WHERE s.id = ? AND s.name IS NOT NULL
        ORDER BY m.year DESC;`,
    [id]
  );
};

const findAllByLetter = (letter) => {
  const query = `
  SELECT *
  FROM studio
  WHERE name Like ?
  ORDER BY name ASC;
  `;
  return db.query(query, [`${letter}%`]);
};

const findStudioByName = (name) => {
  return db.query("SELECT * FROM studio WHERE name = ?", [name]);
};

const findStudioById = (id) => {
  return db.query("SELECT * FROM studio WHERE id = ?", [id]);
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
  findStudioByName,
  findStudioById,
};
