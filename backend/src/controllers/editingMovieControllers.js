/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
// const fs = require("fs");
// const path = require("path");
// const editingModel = require("../models/editingModel");
const editingMovieModel = require("../models/editingMovieModel");

const addMovie = async (req, res) => {
  try {
    const {
      title,
      altTitle,
      year,
      duration,
      trailer,
      pitch,
      story,
      location,
      videoFormat,
      videoSupport,
      fileSize,
      idTheMovieDb,
      idIMDb,
      genres,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Movie's title is required" });
    }

    await editingMovieModel.insertMovie(
      title,
      altTitle,
      year,
      duration,
      trailer,
      pitch,
      story,
      location,
      videoFormat,
      videoSupport,
      fileSize,
      idTheMovieDb,
      idIMDb
    );

    const [[{ movieId }]] = await editingMovieModel.getLastInsertedMovieId();

    // Vérifier si des genres ont été sélectionnés
    if (genres.length > 0) {
      // Créer un tableau de promesses pour insérer les genres associés au film
      const genrePromises = genres.map((genreId) =>
        editingMovieModel.addMovieKind(movieId, genreId)
      );

      // Attendre que toutes les promesses soient résolues
      await Promise.all(genrePromises);
    }

    return res
      .status(201)
      .json({ message: "Movie successfully created", movieId });
  } catch (error) {
    console.error("Error movie creation :", error);
    return res.status(500).json({ message: "Error movie creation" });
  }
};

module.exports = {
  addMovie,
};
