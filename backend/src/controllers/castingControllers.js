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
    const { letter } = req.params; // Extraire la lettre des paramètres de la requête
    console.info("Letter:", letter); // Afficher la lettre spécifiée dans la console
    const [artists] = await castingModel.findAllByLetter(letter); // Utiliser la fonction du modèle pour obtenir les artistes par lettre
    res.status(200).json(artists); // Renvoyer les artistes sous forme de réponse JSON
  } catch (error) {
    next(error); // Passer l'erreur au middleware suivant
  }
};

module.exports = {
  getAllArtistAsc,
  getAllArtistDesc,
  getAllMoviesByArtistId,
  getAllSorted0,
  getAllSorted1,
  getAllSorted2,
  getAllSorted3,
  getAllByLetter,
};
