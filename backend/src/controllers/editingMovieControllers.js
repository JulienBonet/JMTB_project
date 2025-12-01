/* eslint-disable no-continue */
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
const { resizeImage } = require("../middlewares/resizeImage");
const { cleanTags } = require("../utils/tags");
const { cleanStudioName } = require("../utils/studio");
const editingController = require("./editingControllers");
const editingModel = require("../models/editingModel");
const editingMovieModel = require("../models/editingMovieModel");
const purgeModel = require("../models/purgeModel");

//-----------------------------------------------
// TELECHARGEMENT IMAGE
//-----------------------------------------------

const downloadImage = async (url, filepath) => {
  // console.info("💡 downloadImage appelé avec :", url, filepath);
  const response = await axios({
    url,
    responseType: "stream",
  });
  // console.info("💡 Flux reçu depuis l’URL, début de l’écriture...");
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

const downloadPoster = async (posterPath) => {
  const tmdbBaseUrl = "https://image.tmdb.org/t/p/original";
  const posterUrl = `${tmdbBaseUrl}${posterPath}`;
  const extension = path.extname(posterPath);
  const filename = `cover-${uuidv4()}${extension}`;
  const filepath = path.join(__dirname, "../../public/images", filename);

  await downloadImage(posterUrl, filepath);

  // console.info(`✅ Image TMDB téléchargée et redimensionnée : ${filename}`);

  return filename;
}; // end const downloadPoster

const uploadLocalCover = async (localCoverPath, coverUrl) => {
  const extension = path.extname(localCoverPath);
  const filename = `cover-${uuidv4()}${extension}`;
  const targetPath = path.join(__dirname, "../../public/images", filename);

  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(localCoverPath);
    const writeStream = fs.createWriteStream(targetPath);

    readStream
      .pipe(writeStream)
      .on("finish", () => {
        console.info("Image locale téléchargée avec succès : ", targetPath);
        resolve(filename);
      })
      .on("error", (error) => {
        console.error("Erreur lors de l'upload de l'image locale :", error);
        reject(error);
      });
  });
}; // end const uploadLocalCover

const updateImageFromUrl = async (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: "Aucune URL d'image fournie" });
  }

  try {
    console.info(`🖼️ Téléchargement de l'image depuis : ${imageUrl}`);

    // 1️⃣ Récupérer l’ancien film pour connaître l’ancienne image
    const [oldMovie] = await editingMovieModel.findMovieById(id);
    const oldCover = oldMovie?.cover;

    // 2️⃣ Télécharger la nouvelle image
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const ext = path.extname(imageUrl).split("?")[0] || ".jpg";
    const filename = `cover-url-${uuidv4()}${ext}`;
    const filepath = path.join(__dirname, "../../public/images", filename);

    fs.writeFileSync(filepath, Buffer.from(response.data, "binary"));

    // ✅ Redimensionne juste après le téléchargement
    await resizeImage("cover", filename);

    console.info(`✅ Image TMDB téléchargée et redimensionnée : ${filename}`);

    // 3️⃣ Mettre à jour la BDD
    await editingMovieModel.updateMovieImage(filename, id);

    // 4️⃣ Supprimer l’ancienne image (si elle existe et n’est pas l’image par défaut)
    if (oldCover && oldCover !== "00_cover_default.jpg") {
      const oldPath = path.join(__dirname, "../../public/images", oldCover);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        console.info(`🧹 Ancienne image supprimée : ${oldCover}`);
      }
    }

    // 5️⃣ Renvoyer le film mis à jour
    const [updatedMovie] = await editingMovieModel.findMovieById(id);
    res
      .status(200)
      .json({ message: "Image mise à jour avec succès", movie: updatedMovie });
  } catch (error) {
    console.error("❌ Erreur updateImageFromUrl :", error.message);
    res.status(500).json({
      message: "Erreur lors du téléchargement de l'image",
      error: error.message,
    });
  }
}; // end const updateImageFromUrl

