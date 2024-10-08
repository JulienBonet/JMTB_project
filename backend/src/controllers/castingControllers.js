const castingModel = require("../models/castingModel");

const getAllArtistAsc = async (req, res, next) => {
  try {
    const [artist] = await castingModel.findAllArtistAsc();
    res.status(200).json(artist);
  } catch (error) {
    next(error);
  }
};

const getAllArtistDesc = async (req, res, next) => {
  try {
    const [artist] = await castingModel.findAllArtistDesc();
    res.status(200).json(artist);
  } catch (error) {
    next(error);
  }
};

const getAllArtistIdDesc = async (req, res, next) => {
  try {
    const [artist] = await castingModel.findAllArtistIdDesc();
    res.status(200).json(artist);
  } catch (error) {
    next(error);
  }
};

const getAllMoviesByArtistId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await castingModel.findAllMoviesByArtistId(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted0 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await castingModel.findAllMoviesByArtistIdAsc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted1 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await castingModel.findAllMoviesByArtistIdDesc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await castingModel.findAllMoviesByArtistIdYearAsc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted3 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await castingModel.findAllMoviesByArtistIdYearDesc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllByLetter = async (req, res, next) => {
  try {
    const { letter } = req.params;
    const [artists] = await castingModel.findAllByLetter(letter);
    res.status(200).json(artists);
  } catch (error) {
    next(error);
  }
};
const getAllByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const [[casting]] = await castingModel.findCastingByName(name);
    res.status(200).json(casting);
  } catch (error) {
    next(error);
  }
};

const getAllById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[casting]] = await castingModel.findCastingById(id);
    res.status(200).json(casting);
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
