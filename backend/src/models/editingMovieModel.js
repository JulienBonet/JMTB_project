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

// EDIT MOVIE_SCREENWRITER

const findMovieScreenwriter = (movieId, screenwriterId) =>
  db.query(
    "SELECT * FROM `movie_screenwriter` WHERE `movieId` = ? AND `screenwriterId` = ?",
    [movieId, screenwriterId]
  );

const addMovieScreenwriter = (movieId, screenwriterId) =>
  db.query(
    "INSERT INTO `movie_screenwriter` (`movieId`, `screenwriterId`) VALUES (? , ?);",
    [movieId, screenwriterId]
  );

// EDIT MOVIE_MUSIC

const findMovieMusic = (movieId, musicId) =>
  db.query(
    "SELECT * FROM `movie_music` WHERE `movieId` = ? AND `musicId` = ?",
    [movieId, musicId]
  );

const addMovieMusic = (movieId, musicId) =>
  db.query("INSERT INTO `movie_music` (`movieId`, `musicId`) VALUES (? , ?);", [
    movieId,
    musicId,
  ]);

// EDIT MOVIE_STUDIO

const findMovieStudio = (movieId, studioId) =>
  db.query(
    "SELECT * FROM `movie_studio` WHERE `movieId` = ? AND `studioId` = ?",
    [movieId, studioId]
  );

const addMovieStudio = (movieId, studioId) =>
  db.query(
    "INSERT INTO `movie_studio` (`movieId`, `studioId`) VALUES (? , ?);",
    [movieId, studioId]
  );

// EDIT MOVIE_COUNTRY

const findMovieCountry = (movieId, countryId) =>
  db.query(
    "SELECT * FROM `movie_country` WHERE `movieId` = ? AND `countryId` = ?",
    [movieId, countryId]
  );

const addMovieCountry = (movieId, countryId) =>
  db.query(
    "INSERT INTO `movie_country` (`movieId`, `countryId`) VALUES (? , ?);",
    [movieId, countryId]
  );

// EDIT MOVIE_LANGUAGE

const findMovieLanguage = (movieId, languageId) =>
  db.query(
    "SELECT * FROM `movie_language` WHERE `movieId` = ? AND `languageId` = ?",
    [movieId, languageId]
  );

const addMovieLanguage = (movieId, languageId) =>
  db.query(
    "INSERT INTO `movie_language` (`movieId`, `languageId`) VALUES (? , ?);",
    [movieId, languageId]
  );

// EDIT MOVIE_TAG

const findMovieTag = (movieId, tagId) =>
  db.query("SELECT * FROM `movie_tag` WHERE `movieId` = ? AND `tagId` = ?", [
    movieId,
    tagId,
  ]);

const addMovieTag = (movieId, tagId) =>
  db.query("INSERT INTO `movie_tag` (`movieId`, `tagId`) VALUES (? , ?);", [
    movieId,
    tagId,
  ]);

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
  findMovieScreenwriter,
  addMovieScreenwriter,
  findMovieMusic,
  addMovieMusic,
  findMovieStudio,
  addMovieStudio,
  findMovieCountry,
  addMovieCountry,
  findMovieLanguage,
  addMovieLanguage,
  findMovieTag,
  addMovieTag,
};
