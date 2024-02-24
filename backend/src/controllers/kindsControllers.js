const kindsModel = require("../models/kindsModel");

const getAllKinds = async (req, res, next) => {
  try {
    const [kinds] = await kindsModel.findAllKinds();
    res.status(200).json(kinds);
  } catch (error) {
    next(error);
  }
};

const getAllMovieByKinds = async (req, res, next) => {
  try {
    const { genre } = req.params;
    const [movies] = await kindsModel.findAllMoviesByKinds(genre);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted0 = async (req, res, next) => {
  try {
    const { genre } = req.params;
    const [movies] = await kindsModel.findAllSortedAlpha(genre);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted1 = async (req, res, next) => {
  try {
    const { genre } = req.params;
    const [movies] = await kindsModel.findAllSortedZeta(genre);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted2 = async (req, res, next) => {
  try {
    const { genre } = req.params;
    const [movies] = await kindsModel.findAllSortedYear(genre);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted3 = async (req, res, next) => {
  try {
    const { genre } = req.params;
    const [movies] = await kindsModel.findAllSortedYearDESC(genre);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKinds,
  getAllMovieByKinds,
  getAllSorted0,
  getAllSorted1,
  getAllSorted2,
  getAllSorted3,
};