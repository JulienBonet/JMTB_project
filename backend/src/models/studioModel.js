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

const findAllMoviesByArtistIdDesc = (id) => {
  return db.query(
    `SELECT m.*
    FROM movies m
    JOIN movie_studio ms ON m.id = ms.movieId
    JOIN studio s ON ms.studioId = s.id
    WHERE s.id = ? AND s.name IS NOT NULL
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
