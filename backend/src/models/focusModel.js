const db = require("../../database/client");

const findAllFocusSortedNameAsc = () => {
  return db.query(
    `SELECT f.id, f.name, f.pitch, f.image, f.categoryId, fc.name AS category_name
     FROM focus f
     LEFT JOIN focuscategory fc ON f.categoryId = fc.id
     ORDER BY f.name ASC;`,
    []
  );
};

const findAllFocusSortedIdDesc = () => {
  return db.query(
    `SELECT f.id, f.name, f.pitch, f.image, f.categoryId, fc.name AS category_name
     FROM focus f
     LEFT JOIN focuscategory fc ON f.categoryId = fc.id
     ORDER BY f.id DESC;`,
    []
  );
};

// const findAllFocusByCategoryIdRandom = (id) => {
//   return db.query(`SELECT * FROM focus WHERE categoryId = ? ORDER BY RAND();`, [
//     id,
//   ]);
// };

const findAllFocusByCategoryIdRandom = (id) => {
  return db.query(
    `SELECT f.*
     FROM focus AS f
     JOIN movie_focus AS mf ON mf.focusId = f.id
     WHERE f.categoryId = ?
     GROUP BY f.id
     HAVING COUNT(mf.movieId) > 0
     ORDER BY RAND();`,
    [id]
  );
};

const findAllFocusByCategoryIdAsc = (id) => {
  return db.query(
    `SELECT f.*
     FROM focus AS f
     JOIN movie_focus AS mf ON mf.focusId = f.id
     WHERE f.categoryId = ?
     GROUP BY f.id
     HAVING COUNT(mf.movieId) > 0
     ORDER BY 
       CASE
         WHEN LOWER(f.name) LIKE 'le %' THEN SUBSTRING(f.name, 4)
         WHEN LOWER(f.name) LIKE 'la %' THEN SUBSTRING(f.name, 4)
         WHEN LOWER(f.name) LIKE 'les %' THEN SUBSTRING(f.name, 5)
         WHEN LOWER(f.name) LIKE 'l'' %' THEN SUBSTRING(f.name, 3)
         WHEN LOWER(f.name) LIKE 'l’ %' THEN SUBSTRING(f.name, 3)
         WHEN LOWER(f.name) LIKE 'une %' THEN SUBSTRING(f.name, 5)
         ELSE f.name
       END ASC;`,
    [id]
  );
};

const findAllFocusByCategoryIdDesc = (id) => {
  return db.query(
    `SELECT f.*
     FROM focus AS f
     JOIN movie_focus AS mf ON mf.focusId = f.id
     WHERE f.categoryId = ?
     GROUP BY f.id
     HAVING COUNT(mf.movieId) > 0
     ORDER BY 
       CASE
         WHEN LOWER(f.name) LIKE 'le %' THEN SUBSTRING(f.name, 4)
         WHEN LOWER(f.name) LIKE 'la %' THEN SUBSTRING(f.name, 4)
         WHEN LOWER(f.name) LIKE 'les %' THEN SUBSTRING(f.name, 5)
         WHEN LOWER(f.name) LIKE 'l'' %' THEN SUBSTRING(f.name, 3)
         WHEN LOWER(f.name) LIKE 'l’ %' THEN SUBSTRING(f.name, 3)
         WHEN LOWER(f.name) LIKE 'une %' THEN SUBSTRING(f.name, 5)
         ELSE f.name
       END DESC;`,
    [id]
  );
};

const findAllMoviesByCategoryId = (id) => {
  return db.query(
    `SELECT m.* FROM movies m JOIN movie_focus mf ON mf.movieId = m.id WHERE mf.focusId = ?;`,
    [id]
  );
};

const findAllMoviesByCategoryIdAsc = (id) => {
  return db.query(
    `
    SELECT m.*
    FROM movies m
    JOIN movie_focus mf ON mf.movieId = m.id
    WHERE mf.focusId = ?
    ORDER BY 
      LOWER(
        CASE
          -- Français
          WHEN LOWER(m.title) LIKE 'le %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'la %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'les %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE "l'%" THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE "l’%" THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE 'un %' THEN SUBSTRING(m.title, 3)
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
      ) ASC;
    `,
    [id]
  );
};

const findAllMoviesByCategoryIdDesc = (id) => {
  return db.query(
    `
    SELECT m.*
    FROM movies m
    JOIN movie_focus mf ON mf.movieId = m.id
    WHERE mf.focusId = ?
 ORDER BY 
      LOWER(
        CASE
          -- Français
          WHEN LOWER(m.title) LIKE 'le %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'la %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'les %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE "l'%" THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE "l’%" THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE 'un %' THEN SUBSTRING(m.title, 3)
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
      ) DESC;
    `,
    [id]
  );
};

const findAllMoviesByCategoryIdYearAsc = (id) => {
  return db.query(
    `SELECT m.* FROM movies m JOIN movie_focus mf ON mf.movieId = m.id WHERE mf.focusId = ? ORDER BY m.year ASC;`,
    [id]
  );
};

const findAllMoviesByCategoryIdYearDesc = (id) => {
  return db.query(
    `SELECT m.* FROM movies m JOIN movie_focus mf ON mf.movieId = m.id WHERE mf.focusId = ? ORDER BY m.year DESC;`,
    [id]
  );
};

const findFocusByName = (name) => {
  return db.query(`SELECT * FROM focus WHERE name = ?;`, [name]);
};

const findFocusById = (id) => {
  return db.query(`SELECT * FROM focus WHERE id = ?;`, [id]);
};

const findAllFocusCategory = () => {
  return db.query(`SELECT * FROM focuscategory;`, []);
};

const findFocusCategoryById = (id) => {
  return db.query(`SELECT * FROM focuscategory WHERE id = ?;`, [id]);
};

const findFocusCategoryByName = (name) => {
  return db.query(`SELECT * FROM focuscategory WHERE name = ?;`, [name]);
};

module.exports = {
  findAllFocusSortedNameAsc,
  findAllFocusSortedIdDesc,
  findAllFocusByCategoryIdRandom,
  findAllFocusByCategoryIdAsc,
  findAllFocusByCategoryIdDesc,
  findAllMoviesByCategoryId,
  findAllMoviesByCategoryIdAsc,
  findAllMoviesByCategoryIdDesc,
  findAllMoviesByCategoryIdYearAsc,
  findAllMoviesByCategoryIdYearDesc,
  findFocusByName,
  findFocusById,
  findAllFocusCategory,
  findFocusCategoryById,
  findFocusCategoryByName,
};
