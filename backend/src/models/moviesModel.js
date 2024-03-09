const db = require("../../database/client");

const findAll = () => {
  return db.query(`SELECT * FROM movies`, []);
};

const findAllSortedAlpha = () => {
  return db.query("SELECT * FROM movies ORDER BY title ASC", []);
};

const findAllSortedZeta = () => {
  return db.query("SELECT * FROM movies ORDER BY title DESC", []);
};

const findAllSortedYear = () => {
  return db.query("SELECT * FROM movies ORDER BY year ASC", []);
};

const findAllSortedYearDESC = () => {
  return db.query("SELECT * FROM movies ORDER BY year DESC;", []);
};

const findAllSortedNoX = () => {
  return db.query(
    `SELECT *
    FROM movies
    WHERE id NOT IN (SELECT movieId FROM jmdb.movie_genre WHERE genreId = 24);`,
    []
  );
};

const findById = (id) => {
  return db.query(
    `SELECT movies.*,
    director.name AS director_name,
    GROUP_CONCAT(DISTINCT CONCAT(casting.name, ', ') SEPARATOR '') AS cast,
    GROUP_CONCAT(DISTINCT CONCAT(genre.genre, ', ') SEPARATOR '') AS genres,
    GROUP_CONCAT(DISTINCT CONCAT(country.name, ',') SEPARATOR '') AS countries,
    GROUP_CONCAT(DISTINCT CONCAT(language.language, ', ') SEPARATOR '') AS languages,
    GROUP_CONCAT(DISTINCT CONCAT(music.name, ', ') SEPARATOR '') AS music,
    GROUP_CONCAT(DISTINCT CONCAT(screenwriter.name, ', ') SEPARATOR '') AS screenwriters,
    GROUP_CONCAT(DISTINCT CONCAT(studio.name, ', ') SEPARATOR '') AS studios
  FROM movies
  LEFT JOIN movie_director ON movies.id = movie_director.movieId
  LEFT JOIN director ON movie_director.directorId = director.id
  LEFT JOIN movie_casting ON movies.id = movie_casting.movieId
  LEFT JOIN casting ON movie_casting.castingId = casting.id
  LEFT JOIN movie_genre ON movies.id = movie_genre.movieId
  LEFT JOIN genre ON movie_genre.genreId = genre.id
  LEFT JOIN movie_country ON movies.id = movie_country.movieId
  LEFT JOIN country ON movie_country.countryId = country.id
  LEFT JOIN movie_language ON movies.id = movie_language.movieId
  LEFT JOIN language ON movie_language.languageId = language.id
  LEFT JOIN movie_music ON movies.id = movie_music.movieId
  LEFT JOIN music ON movie_music.musicId = music.id
  LEFT JOIN movie_screenwriter ON movies.id = movie_screenwriter.movieId
  LEFT JOIN screenwriter ON movie_screenwriter.screenwriterId = screenwriter.id
  LEFT JOIN movie_studio ON movies.id = movie_studio.movieId
  LEFT JOIN studio ON movie_studio.studioId = studio.id
  WHERE movies.id = ?
  GROUP BY movies.id, movies.title, movies.altTitle, movies.year, movies.duration, movies.cover, movies.trailer, movies.pitch, movies.story, movies.location, movies.videoFormat, movies.comment, movies.videoSupport, movies.fileSize, movies.idTheMovieDb, movies.idIMDb, director.name;
  `,
    [id]
  );
};

const findAllYears = () => {
  return db.query(
    "SELECT DISTINCT year FROM movies WHERE year IS NOT NULL ORDER BY year DESC;"
  );
};

const findByYear = (year) => {
  return db.query(
    "SELECT * FROM movies WHERE year LIKE ? ORDER BY title ASC;",
    [`${year}%`]
  );
};

const findAllCountry = () => {
  return db.query(
    "SELECT id, name FROM country WHERE name IS NOT NULL ORDER BY name ASC;"
  );
};

const findByCountry = (id) => {
  return db.query(
    "SELECT * FROM movies AS m JOIN movie_country AS mc ON m.id = mc.movieId JOIN country AS c ON c.id = mc.countryId WHERE c.id = ? ORDER BY title ASC;",
    [id]
  );
};

const findByCountrySortedZeta = (id) => {
  return db.query(
    "SELECT * FROM movies AS m JOIN movie_country AS mc ON m.id = mc.movieId JOIN country AS c ON c.id = mc.countryId WHERE c.id = ? ORDER BY title DESC;",
    [id]
  );
};

const findByCountrySortedYearAsc = (id) => {
  return db.query(
    "SELECT * FROM movies AS m JOIN movie_country AS mc ON m.id = mc.movieId JOIN country AS c ON c.id = mc.countryId WHERE c.id = ? ORDER BY year ASC;",
    [id]
  );
};

const findByCountrySortedYearDesc = (id) => {
  return db.query(
    "SELECT * FROM movies AS m JOIN movie_country AS mc ON m.id = mc.movieId JOIN country AS c ON c.id = mc.countryId WHERE c.id = ? ORDER BY year DESC;",
    [id]
  );
};

module.exports = {
  findAll,
  findById,
  findAllSortedAlpha,
  findAllSortedZeta,
  findAllSortedYear,
  findAllSortedYearDESC,
  findAllSortedNoX,
  findByYear,
  findAllYears,
  findAllCountry,
  findByCountry,
  findByCountrySortedZeta,
  findByCountrySortedYearAsc,
  findByCountrySortedYearDesc,
};
