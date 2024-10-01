const directorsModel = require("../models/directorsModel");

const getAllArtistAsc = async (req, res, next) => {
  try {
    const [directors] = await directorsModel.findAllArtistAsc();
    res.status(200).json(directors);
  } catch (error) {
    next(error);
  }
};

const getAllArtistDesc = async (req, res, next) => {
  try {
    const [directors] = await directorsModel.findAllArtistDesc();
    res.status(200).json(directors);
  } catch (error) {
    next(error);
  }
};

const getAllArtistIdDesc = async (req, res, next) => {
  try {
    const [directors] = await directorsModel.findAllArtistIdDesc();
    res.status(200).json(directors);
  } catch (error) {
    next(error);
  }
};

const getAllMoviesByArtistId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await directorsModel.findAllMoviesByArtistId(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted0 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await directorsModel.findAllMoviesByArtistIdAsc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted1 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await directorsModel.findAllMoviesByArtistIdDesc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await directorsModel.findAllMoviesByArtistIdYearAsc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted3 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await directorsModel.findAllMoviesByArtistIdYearDesc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllByLetter = async (req, res, next) => {
  try {
    const { letter } = req.params;
    const [artists] = await directorsModel.findAllByLetter(letter);
    res.status(200).json(artists);
  } catch (error) {
    next(error);
  }
};

const getAllByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const [[director]] = await directorsModel.findDirectorByName(name);
    res.status(200).json(director);
  } catch (error) {
    next(error);
  }
};

const getAllById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[director]] = await directorsModel.findDirectorById(id);
    res.status(200).json(director);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllArtistAsc,
  getAllArtistDesc,
  getAllArtistIdDesc,
  getAllMoviesByArtistId,
  getAllSorted0,
  getAllSorted1,
  getAllSorted2,
  getAllSorted3,
  getAllByLetter,
  getAllByName,
  getAllById,
};
