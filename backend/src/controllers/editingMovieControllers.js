/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const editingModel = require("../models/editingModel");
const editingMovieModel = require("../models/editingMovieModel");

// Fonction de téléchargement de l'image
const downloadImage = async (url, filepath) => {
  const response = await axios({
    url,
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filepath);
    response.data
      .pipe(writeStream)
      .on("finish", () => {
        writeStream.close(() => resolve(filepath)); // Ferme le flux et résout la promesse
      })
      .on("error", (e) => reject(e));
  });
}; // end const downloadImage

// Fonction de téléchargement et redimensionnement de l'affiche
const downloadPoster = async (posterPath) => {
  const tmdbBaseUrl = "https://image.tmdb.org/t/p/original";
  const posterUrl = `${tmdbBaseUrl}${posterPath}`;
  const extension = path.extname(posterPath);
  const filename = `poster-${uuidv4()}${extension}`;
  const filepath = path.join(__dirname, "../../public/images", filename);

  // Télécharge l'image
  await downloadImage(posterUrl, filepath);

  // Crée un chemin temporaire pour l'image redimensionnée
  const resizedFilepath = path.join(
    __dirname,
    "../../public/images",
    `resized-${filename}`
  );

  // Redimensionne l'image après le téléchargement
  await sharp(filepath)
    .resize(300, 450) // Redimensionne à 300x450
    .toFile(resizedFilepath); // Enregistre l'image redimensionnée dans un nouveau fichier

  // Assure un léger délai avant de supprimer le fichier original
  setTimeout(() => {
    // Supprime l'image originale
    fs.unlink(filepath, (error) => {
      if (error) {
        console.error(
          "Erreur lors de la suppression de l'image originale :",
          error
        );
      } else {
        console.info("Image originale supprimée avec succès.");
      }
    });

    // Renomme l'image redimensionnée pour qu'elle remplace l'image originale
    fs.rename(resizedFilepath, filepath, (error) => {
      if (error) {
        console.error(
          "Erreur lors du renommage de l'image redimensionnée :",
          error
        );
      } else {
        console.info("Image redimensionnée renommée avec succès.");
      }
    });
  }, 100); // Délai de 100 ms pour s'assurer que le fichier est libéré

  return filename; // Retourne le nom du fichier redimensionné
}; // end downloadPoster

