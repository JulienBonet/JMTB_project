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
  idIMDb,
  vostfr,
  multi,
  isTvShow,
  TvSeasons,
  nbTvEpisodes,
  episodeDuration,
  comment
) =>
  db.query(
    "INSERT INTO movies (title, altTitle, year, duration, cover, trailer, pitch, story, location, videoFormat, videoSupport, fileSize, idTheMovieDb, idIMDb, vostfr, multi, isTvShow, TvSeasons, nbTvEpisodes, episodeDuration, comment) VALUES (?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,? );",
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
      vostfr,
      multi,
      isTvShow,
      TvSeasons,
      nbTvEpisodes,
      episodeDuration,
      comment,
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
  vostfr,
  multi,
  comment,
  isTvShow,
  TvSeasons,
  nbTvEpisodes,
  episodeDuration,
  id
) =>
  db.query(
    "UPDATE movies SET title = ?, altTitle = ?, year = ?, duration = ?, trailer = ?, story = ?, location = ?, videoFormat = ?, videoSupport = ?, fileSize = ?, vostfr = ?, multi = ?, isTvShow = ?, TvSeasons = ?, nbTvEpisodes = ?, episodeDuration = ?,comment = ? WHERE id = ?",
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
      vostfr,
      multi,
      isTvShow,
      TvSeasons,
      nbTvEpisodes,
      episodeDuration,
      comment,
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

const findMovieExtendedById = async (id) => {
  const [result] = await db.query(
    `SELECT m.*, 
            GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres, 
            GROUP_CONCAT(DISTINCT d.name SEPARATOR ', ') AS directors, 
            GROUP_CONCAT(DISTINCT c.name SEPARATOR ', ') AS casting, 
            GROUP_CONCAT(DISTINCT sw.name SEPARATOR ', ') AS screenwriters, 
            GROUP_CONCAT(DISTINCT mus.name SEPARATOR ', ') AS music, 
            GROUP_CONCAT(DISTINCT ctr.name SEPARATOR ', ') AS countries, 
            GROUP_CONCAT(DISTINCT l.name SEPARATOR ', ') AS languages, 
            GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ') AS studios, 
            GROUP_CONCAT(DISTINCT t.name SEPARATOR ', ') AS tags
     FROM movies m
     LEFT JOIN movie_genre mg ON m.id = mg.movieId
     LEFT JOIN genre g ON mg.genreId = g.id
     LEFT JOIN movie_director md ON m.id = md.movieId
     LEFT JOIN director d ON md.directorId = d.id
     LEFT JOIN movie_casting mc ON m.id = mc.movieId
     LEFT JOIN casting c ON mc.castingId = c.id
     LEFT JOIN movie_screenwriter msw ON m.id = msw.movieId
     LEFT JOIN screenwriter sw ON msw.screenwriterId = sw.id
     LEFT JOIN movie_music mco ON m.id = mco.movieId
     LEFT JOIN music mus ON mco.musicId = mus.id
     LEFT JOIN movie_country mctr ON m.id = mctr.movieId
     LEFT JOIN country ctr ON mctr.countryId = ctr.id
     LEFT JOIN movie_language ml ON m.id = ml.movieId
     LEFT JOIN language l ON ml.languageId = l.id
     LEFT JOIN movie_studio ms ON m.id = ms.movieId
     LEFT JOIN studio s ON ms.studioId = s.id
     LEFT JOIN movie_tag mt ON m.id = mt.movieId
     LEFT JOIN tag t ON mt.tagId = t.id
     WHERE m.id = ? 
     GROUP BY m.id`,
    [id]
  );
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

const eraseKindByMovieId = (movieId) => {
  return db.query("DELETE FROM movie_genre WHERE movieId = ?", [movieId]);
};

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

const eraseDirectorByMovieId = (movieId) => {
  return db.query("DELETE FROM movie_director WHERE movieId = ?", [movieId]);
};

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

const eraseCastingByMovieId = (movieId) => {
  return db.query("DELETE FROM movie_casting WHERE movieId = ?", [movieId]);
};

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

const eraseScreenwriterByMovieId = (movieId) => {
  return db.query("DELETE FROM movie_screenwriter WHERE movieId = ?", [
    movieId,
  ]);
};

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

const eraseMusicByMovieId = (movieId) => {
  return db.query("DELETE FROM movie_music WHERE movieId = ?", [movieId]);
};

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

const eraseStudioByMovieId = (movieId) => {
  return db.query("DELETE FROM movie_studio WHERE movieId = ?", [movieId]);
};

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

const eraseCountryByMovieId = (movieId) => {
  return db.query("DELETE FROM movie_country WHERE movieId = ?", [movieId]);
};

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

const eraseLanguageByMovieId = (movieId) => {
  return db.query("DELETE FROM movie_language WHERE movieId = ?", [movieId]);
};

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

const eraseTagByMovieId = (movieId) => {
  return db.query("DELETE FROM movie_tag WHERE movieId = ?", [movieId]);
};

module.exports = {
  insertMovie,
  updateMovie,
  updateMovieImage,
  getLastInsertedMovieId,
  findMovieById,
  findMovieExtendedById,
  eraseMovie,
  findMovieKind,
  findKindByMovieId,
  countMoviesByKind,
  addMovieKind,
  eraseKindByMovieId,
  findMovieDirector,
  findDirectorsByMovieId,
  countMoviesByDirector,
  addMovieDirector,
  eraseDirectorByMovieId,
  findMovieCasting,
  findCastingByMovieId,
  countMoviesByCasting,
  addMovieCasting,
  eraseCastingByMovieId,
  findMovieScreenwriter,
  findScreenwriterByMovieId,
  countMoviesByScreenwriter,
  addMovieScreenwriter,
  eraseScreenwriterByMovieId,
  findMovieMusic,
  findMusicByMovieId,
  countMoviesByMusic,
  addMovieMusic,
  eraseMusicByMovieId,
  findMovieStudio,
  findStudioByMovieId,
  countMoviesByStudio,
  addMovieStudio,
  eraseStudioByMovieId,
  findMovieCountry,
  findCountryByMovieId,
  countMoviesByCountry,
  addMovieCountry,
  eraseCountryByMovieId,
  findMovieLanguage,
  findLanguageByMovieId,
  countMoviesBylanguage,
  addMovieLanguage,
  eraseLanguageByMovieId,
  findMovieTag,
  findTagByMovieId,
  countMoviesByTag,
  addMovieTag,
  eraseTagByMovieId,
};
