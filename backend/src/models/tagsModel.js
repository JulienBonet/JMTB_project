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
      ORDER BY 
      LOWER(
        CASE
          -- Français
          WHEN LOWER(m.title) LIKE 'le %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'la %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'les %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE "l'%" THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE "l’%" THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE 'un %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'une %' THEN SUBSTRING(m.title, 5)
          -- Anglais
          WHEN LOWER(m.title) LIKE 'the %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'a %' THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE 'an %' THEN SUBSTRING(m.title, 4)
          -- Espagnol
          WHEN LOWER(m.title) LIKE 'el %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'los %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'las %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'una %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'unos %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'unas %' THEN SUBSTRING(m.title, 5)
          -- Italien
          WHEN LOWER(m.title) LIKE 'il %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'lo %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'i %' THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE 'gli %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'uno %' THEN SUBSTRING(m.title, 4)
          -- Allemand
          WHEN LOWER(m.title) LIKE 'der %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'die %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'das %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'ein %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'eine %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'einen %' THEN SUBSTRING(m.title, 6)
          ELSE m.title
        END
      ) ASC;`,
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
      ORDER BY 
      LOWER(
        CASE
          -- Français
          WHEN LOWER(m.title) LIKE 'le %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'la %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'les %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE "l'%" THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE "l’%" THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE 'un %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'une %' THEN SUBSTRING(m.title, 5)
          -- Anglais
          WHEN LOWER(m.title) LIKE 'the %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'a %' THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE 'an %' THEN SUBSTRING(m.title, 4)
          -- Espagnol
          WHEN LOWER(m.title) LIKE 'el %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'los %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'las %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'una %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'unos %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'unas %' THEN SUBSTRING(m.title, 5)
          -- Italien
          WHEN LOWER(m.title) LIKE 'il %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'lo %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'i %' THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE 'gli %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'uno %' THEN SUBSTRING(m.title, 4)
          -- Allemand
          WHEN LOWER(m.title) LIKE 'der %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'die %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'das %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'ein %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'eine %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'einen %' THEN SUBSTRING(m.title, 6)
          ELSE m.title
        END
      ) DESC;`,
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
