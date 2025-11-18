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

const findAllArtistIdDesc = () => {
  return db.query(
    `SELECT *
    FROM director
    order by id desc`,
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
        JOIN movie_director md ON m.id = md.movieId
        JOIN director d ON md.directorId = d.id
        WHERE d.id = ? AND d.name IS NOT NULL
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
  const query = `
    SELECT *
    FROM director
    WHERE SUBSTRING_INDEX(name, ' ', -1) LIKE ?
    ORDER BY SUBSTRING_INDEX(name, ' ', -1) ASC;
  `;
  return db.query(query, [`${letter}%`]);
};

const findDirectorByName = (name) => {
  return db.query("SELECT * FROM director WHERE name = ?", [name]);
};

const findDirectorById = (id) => {
  return db.query("SELECT * FROM director WHERE id = ?", [id]);
};

const findAllArtistFocusRandom = () => {
  return db.query(
    `SELECT *
     FROM director
     WHERE isFocus = 1
     ORDER BY RAND();`
  );
};

const findAllArtistFocusAsc = () => {
  return db.query(
    `SELECT *
     FROM director
     WHERE isFocus = 1
     ORDER BY SUBSTRING_INDEX(name, ' ', -1) ASC;`
  );
};

const findAllArtistFocusDesc = () => {
  return db.query(
    `SELECT *
     FROM director
     WHERE isFocus = 1
     ORDER BY SUBSTRING_INDEX(name, ' ', -1) DESC;`
  );
};

const findAllArtistFocusYearAsc = () => {
  return db.query(
    `SELECT *
     FROM director
     WHERE isFocus = 1
     ORDER BY birthDate ASC;`
  );
};

const findAllArtistFocusYearDesc = () => {
  return db.query(
    `SELECT *
     FROM director
     WHERE isFocus = 1
     ORDER BY birthDate DESC;`
  );
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
  findAllArtistIdDesc,
  findDirectorByName,
  findDirectorById,
  findAllArtistFocusRandom,
  findAllArtistFocusAsc,
  findAllArtistFocusDesc,
  findAllArtistFocusYearAsc,
  findAllArtistFocusYearDesc,
};
