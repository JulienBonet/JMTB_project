const musicModel = require("../models/musicModel");

const getAllArtistAsc = async (req, res, next) => {
  try {
    const [artist] = await musicModel.findAllArtistAsc();
    res.status(200).json(artist);
  } catch (error) {
    next(error);
  }
};

const getAllArtistDesc = async (req, res, next) => {
  try {
    const [artist] = await musicModel.findAllArtistDesc();
    res.status(200).json(artist);
  } catch (error) {
    next(error);
  }
};

const getAllArtistIdDesc = async (req, res, next) => {
  try {
    const [artist] = await musicModel.findAllArtistIdDesc();
    res.status(200).json(artist);
  } catch (error) {
    next(error);
  }
};

const getAllMoviesByArtistId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await musicModel.findAllMoviesByArtistId(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted0 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await musicModel.findAllMoviesByArtistIdAsc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted1 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await musicModel.findAllMoviesByArtistIdDesc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await musicModel.findAllMoviesByArtistIdYearAsc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted3 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await musicModel.findAllMoviesByArtistIdYearDesc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllByLetter = async (req, res, next) => {
  try {
    const { letter } = req.params;
    const [artists] = await musicModel.findAllByLetter(letter);
    res.status(200).json(artists);
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
};
