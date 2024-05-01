/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
// const fs = require("fs");
// const path = require("path");
const editingModel = require("../models/editingModel");
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
      directors,
      castings,
    } = req.body;

    console.info("body - directors :", directors);

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

    // INSERT KINDS
    // Vérifier si des genres ont été sélectionnés
    if (genres.length > 0) {
      // Créer un tableau de promesses pour insérer les genres associés au film
      const genrePromises = genres.map((genreId) =>
        editingMovieModel.addMovieKind(movieId, genreId)
      );

      // Attendre que toutes les promesses soient résolues
      await Promise.all(genrePromises);
    }

    // INSERT DIRECTORS
    // Vérifier si des réalisateurs ont été sélectionnés
    if (directors && directors.length > 0) {
      // Vérifier si chaque réalisateur existe en base de données
      const directorsPromises = directors.map((directorName) =>
        editingModel.findDirectorByName(directorName)
      );

      // Attendre que toutes les promesses soient résolues
      const directorsExist = await Promise.all(directorsPromises);

      // Créer un tableau pour stocker les ID des réalisateurs
      const directorIds = [];

      // Vérifier si chaque réalisateur existe en base de données
      for (let i = 0; i < directorsExist.length; i++) {
        const director = directorsExist[i][0];

        // Si le réalisateur n'existe pas, le créer et récupérer son ID
        if (!director) {
          try {
            const result = await editingModel.insertDirector(directors[i]);
            directorIds.push(result.insertId);
          } catch (error) {
            console.error("Error inserting director:", error);
          }
        } else {
          // Si le réalisateur existe, récupérer son ID
          directorIds.push(director[0].id); // Accéder à l'élément du tableau
        }
      }

      // Créer les relations entre le film et les réalisateurs
      const directorPromises = directorIds.map((directorId) =>
        editingMovieModel.addMovieDirector(movieId, directorId)
      );

      // Attendre que toutes les promesses soient résolues
      try {
        await Promise.all(directorPromises);
      } catch (error) {
        console.error("Error creating movie-director relationships:", error);
        // Gérer l'erreur ici, par exemple en renvoyant un message d'erreur à l'utilisateur
      }
    }

    // INSERT CASTING
    if (castings && castings.length > 0) {
      const castingsPromises = castings.map((castingName) =>
        editingModel.findCastingByName(castingName)
      );

      const castingExist = await Promise.all(castingsPromises);

      const castingIds = [];

      for (let i = 0; i < castingExist.length; i++) {
        const casting = castingExist[i][0];
        if (!casting) {
          try {
            const result = await editingModel.insertCasting(castings[i]);
            castingIds.push(result.insertId);
          } catch (error) {
            console.error("Error inserting casting:", error);
          }
        } else {
          castingIds.push(casting[0].id);
        }
      }

      const castingPromises = castingIds.map((castingId) =>
        editingMovieModel.addMovieCasting(movieId, castingId)
      );

      try {
        await Promise.all(castingPromises);
      } catch (error) {
        console.error("Error creating movie-casting relationships:", error);
      }
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
