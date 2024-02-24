const moviesModel = require("../models/moviesModel");

const getAll = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAll();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted0 = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAllSortedAlpha();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted1 = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAllSortedZeta();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted2 = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAllSortedYear();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted3 = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAllSortedYearDESC();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSortedNox = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAllSortedNoX();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const [[movie]] = await moviesModel.findById(req.params.id);
    if (movie == null) {
      res.sendStatus(404);
    } else {
      res.json(movie);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  getAllSorted0,
  getAllSorted1,
  getAllSorted2,
  getAllSorted3,
  getAllSortedNox,
};
