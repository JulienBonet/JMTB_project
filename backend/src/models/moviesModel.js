const db = require("../../database/client");

const findAll = (orderBy = "id", orderDir = "DESC") => {
  return db.query(`SELECT * FROM movies ORDER BY ${orderBy} ${orderDir}`, []);
};

const findAllSortedNoX = () => {
  return db.query(
    `SELECT *
    FROM movies
    WHERE id NOT IN (SELECT movieId FROM jmdb.movie_genre WHERE genreId = 24);`,
    []
  );
};

// const findById = (id) => {
//   return db.query(
//     `SELECT movies.*,
//     director.name AS director_name,
//     GROUP_CONCAT(DISTINCT CONCAT(casting.name, ', ') SEPARATOR '') AS cast,
//     GROUP_CONCAT(DISTINCT CONCAT(genre.name, ', ') SEPARATOR '') AS genres,
//     GROUP_CONCAT(DISTINCT CONCAT(country.name, ',') SEPARATOR '') AS countries,
//     GROUP_CONCAT(DISTINCT CONCAT(language.name, ', ') SEPARATOR '') AS languages,
//     GROUP_CONCAT(DISTINCT CONCAT(music.name, ', ') SEPARATOR '') AS music,
//     GROUP_CONCAT(DISTINCT CONCAT(screenwriter.name, ', ') SEPARATOR '') AS screenwriters,
//     GROUP_CONCAT(DISTINCT CONCAT(studio.name, ', ') SEPARATOR '') AS studios
//   FROM movies
//   LEFT JOIN movie_director ON movies.id = movie_director.movieId
//   LEFT JOIN director ON movie_director.directorId = director.id
//   LEFT JOIN movie_casting ON movies.id = movie_casting.movieId
//   LEFT JOIN casting ON movie_casting.castingId = casting.id
//   LEFT JOIN movie_genre ON movies.id = movie_genre.movieId
//   LEFT JOIN genre ON movie_genre.genreId = genre.id
//   LEFT JOIN movie_country ON movies.id = movie_country.movieId
//   LEFT JOIN country ON movie_country.countryId = country.id
//   LEFT JOIN movie_language ON movies.id = movie_language.movieId
//   LEFT JOIN language ON movie_language.languageId = language.id
//   LEFT JOIN movie_music ON movies.id = movie_music.movieId
//   LEFT JOIN music ON movie_music.musicId = music.id
//   LEFT JOIN movie_screenwriter ON movies.id = movie_screenwriter.movieId
//   LEFT JOIN screenwriter ON movie_screenwriter.screenwriterId = screenwriter.id
//   LEFT JOIN movie_studio ON movies.id = movie_studio.movieId
//   LEFT JOIN studio ON movie_studio.studioId = studio.id
//   WHERE movies.id = ?
//   GROUP BY movies.id, movies.title, movies.altTitle, movies.year, movies.duration, movies.cover, movies.trailer, movies.pitch, movies.story, movies.location, movies.videoFormat, movies.comment, movies.videoSupport, movies.fileSize, movies.idTheMovieDb, movies.idIMDb, director.name;
//   `,
//     [id]
//   );
// };

const findById = (id) => {
  return db.query(
    `SELECT movies.*,
    GROUP_CONCAT(DISTINCT director.name SEPARATOR ', ') AS directors,
    GROUP_CONCAT(DISTINCT casting.name SEPARATOR ', ') AS cast,
    GROUP_CONCAT(DISTINCT genre.name SEPARATOR ', ') AS genres,
    GROUP_CONCAT(DISTINCT country.name SEPARATOR ', ') AS countries,
    GROUP_CONCAT(DISTINCT language.name SEPARATOR ', ') AS languages,
    GROUP_CONCAT(DISTINCT music.name SEPARATOR ', ') AS music,
    GROUP_CONCAT(DISTINCT screenwriter.name SEPARATOR ', ') AS screenwriters,
    GROUP_CONCAT(DISTINCT studio.name SEPARATOR ', ') AS studios
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
GROUP BY movies.id, movies.title, movies.altTitle, movies.year, movies.duration, movies.cover, movies.trailer, movies.pitch, movies.story, movies.location, movies.videoFormat, movies.comment, movies.videoSupport, movies.fileSize, movies.idTheMovieDb, movies.idIMDb;
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
  return db.query("SELECT * FROM movies WHERE year LIKE ?;", [`${year}%`]);
};

const findByYearSortedA = (year) => {
  return db.query(
    "SELECT * FROM movies WHERE year LIKE ? ORDER BY title ASC;",
    [`${year}%`]
  );
};

const findByYearSortedZ = (year) => {
  return db.query(
    "SELECT * FROM movies WHERE year LIKE ? ORDER BY title DESC;",
    [`${year}%`]
  );
};

const findAllCountry = () => {
  return db.query(
    "SELECT id, name FROM country WHERE name IS NOT NULL ORDER BY name ASC;"
  );
};

const findAllCountryIdDesc = () => {
  return db.query("SELECT * FROM country order by id desc;");
};

const findByCountry = (id) => {
  return db.query(
    "SELECT * FROM movies AS m JOIN movie_country AS mc ON m.id = mc.movieId JOIN country AS c ON c.id = mc.countryId WHERE c.id = ?;",
    [id]
  );
};

const findByCountrySortedAlpha = (id) => {
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

const findAllDecades = () => {
  return db.query(
    "SELECT DISTINCT FLOOR(year / 10) * 10 AS decade FROM movies WHERE year IS NOT NULL ORDER BY decade DESC;"
  );
};

const findMoviesByDecade = (decade) => {
  return db.query("SELECT * FROM movies WHERE FLOOR(year / 10) * 10 = ?;", [
    decade,
  ]);
};

const findAllForSearchFilter = () => {
  return db.query(
    "SELECT movies.*, GROUP_CONCAT(DISTINCT genre.name SEPARATOR ', ') AS genres, GROUP_CONCAT(DISTINCT country.name SEPARATOR ', ') AS countries FROM movies LEFT JOIN movie_genre ON movies.id = movie_genre.movieId LEFT JOIN genre ON movie_genre.genreId = genre.id LEFT JOIN movie_country ON movies.id = movie_country.movieId LEFT JOIN country ON movie_country.countryId = country.id GROUP BY movies.id, movies.title, movies.altTitle, movies.year, movies.duration, movies.cover, movies.trailer, movies.pitch, movies.story, movies.location, movies.videoFormat, movies.comment, movies.videoSupport, movies.fileSize, movies.idTheMovieDb, movies.idIMDb ORDER BY movies.id DESC;"
  );
};

module.exports = {
  findAll,
  findById,
  // findAllSortedAlpha,
  // findAllSortedZeta,
  // findAllSortedYear,
  // findAllSortedYearDESC,
  findAllSortedNoX,
  findAllYears,
  findAllCountry,
  findAllCountryIdDesc,
  findByCountry,
  findByCountrySortedAlpha,
  findByCountrySortedZeta,
  findByCountrySortedYearAsc,
  findByCountrySortedYearDesc,
  findByYear,
  findByYearSortedA,
  findByYearSortedZ,
  findAllDecades,
  findMoviesByDecade,
  findAllForSearchFilter,
};
