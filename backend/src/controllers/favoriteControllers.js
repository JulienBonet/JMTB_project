const favoriteModel = require("../models/favoriteModel");

const addFavorite = async (req, res, next) => {
  try {
    const { userId, movieId } = req.body;
    await favoriteModel.insertFavorite(userId, movieId);
    res.status(201).json({ message: "Favori ajouté" });
  } catch (error) {
    next(error);
  }
};

const unFavorite = async (req, res, next) => {
  try {
    const { userId, movieId } = req.body;
    await favoriteModel.removeFavorite(userId, movieId);
    res.status(200).json({ message: "Favori supprimé" });
  } catch (error) {
    next(error);
  }
};

const getAllFavoritesByUser = async (req, res) => {
  try {
    const userId = req.user.id; // récupéré via le token
    const [favorites] = await favoriteModel.findAllFavoriteByUser(userId);
    res.json(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getFavoritesAlphaAsc = async (req, res) => {
  const userId = req.user.id;
  const [data] = await favoriteModel.findFavoritesAlphaAsc(userId);
  res.json(data);
};

const getFavoritesAlphaDesc = async (req, res) => {
  const userId = req.user.id;
  const [data] = await favoriteModel.findFavoritesAlphaDesc(userId);
  res.json(data);
};

const getFavoritesYearAsc = async (req, res) => {
  const userId = req.user.id;
  const [data] = await favoriteModel.findFavoritesYearAsc(userId);
  res.json(data);
};

const getFavoritesYearDesc = async (req, res) => {
  const userId = req.user.id;
  const [data] = await favoriteModel.findFavoritesYearDesc(userId);
  res.json(data);
};
const isFavorite = async (req, res, next) => {
  try {
    const { userId, movieId } = req.params;
    const [[result]] = await favoriteModel.isFavorite(userId, movieId);
    res.status(200).json({ isFavorite: !!result });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  addFavorite,
  unFavorite,
  getAllFavoritesByUser,
  getFavoritesAlphaAsc,
  getFavoritesAlphaDesc,
  getFavoritesYearAsc,
  getFavoritesYearDesc,
  isFavorite,
};
