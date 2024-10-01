const screenwritersModel = require("../models/screenwritersModel");

const getAllArtistAsc = async (req, res, next) => {
  try {
    const [artist] = await screenwritersModel.findAllArtistAsc();
    res.status(200).json(artist);
  } catch (error) {
    next(error);
  }
};

const getAllArtistDesc = async (req, res, next) => {
  try {
    const [artist] = await screenwritersModel.findAllArtistDesc();
    res.status(200).json(artist);
  } catch (error) {
    next(error);
  }
};

const getAllArtistIdDesc = async (req, res, next) => {
  try {
    const [artist] = await screenwritersModel.findAllArtistIdDesc();
    res.status(200).json(artist);
  } catch (error) {
    next(error);
  }
};

const getAllMoviesByArtistId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await screenwritersModel.findAllMoviesByArtistId(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted0 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await screenwritersModel.findAllMoviesByArtistIdAsc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted1 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await screenwritersModel.findAllMoviesByArtistIdDesc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await screenwritersModel.findAllMoviesByArtistIdYearAsc(
      id
    );
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted3 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await screenwritersModel.findAllMoviesByArtistIdYearDesc(
      id
    );
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllByLetter = async (req, res, next) => {
  try {
    const { letter } = req.params;
    const [artists] = await screenwritersModel.findAllByLetter(letter);
    res.status(200).json(artists);
  } catch (error) {
    next(error);
  }
};

const getAllByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const [[screenwriter]] = await screenwritersModel.findScreenwriterByName(
      name
    );
    res.status(200).json(screenwriter);
  } catch (error) {
    next(error);
  }
};

const getAllById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[screenwriter]] = await screenwritersModel.findScreenwriterById(id);
    res.status(200).json(screenwriter);
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
