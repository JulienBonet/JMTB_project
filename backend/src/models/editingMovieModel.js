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

const eraseMovie = (id) => db.query("DELETE FROM movies WHERE id = ?", [id]);

module.exports = {
  insertMovie,
  eraseMovie,
};
