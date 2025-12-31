const db = require("../../database/client");

const insertFavorite = (userId, movieId) => {
  return db.query(
    `INSERT INTO user_favorite (user_id, movie_id)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE created_at = created_at`,
    [userId, movieId]
  );
};

const removeFavorite = (userId, movieId) => {
  return db.query(
    "DELETE FROM user_favorite WHERE user_id = ? AND movie_id = ?",
    [userId, movieId]
  );
};

const findAllFavoriteByUser = (userId) => {
  return db.query(
    `SELECT m.*
     FROM movies m
     JOIN user_favorite uf ON uf.movie_id = m.id
     WHERE uf.user_id = ?
     ORDER BY uf.created_at DESC`,
    [userId]
  );
};

const findFavoritesAlphaAsc = (userId) => {
  return db.query(
    `SELECT m.*
     FROM movies m
     JOIN user_favorite uf ON uf.movie_id = m.id
     WHERE uf.user_id = ?
     ORDER BY m.title ASC`,
    [userId]
  );
};

const findFavoritesAlphaDesc = (userId) => {
  return db.query(
    `SELECT m.*
     FROM movies m
     JOIN user_favorite uf ON uf.movie_id = m.id
     WHERE uf.user_id = ?
     ORDER BY m.title DESC`,
    [userId]
  );
};

const findFavoritesYearAsc = (userId) => {
  return db.query(
    `SELECT m.*
     FROM movies m
     JOIN user_favorite uf ON uf.movie_id = m.id
     WHERE uf.user_id = ?
     ORDER BY m.year ASC`,
    [userId]
  );
};

const findFavoritesYearDesc = (userId) => {
  return db.query(
    `SELECT m.*
     FROM movies m
     JOIN user_favorite uf ON uf.movie_id = m.id
     WHERE uf.user_id = ?
     ORDER BY m.year DESC`,
    [userId]
  );
};

const isFavorite = (userId, movieId) => {
  return db.query(
    "SELECT 1 FROM user_favorite WHERE user_id = ? AND movie_id = ?",
    [userId, movieId]
  );
};

module.exports = {
  insertFavorite,
  removeFavorite,
  findAllFavoriteByUser,
  findFavoritesAlphaAsc,
  findFavoritesAlphaDesc,
  findFavoritesYearAsc,
  findFavoritesYearDesc,
  isFavorite,
};
