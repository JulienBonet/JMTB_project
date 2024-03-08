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

const getByLetter = async (req, res, next) => {
  try {
    const { letter } = req.params;
    const [movies] = await moviesModel.findByLetter(letter);
    if (!movies || movies.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(movies);
    }
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};

const getByLetterNumber = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findByLetterNumber();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getByYear = async (req, res, next) => {
  try {
    const { year } = req.params;
    const [movies] = await moviesModel.findByYear(year);
    if (!movies || movies.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(movies);
    }
  } catch (err) {
    console.error("Error:", err);
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
  getByLetter,
  getByLetterNumber,
  getByYear,
};