//-----------------------------------------------
// ADD MOVIE
//-----------------------------------------------

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
      vostfr,
      multi,
      isTvShow,
      tvSeasons,
      nbTvEpisodes,
      episodeDuration,
      comment,
      focus,
    } = req.body;
    console.info("fields in create movie", req.body);

    if (!title) {
      return res.status(400).json({ message: "Movie's title is required" });
    }

    // Recuperer l'affiche du film
    let coverFilename = "00_cover_default.jpg"; // Valeur par défaut
    // Vérifier s'il y a un fichier local uploadé
    if (req.file) {
      coverFilename = req.file.filename;
    } else if (req.body.cover) {
      // Si l'image de couverture a été envoyée via req.body (par exemple depuis une API)
      coverFilename = req.body.cover;
    }

    // Création de l'objet movieData pour gérer les champs optionnels et leur transformation
    const movieData = {
      title,
      altTitle: altTitle || null,
      year: year || null,
      duration: duration ? parseInt(duration, 10) : null,
      cover: coverFilename,
      trailer: trailer || null,
      pitch: pitch || null,
      story: story || null,
      location: location || null,
      videoFormat: videoFormat || null,
      videoSupport: videoSupport || null,
      fileSize: fileSize || null,
      idTheMovieDb: idTheMovieDb || null,
      idIMDb: idIMDb || null,
      vostfr: vostfr || 0,
      multi: multi || 0,
      isTvShow: isTvShow || 0,
      tvSeasons: tvSeasons || null,
      nbTvEpisodes: nbTvEpisodes || null,
      episodeDuration: episodeDuration || null,
      comment: comment || null,
    };

    // Insertion des données dans la base
    await editingMovieModel.insertMovie(
      movieData.title,
      movieData.altTitle,
      movieData.year,
      movieData.duration,
      movieData.cover,
      movieData.trailer,
      movieData.pitch,
      movieData.story,
      movieData.location,
      movieData.videoFormat,
      movieData.videoSupport,
      movieData.fileSize,
      movieData.idTheMovieDb,
      movieData.idIMDb,
      movieData.vostfr,
      movieData.multi,
      movieData.isTvShow,
      movieData.tvSeasons,
      movieData.nbTvEpisodes,
      movieData.episodeDuration,
      movieData.comment
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
        // 🔥 Nettoyage du nom
        const rawStudioName = studios[i];
        const studioName = cleanStudioName(rawStudioName);

        if (!studioName) {
          console.warn(
            `Nom de studio invalide après nettoyage : "${rawStudioName}"`
          );
          continue; // ignore ce studio
        }

        // Vérifie si le studio existe déjà (avec nom nettoyé)
        const existingStudioId =
          await editingModel.findStudioByName(studioName);

        if (existingStudioId) {
          studioIds.push(existingStudioId); // Ajoute l'ID du studio existant
        } else {
          // Insère le studio s'il n'existe pas
          const result = await editingModel.insertStudio(studioName);
          studioIds.push(result.insertId);
          console.info(`Studio créé : ${studioName} (ID: ${result.insertId})`);
        }
      }

      // Associe les studios au film
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
    // if (tags && tags.length > 0) {
    //   console.info("Tags reçus :", tags);

    //   const cleanedTags = cleanTags(tags); // nettoyage et normalisation
    //   console.info("Tags après cleanTags :", cleanedTags);

    //   if (cleanedTags.length === 0) {
    //     console.warn(
    //       "cleanTags a renvoyé un tableau vide, aucun tag à insérer !"
    //     );
    //   }

    //   const tagIds = [];

    //   for (const tagName of cleanedTags) {
    //     if (!tagName || tagName.trim() === "") {
    //       console.warn("Tag vide ou invalide ignoré :", tagName);
    //       continue;
    //     }

    //     console.info("Traitement du tag :", tagName);

    //     const existingTag = await editingModel.findTagByNameInBackend(tagName);

    //     if (existingTag) {
    //       console.info("Tag existant trouvé :", existingTag);
    //       if (existingTag.id) {
    //         tagIds.push(existingTag.id);
    //         console.info(
    //           `Ajout de l'ID existant ${existingTag.id} au tableau tagIds`
    //         );
    //       } else {
    //         console.warn("existingTag trouvé mais sans ID :", existingTag);
    //       }
    //     } else {
    //       console.info("Tag inexistant, création en base :", tagName);
    //       const result = await editingModel.insertTag(tagName);

    //       if (result && result.insertId) {
    //         tagIds.push(result.insertId);
    //         console.info(`Nouveau tag créé avec ID ${result.insertId}`);
    //       } else {
    //         console.error(
    //           "Impossible de créer le tag :",
    //           tagName,
    //           "résultat :",
    //           result
    //         );
    //       }
    //     }
    //   }

    //   console.info("Tous les tagIds à associer au film :", tagIds);

    //   if (tagIds.length > 0) {
    //     const tagPromises = tagIds.map((tagId) => {
    //       console.info(`Association movieId ${movieId} avec tagId ${tagId}`);
    //       return editingMovieModel.addMovieTag(movieId, tagId);
    //     });

    //     await Promise.all(tagPromises);
    //     console.info("Tous les tags ont été associés au film avec succès.");
    //   } else {
    //     console.warn("Aucun tag à associer au film, skipping addMovieTag.");
    //   }
    // } else {
    //   console.info("Aucun tag reçu pour ce film, skipping insertion tags.");
    // }

    if (tags && tags.length > 0) {
      const cleanedTags = cleanTags(tags); // nettoyage et normalisation

      if (cleanedTags.length === 0) {
        return; // rien à insérer
      }

      const tagIds = [];

      for (const tagName of cleanedTags) {
        if (!tagName || tagName.trim() === "") {
          continue;
        }

        const existingTag = await editingModel.findTagByNameInBackend(tagName);

        if (existingTag && existingTag.id) {
          tagIds.push(existingTag.id);
        } else {
          const result = await editingModel.insertTag(tagName);

          if (result && result.insertId) {
            tagIds.push(result.insertId);
          } else {
            // Important : garder cette erreur pour comprendre si la DB plante
            console.error("Impossible de créer le tag :", tagName);
          }
        }
      }

      if (tagIds.length > 0) {
        const tagPromises = tagIds.map((tagId) =>
          editingMovieModel.addMovieTag(movieId, tagId)
        );
        await Promise.all(tagPromises);
      }
    }

    // INSERT FOCUS
    if (focus && focus.length > 0) {
      const focusIds = focus.map((f) => f.id);

      const focusPromises = focusIds.map((focusId) =>
        editingMovieModel.addMovieFocus(movieId, focusId)
      );

      await Promise.all(focusPromises);
    }

    // Purger les données inutiles
    await purgeModel.purgeOrphanedRecords();

    return res.status(201).json({ message: "Movie successfully created" });
  } catch (error) {
    console.error("Error movie creation :", error);
    return res.status(500).json({ message: "Error movie creation" });
  }
};

