const directorsModel = require("../models/directorsModel");

const getAllDirectorsAsc = async (req, res, next) => {
  try {
    const [directors] = await directorsModel.findAllDirectorsAsc();
    res.status(200).json(directors);
  } catch (error) {
    next(error);
  }
};

const getAllDirectorsDesc = async (req, res, next) => {
  try {
    const [directors] = await directorsModel.findAllfindAllDirectorsDesc();
    res.status(200).json(directors);
  } catch (error) {
    next(error);
  }
};

const getAllMoviesByDirectorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await directorsModel.findAllMoviesByDirectorId(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted0 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await directorsModel.findAllMoviesByDirectorIdAsc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted1 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await directorsModel.findAllMoviesByDirectorIdDesc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await directorsModel.findAllMoviesByDirectorIdYearAsc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted3 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await directorsModel.findAllMoviesByDirectorIdYearDesc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDirectorsAsc,
  getAllDirectorsDesc,
  getAllMoviesByDirectorId,
  getAllSorted0,
  getAllSorted1,
  getAllSorted2,
  getAllSorted3,
};
