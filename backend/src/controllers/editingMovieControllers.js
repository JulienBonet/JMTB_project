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
    if (genres.length > 0) {
      // Créer un tableau de promesses pour insérer les genres associés au film
      const genrePromises = genres.map((genre) =>
        editingMovieModel.addMovieKind(movieId, genre.id)
      );

      // Attendre que toutes les promesses soient résolues
      await Promise.all(genrePromises);
    }

    // INSERT DIRECTORS
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
        directorIds.push(director[0].id); // Accéder à l'élément du tableau
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

    // INSERT SCREENWRITERS
    if (screenwriters && screenwriters.length > 0) {
      const screenwritersPromises = screenwriters.map((screenwriterName) =>
        editingModel.findScreenwriterByName(screenwriterName)
      );

      const screenwriterExist = await Promise.all(screenwritersPromises);

      const screenwriterIds = [];

      for (let i = 0; i < screenwriterExist.length; i++) {
        const screenwriter = screenwriterExist[i][0];
        screenwriterIds.push(screenwriter[0].id);
      }

      const screenwriterPromises = screenwriterIds.map((screenwriterId) =>
        editingMovieModel.addMovieScreenwriter(movieId, screenwriterId)
      );

      try {
        await Promise.all(screenwriterPromises);
      } catch (error) {
        console.error(
          "Error creating movie-screenwriter relationships:",
          error
        );
      }
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
        compositorIds.push(compositor[0].id);
      }

      const compositorPromises = compositorIds.map((compositorId) =>
        editingMovieModel.addMovieMusic(movieId, compositorId)
      );

      try {
        await Promise.all(compositorPromises);
      } catch (error) {
        console.error("Error creating movie-compositor relationships:", error);
      }
    }

    // INSERT STUDIO
    if (studios && studios.length > 0) {
      const studioIds = [];

      for (let i = 0; i < studios.length; i++) {
        try {
          const result = await editingModel.insertStudio(studios[i]);
          studioIds.push(result.insertId);
        } catch (error) {
          console.error("Error inserting studio:", error);
        }
      }

      const studioPromises = studioIds.map((studioId) =>
        editingMovieModel.addMovieStudio(movieId, studioId)
      );

      try {
        await Promise.all(studioPromises);
      } catch (error) {
        console.error("Error creating movie-studio relationships:", error);
      }
    }

    // INSERT COUNTRY
    if (countries && countries.length > 0) {
      const countriesPromises = countries.map((countryName) =>
        editingModel.findCountryByName(countryName)
      );

      const countryExist = await Promise.all(countriesPromises);

      const countryIds = [];

      for (let i = 0; i < countryExist.length; i++) {
        const country = countryExist[i][0];
        if (!country) {
          try {
            const result = await editingModel.insertStudio(countries[i]);
            countryIds.push(result.insertId);
          } catch (error) {
            console.error("Error inserting country:", error);
          }
        } else {
          countryIds.push(country[0].id);
        }
      }

      const countryPromises = countryIds.map((countryId) =>
        editingMovieModel.addMovieCountry(movieId, countryId)
      );

      try {
        await Promise.all(countryPromises);
      } catch (error) {
        console.error("Error creating movie-country relationships:", error);
      }
    }

    // INSERT LANGUAGE
    if (languages && languages.length > 0) {
      const languagesPromises = languages.map((languageName) =>
        editingModel.findLanguageByName(languageName)
      );

      const languageExist = await Promise.all(languagesPromises);

      const languageIds = [];

      for (let i = 0; i < languageExist.length; i++) {
        const language = languageExist[i][0];
        if (!language) {
          try {
            const result = await editingModel.insertLanguage(languages[i]);
            languageIds.push(result.insertId);
          } catch (error) {
            console.error("Error inserting language:", error);
          }
        } else {
          languageIds.push(language[0].id);
        }
      }

      const languagePromises = languageIds.map((languageId) =>
        editingMovieModel.addMovieLanguage(movieId, languageId)
      );

      try {
        await Promise.all(languagePromises);
      } catch (error) {
        console.error("Error creating movie-language relationships:", error);
      }
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