//-----------------------------------------------
// DELETE MOVIE
//-----------------------------------------------

const deleteMovie = async (req, res) => {
  const { id } = req.params;
  const movieId = parseInt(id, 10); // Convertit l'ID en entier
  console.info("Tentative de suppression du film avec ID:", movieId);

  try {
    // Récupérer les réalisateurs associés avant de supprimer le film
    const directors = await editingMovieModel.findDirectorsByMovieId(movieId);

    // Récupérer le casting associé avant de supprimer le film
    const castings = await editingMovieModel.findCastingByMovieId(movieId);

    // Récupérer le screenwriter associé avant de supprimer le film
    const screenwriters =
      await editingMovieModel.findScreenwriterByMovieId(movieId);

    // Récupérer le compositor associé avant de supprimer le film
    const musics = await editingMovieModel.findMusicByMovieId(movieId);

    // Récupérer le studio associé avant de supprimer le film
    const studios = await editingMovieModel.findStudioByMovieId(movieId);

    // Récupérer le pays associé avant de supprimer le film
    const countries = await editingMovieModel.findCountryByMovieId(movieId);

    // Récupérer le genre avant de supprimer le film
    const kinds = await editingMovieModel.findKindByMovieId(movieId);

    // Récupérer la langue associée avant de supprimer le film
    const languages = await editingMovieModel.findLanguageByMovieId(movieId);

    // Récupérer le tag avant de supprimer le film
    const tags = await editingMovieModel.findTagByMovieId(movieId);

    // SUPPRESSION DE L'AFFICHE DU FULM
    const movieArray = await editingMovieModel.findMovieById(movieId);
    const movie = movieArray[0];
    const imageUrl = movie.cover;
    if (imageUrl && imageUrl !== "00_cover_default.jpg") {
      try {
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(imageUrl)
        );
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath); // Suppression du fichier
          console.info(`Affiche supprimée avec succès : ${fullPath}`);
        } else {
          console.info(`L'affiche n'existe pas : ${fullPath}`);
        }
      } catch (unlinkError) {
        console.error(
          "Erreur lors de la suppression de l'affiche :",
          unlinkError
        );
      }
    }

    // SUPPRESSION DU FILM
    await editingMovieModel.eraseMovie(movieId);
    console.info("Film supprimé avec succès");

    // Pour chaque directeur, vérifier s'il est lié à d'autres films
    for (const director of directors) {
      const [result] = await editingMovieModel.countMoviesByDirector(
        director.directorId
      );

      if (result.movieCount === 0) {
        await editingController.eraseDirector(
          { params: { id: director.directorId } },
          null
        );
      }
    }

    // Pour chaque casting, vérifier s'il est lié à d'autres films
    for (const casting of castings) {
      const [result] = await editingMovieModel.countMoviesByCasting(
        casting.castingId
      );

      if (result.movieCount === 0) {
        await editingController.eraseCasting(
          { params: { id: casting.castingId } },
          null
        );
      }
    }

    // Pour chaque screenwriter, vérifier s'il est lié à d'autres films
    for (const screenwriter of screenwriters) {
      const [result] = await editingMovieModel.countMoviesByScreenwriter(
        screenwriter.screenwriterId
      );

      if (result.movieCount === 0) {
        await editingController.eraseScreenwriter(
          { params: { id: screenwriter.screenwriterId } },
          null
        );
      }
    }

    // Pour chaque compositeur, vérifier s'il est lié à d'autres films
    for (const music of musics) {
      const [result] = await editingMovieModel.countMoviesByMusic(
        music.musicId
      );

      if (result.movieCount === 0) {
        await editingController.eraseCompositor(
          { params: { id: music.musicId } },
          null
        );
      }
    }

    // Pour chaque studio, vérifier s'il est lié à d'autres films
    for (const studio of studios) {
      const [result] = await editingMovieModel.countMoviesByStudio(
        studio.studioId
      );

      if (result.movieCount === 0) {
        await editingController.eraseStudio(
          { params: { id: studio.studioId } },
          null
        );
      }
    }

    // Pour chaque pays, vérifier s'il est lié à d'autres films
    for (const country of countries) {
      const [result] = await editingMovieModel.countMoviesByCountry(
        country.countryId
      );

      if (result.movieCount === 0) {
        await editingController.eraseCountry(
          { params: { id: country.countryId } },
          null
        );
      }
    }

    // Pour chaque genre, vérifier si il est lié à d'autres films
    for (const kind of kinds) {
      const [result] = await editingMovieModel.countMoviesByKind(kind.genreId);

      if (result.movieCount === 0) {
        await editingModel.deleteGenre(kind.genreId);
      }
    }

    // Pour chaque langue, vérifier si elle est liée à d'autres films
    for (const language of languages) {
      const [result] = await editingMovieModel.countMoviesBylanguage(
        language.languageId
      );

      if (result.movieCount === 0) {
        await editingModel.deleteLanguage(language.languageId);
      }
    }

    // Pour chaque tag, vérifier si il est lié à d'autres films
    for (const tag of tags) {
      const [result] = await editingMovieModel.countMoviesByTag(tag.tagId);

      if (result.movieCount === 0) {
        await editingModel.deleteTag(tag.tagId);
      }
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Erreur durant la suppression du film:", error);
    return res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

//-----------------------------------------------
// EDIT MOVIE
//-----------------------------------------------

const editMovieImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier n'a été téléchargé" });
    }

    const movie = await editingMovieModel.findMovieById(id);
    const currentImageUrl = movie[0].cover;

    // Effacer la précédente image
    if (currentImageUrl !== "00_cover_default.jpg") {
      try {
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          currentImageUrl // Utilisation directe du nom de fichier
        );
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        } else {
          console.info(`Le fichier n'existe pas : ${fullPath}`);
        }
      } catch (unlinkError) {
        console.error(
          "Erreur lors de la suppression du fichier :",
          unlinkError
        );
      }
    }

    // 🔹 Redimensionnement de la nouvelle cover
    await resizeImage("cover", req.file.filename);

    // Mettre à jour la nouvelle image
    const imageUrl = req.file.filename;
    const result = await editingMovieModel.updateMovieImage(imageUrl, id);

    if (result.affectedRows > 0) {
      const updatedMovie = await editingMovieModel.findMovieById(id); // Récupère les infos mises à jour du film
      return res.status(200).json({
        message: "Image successfully updated",
        movie: updatedMovie[0], // Renvoie le film mis à jour, incluant la nouvelle image
      });
    }

    console.error("Erreur lors de la mise à jour de l'image");
    return res.status(500).json({ message: "Error updating image" });
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image :", error);
    return res.status(500).json({ message: "Error updating image" });
  }
};

