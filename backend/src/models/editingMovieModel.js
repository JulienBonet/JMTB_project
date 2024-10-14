const db = require("../../database/client");

const insertMovie = (
  title,
  altTitle,
  year,
  duration,
  cover,
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
    "INSERT INTO movies (title, altTitle, year, duration, cover, trailer, pitch, story, location, videoFormat, videoSupport, fileSize, idTheMovieDb, idIMDb) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
    [
      title,
      altTitle,
      year,
      duration,
      cover,
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

const updateMovie = (
  title,
  altTitle,
  year,
  duration,
  trailer,
  story,
  location,
  videoFormat,
  videoSupport,
  fileSize,
  id
) =>
  db.query(
    "UPDATE movies SET title = ?, altTitle = ?, year = ?, duration = ?, trailer = ?, story = ?, location = ?, videoFormat = ?, videoSupport = ?, fileSize = ? WHERE id = ?",
    [
      title,
      altTitle,
      year,
      duration,
      trailer,
      story,
      location,
      videoFormat,
      videoSupport,
      fileSize,
      id,
    ]
  );

const updateMovieImage = (imageUrl, id) =>
  db
    .query("UPDATE movies SET cover = ? WHERE id = ?", [imageUrl, id])
    .then(([result]) => result);

const getLastInsertedMovieId = () =>
  db.query("SELECT LAST_INSERT_ID() AS movieId");

const findMovieById = async (id) => {
  const [result] = await db.query("SELECT * FROM movies WHERE id = ?", [id]);
  return result;
};

const eraseMovie = (id) => db.query("DELETE FROM movies WHERE id = ?", [id]);

// EDIT MOVIE_GENRE

const findMovieKind = (movieId, genreId) =>
  db.query(
    "SELECT * FROM `movie_genre` WHERE `movieId` = ? AND `genreId` = ?",
    [movieId, genreId]
  );

const findKindByMovieId = async (movieId) => {
  const [result] = await db.query(
    "SELECT genreId FROM `movie_genre` WHERE `movieId` = ?",
    [movieId]
  );
  return result;
};

const countMoviesByKind = async (genreId) => {
  const [result] = await db.query(
    "SELECT COUNT(*) AS movieCount FROM movie_genre WHERE genreId = ?",
    [genreId]
  );
  return result;
};

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

const findDirectorsByMovieId = async (movieId) => {
  const [result] = await db.query(
    "SELECT directorId FROM `movie_director` WHERE `movieId` = ?",
    [movieId]
  );
  return result;
};

const countMoviesByDirector = async (directorId) => {
  const [result] = await db.query(
    "SELECT COUNT(*) AS movieCount FROM movie_director WHERE directorId = ?",
    [directorId]
  );
  return result;
};

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

const findCastingByMovieId = async (movieId) => {
  const [result] = await db.query(
    "SELECT castingId FROM `movie_casting` WHERE `movieId` = ?",
    [movieId]
  );
  return result;
};

const countMoviesByCasting = async (castingId) => {
  const [result] = await db.query(
    "SELECT COUNT(*) AS movieCount FROM movie_casting WHERE castingId = ?",
    [castingId]
  );
  return result;
};

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

const findScreenwriterByMovieId = async (movieId) => {
  const [result] = await db.query(
    "SELECT screenwriterId FROM `movie_screenwriter` WHERE `movieId` = ?",
    [movieId]
  );
  return result;
};

const countMoviesByScreenwriter = async (screenwriterId) => {
  const [result] = await db.query(
    "SELECT COUNT(*) AS movieCount FROM movie_screenwriter WHERE screenwriterId = ?",
    [screenwriterId]
  );
  return result;
};

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

const findMusicByMovieId = async (movieId) => {
  const [result] = await db.query(
    "SELECT musicId FROM `movie_music` WHERE `movieId` = ?",
    [movieId]
  );
  return result;
};

const countMoviesByMusic = async (musicId) => {
  const [result] = await db.query(
    "SELECT COUNT(*) AS movieCount FROM movie_music WHERE musicId = ?",
    [musicId]
  );
  return result;
};

const addMovieMusic = (movieId, musicId) =>
  db.query("INSERT INTO `movie_music` (`movieId`, `musicId`) VALUES (?, ?);", [
    movieId,
    musicId,
  ]);

// EDIT MOVIE_STUDIO

const findMovieStudio = (movieId, studioId) =>
  db.query(
    "SELECT * FROM `movie_studio` WHERE `movieId` = ? AND `studioId` = ?",
    [movieId, studioId]
  );

const findStudioByMovieId = async (movieId) => {
  const [result] = await db.query(
    "SELECT studioId FROM `movie_studio` WHERE `movieId` = ?",
    [movieId]
  );
  return result;
};

const countMoviesByStudio = async (studioId) => {
  const [result] = await db.query(
    "SELECT COUNT(*) AS movieCount FROM movie_studio WHERE studioId = ?",
    [studioId]
  );
  return result;
};

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

const findCountryByMovieId = async (movieId) => {
  const [result] = await db.query(
    "SELECT countryId FROM `movie_country` WHERE `movieId` = ?",
    [movieId]
  );
  return result;
};

const countMoviesByCountry = async (countryId) => {
  const [result] = await db.query(
    "SELECT COUNT(*) AS movieCount FROM movie_country WHERE countryId = ?",
    [countryId]
  );
  return result;
};

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

const findLanguageByMovieId = async (movieId) => {
  const [result] = await db.query(
    "SELECT languageId FROM `movie_language` WHERE `movieId` = ?",
    [movieId]
  );
  return result;
};

const countMoviesBylanguage = async (languageId) => {
  const [result] = await db.query(
    "SELECT COUNT(*) AS movieCount FROM movie_language WHERE languageId = ?",
    [languageId]
  );
  return result;
};

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

const findTagByMovieId = async (movieId) => {
  const [result] = await db.query(
    "SELECT tagId FROM `movie_tag` WHERE `movieId` = ?",
    [movieId]
  );
  return result;
};

const countMoviesByTag = async (tagId) => {
  const [result] = await db.query(
    "SELECT COUNT(*) AS movieCount FROM movie_tag WHERE tagId = ?",
    [tagId]
  );
  return result;
};

const addMovieTag = (movieId, tagId) =>
  db.query("INSERT INTO `movie_tag` (`movieId`, `tagId`) VALUES (? , ?);", [
    movieId,
    tagId,
  ]);

module.exports = {
  insertMovie,
  updateMovie,
  updateMovieImage,
  getLastInsertedMovieId,
  findMovieById,
  eraseMovie,
  findMovieKind,
  findKindByMovieId,
  countMoviesByKind,
  addMovieKind,
  findMovieDirector,
  findDirectorsByMovieId,
  countMoviesByDirector,
  addMovieDirector,
  findMovieCasting,
  findCastingByMovieId,
  countMoviesByCasting,
  addMovieCasting,
  findMovieScreenwriter,
  findScreenwriterByMovieId,
  countMoviesByScreenwriter,
  addMovieScreenwriter,
  findMovieMusic,
  findMusicByMovieId,
  countMoviesByMusic,
  addMovieMusic,
  findMovieStudio,
  findStudioByMovieId,
  countMoviesByStudio,
  addMovieStudio,
  findMovieCountry,
  findCountryByMovieId,
  countMoviesByCountry,
  addMovieCountry,
  findMovieLanguage,
  findLanguageByMovieId,
  countMoviesBylanguage,
  addMovieLanguage,
  findMovieTag,
  findTagByMovieId,
  countMoviesByTag,
  addMovieTag,
};
