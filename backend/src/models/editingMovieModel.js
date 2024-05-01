const db = require("../../database/client");

const insertMovie = (
  title,
  altTitle,
  year,
  duration,
  trailer,
  pitch,
  story,
  location,
  videoFormat,
  videoSupport,
  fileSize,
  idTheMovieDb,
  idIMDb
) =>
  db.query(
    "INSERT INTO movies (title, altTitle, year, duration, trailer, pitch, story, location, videoFormat, videoSupport, fileSize, idTheMovieDb, idIMDb) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
    [
      title,
      altTitle,
      year,
      duration,
      trailer,
      pitch,
      story,
      location,
      videoFormat,
      videoSupport,
      fileSize,
      idTheMovieDb,
      idIMDb,
    ]
  );

const getLastInsertedMovieId = () =>
  db.query("SELECT LAST_INSERT_ID() AS movieId");

const eraseMovie = (id) => db.query("DELETE FROM movies WHERE id = ?", [id]);

// EDIT MOVIE_GENRE

const findMovieKind = (movieId, genreId) =>
  db.query(
    "SELECT * FROM `movie_genre` WHERE `movieId` = ? AND `genreId` = ?",
    [movieId, genreId]
  );

const addMovieKind = (movieId, genreId) =>
  db.query("INSERT INTO `movie_genre` (`movieId`, `genreId`) VALUES (? , ?);", [
    movieId,
    genreId,
  ]);

// EDIT MOVIE_DIRECTOR

const findMovieDirector = (movieId, directorId) =>
  db.query(
    "SELECT * FROM `movie_director` WHERE `movieId` = ? AND `directorId` = ?",
    [movieId, directorId]
  );

const addMovieDirector = (movieId, directorId) =>
  db.query(
    "INSERT INTO `movie_director` (`movieId`, `directorId`) VALUES (? , ?);",
    [movieId, directorId]
  );

// EDIT MOVIE_CASTING

const findMovieCasting = (movieId, castingId) =>
  db.query(
    "SELECT * FROM `movie_casting` WHERE `movieId` = ? AND `castingId` = ?",
    [movieId, castingId]
  );

const addMovieCasting = (movieId, castingId) =>
  db.query(
    "INSERT INTO `movie_casting` (`movieId`, `castingId`) VALUES (? , ?);",
    [movieId, castingId]
  );

module.exports = {
  insertMovie,
  getLastInsertedMovieId,
  eraseMovie,
  findMovieKind,
  addMovieKind,
  findMovieDirector,
  addMovieDirector,
  findMovieCasting,
  addMovieCasting,
};
