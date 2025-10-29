const db = require("../../database/client");

const findAllTagAsc = () => {
  return db.query(
    `SELECT * 
    FROM tag
    WHERE name IS NOT NULL 
    ORDER BY name ASC;`,
    []
  );
};

const findAllTagDesc = () => {
  return db.query(
    `SELECT * 
      FROM tag
      WHERE name IS NOT NULL 
      ORDER BY name DESC;`,
    []
  );
};

const findAllTagIdDesc = () => {
  return db.query(`SELECT * FROM tag order by id desc`, []);
};

const findAllMoviesByTagId = (id) => {
  return db.query(
    `SELECT m.*
      FROM movies m
      JOIN movie_tag mt ON m.id = mt.movieId
      JOIN tag t ON mt.tagId = t.id
      WHERE t.id = ? AND t.name IS NOT NULL;`,
    [id]
  );
};

const findAllMoviesByTagIdAsc = (id) => {
  return db.query(
    `SELECT m.*
      FROM movies m
      JOIN movie_tag mt ON m.id = mt.movieId
      JOIN tag t ON mt.tagId = t.id
      WHERE t.id = ? AND t.name IS NOT NULL
      ORDER BY m.title ASC;`,
    [id]
  );
};

const findAllMoviesByTagIdDesc = (id) => {
  return db.query(
    `SELECT m.*
      FROM movies m
      JOIN movie_tag mt ON m.id = mt.movieId
      JOIN tag t ON mt.tagId = t.id
      WHERE t.id = ? AND t.name IS NOT NULL
      ORDER BY m.title DESC;`,
    [id]
  );
};

const findAllMoviesByTagIdYearAsc = (id) => {
  return db.query(
    `  SELECT m.*
      FROM movies m
      JOIN movie_tag mt ON m.id = mt.movieId
      JOIN tag t ON mt.tagId = t.id
      WHERE t.id = ? AND t.name IS NOT NULL
      ORDER BY m.year ASC;`,
    [id]
  );
};

const findAllMoviesByTagIdYearDesc = (id) => {
  return db.query(
    `SELECT m.*
      FROM movies m
      JOIN movie_tag mt ON m.id = mt.movieId
      JOIN tag t ON mt.tagId = t.id
      WHERE t.id = ? AND t.name IS NOT NULL
      ORDER BY m.year DESC;`,
    [id]
  );
};

const findAllByLetter = (letter) => {
  const query = `
  SELECT *
  FROM tag
  WHERE name Like ?
  ORDER BY name ASC;
  `;
  return db.query(query, [`${letter}%`]);
};

const findTagByName = (name) => {
  return db.query("SELECT * FROM tag WHERE name = ?", [name]);
};

const findTagById = (id) => {
  return db.query("SELECT * FROM tag WHERE id = ?", [id]);
};

module.exports = {
  findAllTagAsc,
  findAllTagDesc,
  findAllTagIdDesc,
  findAllMoviesByTagId,
  findAllMoviesByTagIdAsc,
  findAllMoviesByTagIdDesc,
  findAllMoviesByTagIdYearAsc,
  findAllMoviesByTagIdYearDesc,
  findAllByLetter,
  findTagByName,
  findTagById,
};