const addMovie = async (req, res) => {
  try {
    const {
      title,
      altTitle,
      year,
      duration,
      posterUrl,
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
      screenwriters,
      compositors,
      studios,
      countries,
      languages,
      tags,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Movie's title is required" });
    }

    // Téléchargez l'affiche du film
    let cover = "";
    if (posterUrl) {
      cover = await downloadPoster(posterUrl); // Télécharge l'image et retourne le nom du fichier
      // Ajoute l'URL de base (localhost:3310) pour créer l'URL complète de l'affiche
      const backendUrl =
        process.env.VITE_BACKEND_URL || "http://localhost:3310";
      cover = `${backendUrl}/${cover}`; // Créer l'URL complète
    }
    console.info("cover : ", cover);

    await editingMovieModel.insertMovie(
      title,
      altTitle,
      year,
      duration,
      cover,
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
    if (genres.length > 0) {
      const genrePromises = genres.map((genre) =>
        editingMovieModel.addMovieKind(movieId, genre.id)
      );
      await Promise.all(genrePromises);
    }

    // INSERT DIRECTORS
    if (directors && directors.length > 0) {
      const directorsPromises = directors.map((directorName) =>
        editingModel.findDirectorByName(directorName)
      );

      const directorsExist = await Promise.all(directorsPromises);
      const directorIds = [];

      for (let i = 0; i < directorsExist.length; i++) {
        const director = directorsExist[i][0];
        if (!director) {
          const result = await editingModel.insertDirector(directors[i]);
          directorIds.push(result.insertId);
        } else {
          directorIds.push(director[0].id);
        }
      }

      const directorPromises = directorIds.map((directorId) =>
        editingMovieModel.addMovieDirector(movieId, directorId)
      );

      await Promise.all(directorPromises);
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
          const result = await editingModel.insertCasting(castings[i]);
          castingIds.push(result.insertId);
        } else {
          castingIds.push(casting[0].id);
        }
      }

      const castingPromises = castingIds.map((castingId) =>
        editingMovieModel.addMovieCasting(movieId, castingId)
      );

      await Promise.all(castingPromises);
    }

    // INSERT SCREENWRITERS
    if (screenwriters && screenwriters.length > 0) {
      const screenwritersPromises = screenwriters.map((screenwriterName) =>
        editingModel.findScreenwriterByName(screenwriterName)
      );

      const screenwriterExist = await Promise.all(screenwritersPromises);
      const screenwriterIds = [];

      for (let i = 0; i < screenwriterExist.length; i++) {
        const screenwriter = screenwriterExist[i][0];
        if (!screenwriter) {
          const result = await editingModel.insertScreenwriter(
            screenwriters[i]
          );
          screenwriterIds.push(result.insertId);
        } else {
          screenwriterIds.push(screenwriter[0].id);
        }
      }

      const screenwriterPromises = screenwriterIds.map((screenwriterId) =>
        editingMovieModel.addMovieScreenwriter(movieId, screenwriterId)
      );

      await Promise.all(screenwriterPromises);
    }

    // INSERT COMPOSITOR
    if (compositors && compositors.length > 0) {
      const compositorsPromises = compositors.map((compositorName) =>
        editingModel.findCompositorByName(compositorName)
      );

      const compositorExist = await Promise.all(compositorsPromises);
      const compositorIds = [];

      for (let i = 0; i < compositorExist.length; i++) {
        const compositor = compositorExist[i][0];
        if (!compositor) {
          const result = await editingModel.insertCompositor(compositors[i]);
          compositorIds.push(result.insertId);
        } else {
          compositorIds.push(compositor[0].id);
        }
      }

      const compositorPromises = compositorIds.map((compositorId) =>
        editingMovieModel.addMovieMusic(movieId, compositorId)
      );

      await Promise.all(compositorPromises);
    }

    // INSERT STUDIOS
    if (studios && studios.length > 0) {
      const studioIds = [];

      for (let i = 0; i < studios.length; i++) {
        const result = await editingModel.insertStudio(studios[i]);
        studioIds.push(result.insertId);
      }

      const studioPromises = studioIds.map((studioId) =>
        editingMovieModel.addMovieStudio(movieId, studioId)
      );

      await Promise.all(studioPromises);
    }

    // INSERT COUNTRIES
    if (countries && countries.length > 0) {
      const countriesPromises = countries.map((countryName) =>
        editingModel.findCountryByName(countryName)
      );

      const countryExist = await Promise.all(countriesPromises);
      const countryIds = [];

      for (let i = 0; i < countryExist.length; i++) {
        const country = countryExist[i][0];
        if (!country) {
          const result = await editingModel.insertCountry(countries[i]);
          countryIds.push(result.insertId);
        } else {
          countryIds.push(country[0].id);
        }
      }

      const countryPromises = countryIds.map((countryId) =>
        editingMovieModel.addMovieCountry(movieId, countryId)
      );

      await Promise.all(countryPromises);
    }

    // INSERT LANGUAGES
    if (languages && languages.length > 0) {
      const languagesPromises = languages.map((languageName) =>
        editingModel.findLanguageByName(languageName)
      );

      const languageExist = await Promise.all(languagesPromises);
      const languageIds = [];

      for (let i = 0; i < languageExist.length; i++) {
        const language = languageExist[i][0];
        if (!language) {
          const result = await editingModel.insertLanguage(languages[i]);
          languageIds.push(result.insertId);
        } else {
          languageIds.push(language[0].id);
        }
      }

      const languagePromises = languageIds.map((languageId) =>
        editingMovieModel.addMovieLanguage(movieId, languageId)
      );

      await Promise.all(languagePromises);
    }

    // INSERT TAGS
    if (tags.length > 0) {
      const tagsPromises = tags.map((tagId) =>
        editingMovieModel.addMovieTag(movieId, tagId)
      );
      await Promise.all(tagsPromises);
    }

    return res.status(201).json({ message: "Movie successfully created" });
  } catch (error) {
    console.error("Error movie creation :", error);
    return res.status(500).json({ message: "Error movie creation" });
  }
};

module.exports = {
  addMovie,
};