const editMovieById = async (req, res) => {
  try {
    const {
      title,
      altTitle,
      year,
      duration,
      trailer,
      story,
      location,
      videoFormat,
      videoSupport,
      fileSize,
      vostfr,
      multi,
      genres,
      directors,
      castings,
      screenwriters,
      musics,
      studios,
      countries,
      comment,
      tags,
      isTvShow,
      tvSeasons,
      nbTvEpisodes,
      episodeDuration,
      idTheMovieDb,
      focus,
      // !!! ajouter les update item que l'on envoi par la route !!!
    } = req.body;
    console.info("req.body:", req.body);

    const { id } = req.params;

    await editingMovieModel.updateMovie(
      title,
      altTitle,
      year,
      duration,
      trailer,
      story,
      location,
      videoFormat,
      videoSupport,
      fileSize,
      vostfr,
      multi,
      comment,
      isTvShow,
      tvSeasons,
      nbTvEpisodes,
      episodeDuration,
      idTheMovieDb,
      id
    );

    // Mettre à jour les genres dans la table intermédiaire
    if (genres && genres.length > 0) {
      // Supprimer les genres actuels du film
      await editingMovieModel.eraseKindByMovieId(id);

      // Ajouter les nouveaux genres sélectionnés
      for (const genreId of genres) {
        await editingMovieModel.addMovieKind(id, genreId);
      }
    }

    // Mettre à jour les directors dans la table intermédiaire
    if (directors && directors.length > 0) {
      await editingMovieModel.eraseDirectorByMovieId(id);

      for (const directorId of directors) {
        await editingMovieModel.addMovieDirector(id, directorId);
      }
    }

    // Mettre à jour les castings dans la table intermédiaire
    if (castings && castings.length > 0) {
      await editingMovieModel.eraseCastingByMovieId(id);

      for (const castingId of castings) {
        await editingMovieModel.addMovieCasting(id, castingId);
      }
    }

    // Mettre à jour les screenwriters dans la table intermédiaire
    if (screenwriters && screenwriters.length > 0) {
      await editingMovieModel.eraseScreenwriterByMovieId(id);

      for (const screenwriterId of screenwriters) {
        await editingMovieModel.addMovieScreenwriter(id, screenwriterId);
      }
    }

    // Mettre à jour les compositors dans la table intermédiaire
    if (musics && musics.length > 0) {
      await editingMovieModel.eraseMusicByMovieId(id);

      for (const musicId of musics) {
        await editingMovieModel.addMovieMusic(id, musicId);
      }
    }

    // Mettre à jour les studios dans la table intermédiaire
    if (studios && studios.length > 0) {
      await editingMovieModel.eraseStudioByMovieId(id);

      for (const studioId of studios) {
        await editingMovieModel.addMovieStudio(id, studioId);
      }
    }

    // Mettre à jour les pays dans la table intermédiaire
    if (countries && countries.length > 0) {
      await editingMovieModel.eraseCountryByMovieId(id);

      for (const countryId of countries) {
        await editingMovieModel.addMovieCountry(id, countryId);
      }
    }

    // Mettre à jour les tags dans la table intermédiaire
    if (tags && tags.length > 0) {
      await editingMovieModel.eraseTagByMovieId(id);

      for (const tagId of tags) {
        await editingMovieModel.addMovieTag(id, tagId);
      }
    }

    // Mettre à jour les focus dans la table intermédiaire
    if (focus) {
      await editingMovieModel.eraseFocusByMovieId(id);

      for (const focusId of focus) {
        await editingMovieModel.addMovieFocus(id, focusId);
      }
    }

    // Purger les données inutiles
    await purgeModel.purgeOrphanedRecords();

    // renvoyer l'objet film mis à jour pour rafraichir l'affichage en front
    const updatedMovie = await editingMovieModel.findMovieExtendedById(id);
    // console.info("updatedMovie:", updatedMovie);
    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(500).send("Erreur lors de la mise à jour du film");
  }
};

module.exports = {
  downloadPoster,
  uploadLocalCover,
  addMovie,
  deleteMovie,
  editMovieImage,
  editMovieById,
  updateImageFromUrl,
};
