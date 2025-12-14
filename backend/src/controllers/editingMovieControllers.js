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
const streamifier = require("streamifier");

const { cloudinary, uploadBufferToCloudinary } = require("../utils/cloudinary");
const { resizeAndCropBuffer } = require("../utils/imageUtils");

const { cleanTags } = require("../utils/tags");
const { cleanStudioName } = require("../utils/studio");
const editingController = require("./editingControllers");
const editingModel = require("../models/editingModel");
const editingMovieModel = require("../models/editingMovieModel");
const purgeModel = require("../models/purgeModel");

const DEFAULT_COVER = "00_cover_default.jpg";
const CLOUD_FOLDER = "jmdb/covers";

// -------------------------- Helpers Cloudinary --------------------------

function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    const afterUpload = parts[1];
    const withoutVersion = afterUpload.replace(/^v\d+\//, "");
    const withoutExt = withoutVersion.replace(/\.[a-zA-Z0-9]+(\?.*)?$/, "");
    return withoutExt;
  } catch (e) {
    return null;
  }
}

async function uploadUrlToCloudinary(url, options = {}) {
  return cloudinary.uploader.upload(url, options);
}

async function deleteCloudinaryCoverByFilename(filename) {
  if (!filename || filename === DEFAULT_COVER) return;

  const baseName = filename.replace(/\.[^.]+$/, "");
  const publicId = `${CLOUD_FOLDER}/${baseName}`;

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });

  console.info("🧹 Cloudinary delete:", publicId, result);
}

// -------------------------- Fonctions Cloudinary --------------------------

const downloadPoster = async (posterPathOrUrl, movieId = null) => {
  const source = posterPathOrUrl.startsWith("/")
    ? `https://image.tmdb.org/t/p/original${posterPathOrUrl}`
    : posterPathOrUrl;

  const folder = movieId ? `jmdb/covers/${movieId}` : "jmdb/covers";

  const result = await uploadUrlToCloudinary(source, {
    folder,
    public_id: movieId ? "cover" : undefined,
    overwrite: true,
  });

  return result.secure_url;
};

const uploadLocalCover = async (localFilePath, movieId = null) => {
  const folder = movieId ? `jmdb/covers/${movieId}` : "jmdb/covers";
  const result = await cloudinary.uploader.upload(localFilePath, {
    folder,
    public_id: movieId ? "cover" : undefined,
    overwrite: true,
  });
  return result.secure_url;
};

const uploadLocalCoverToCloudinary = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer)
      return res.status(400).json({ message: "Aucun fichier fourni" });

    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ message: "movieId manquant" });

    const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
      folder: `jmdb/covers/${movieId}`,
      public_id: "cover",
      overwrite: true,
    });

    await editingMovieModel.updateMovieImage(uploadResult.secure_url, movieId);

    return res.status(200).json({
      message: "Image uploadée avec succès",
      url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Erreur uploadLocalCoverToCloudinary :", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'upload", error: error.message });
  }
};

const updateImageFromUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl)
      return res.status(400).json({ message: "Aucune URL fournie" });

    const [movie] = await editingMovieModel.findMovieById(id);
    if (!movie) return res.status(404).json({ message: "Film introuvable" });

    const oldCover = movie.cover;

    // 1️⃣ Télécharger l'image distante
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    // 2️⃣ Resize / crop si nécessaire
    const resizedBuffer = await resizeAndCropBuffer(buffer, 306, 459);

    // 3️⃣ Upload sur Cloudinary via ta fonction existante
    const folder = "jmdb/covers";
    const { publicId, url } = await uploadBufferToCloudinary(
      resizedBuffer,
      folder,
      "cover"
    );

    // 4️⃣ Stocker uniquement le nom du fichier (publicId + extension) en DB
    const filename = `${publicId.split("/").pop()}.jpg`; // garde juste cover-xxx
    await editingMovieModel.updateMovieImage(filename, id);

    // 5️⃣ Supprimer ancienne image si pas par défaut
    if (oldCover && oldCover !== DEFAULT_COVER) {
      const oldPublicId = oldCover.replace(/\.[^.]+$/, "");
      const fullPublicId = oldPublicId.includes("/")
        ? oldPublicId
        : `jmdb/covers/${oldPublicId}`;

      await cloudinary.uploader.destroy(fullPublicId);
      console.info(`🗑️ Ancienne image supprimée : ${fullPublicId}`);
    }

    const [updatedMovie] = await editingMovieModel.findMovieById(id);

    // 6️⃣ Retour front avec URL complète pour affichage immédiat
    return res.status(200).json({
      message: "Image successfully updated",
      movie: updatedMovie,
      secure_url: url,
    });
  } catch (err) {
    console.error("❌ updateImageFromUrl:", err);
    return res
      .status(500)
      .json({ message: "Error updating image", error: err.message });
  }
};

/**
 * ADD MOVIE
 * - insère d'abord le film (avec cover par défaut)
 * - récupère movieId
 * - si req.file présent => upload buffer vers Cloudinary dans jmdb/covers/<movieId>/cover
 * - si req.body.cover est une URL (ex: envoyé depuis TMDB via frontend), on upload aussi et on met à jour
 */
// const addMovie = async (req, res) => {
//   try {
//     const {
//       title,
//       altTitle,
//       year,
//       duration,
//       trailer,
//       pitch,
//       story,
//       location,
//       videoFormat,
//       videoSupport,
//       fileSize,
//       idTheMovieDb,
//       idIMDb,
//       genres = [],
//       directors = [],
//       castings = [],
//       screenwriters = [],
//       compositors = [],
//       studios = [],
//       countries = [],
//       languages = [],
//       tags = [],
//       vostfr,
//       multi,
//       isTvShow,
//       tvSeasons,
//       nbTvEpisodes,
//       episodeDuration,
//       comment,
//       focus = [],
//     } = req.body;

//     if (!title) {
//       return res.status(400).json({ message: "Movie's title is required" });
//     }

//     const normalizeBool = (value) => {
//       if (value === true || value === "true" || value === 1 || value === "1") {
//         return 1;
//       }
//       return 0;
//     };

//     const normalizedIsTvShow = normalizeBool(isTvShow);
//     const normalizedVostfr = normalizeBool(vostfr);
//     const normalizedMulti = normalizeBool(multi);

//     // 1) Insert movie with default cover (so we have movieId)
//     const defaultCover = "00_cover_default.jpg";
//     await editingMovieModel.insertMovie(
//       title,
//       altTitle || null,
//       year || null,
//       duration ? parseInt(duration, 10) : null,
//       defaultCover,
//       trailer || null,
//       pitch || null,
//       story || null,
//       location || null,
//       videoFormat || null,
//       videoSupport || null,
//       fileSize || null,
//       idTheMovieDb || null,
//       idIMDb || null,
//       normalizedVostfr,
//       normalizedMulti,
//       normalizedIsTvShow,
//       tvSeasons || null,
//       nbTvEpisodes || null,
//       episodeDuration || null,
//       comment || null
//     );

//     const [[{ movieId }]] = await editingMovieModel.getLastInsertedMovieId();

//     // 2) Associations (genres, directors, castings, etc.) — on réutilise ta logique existante
//     // (je garde ici exactement ton code pour la création des relations)
//     if (genres && genres.length > 0) {
//       const genrePromises = genres.map((genre) =>
//         editingMovieModel.addMovieKind(movieId, genre.id)
//       );
//       await Promise.all(genrePromises);
//     }

//     if (directors && directors.length > 0) {
//       const directorsPromises = directors.map((directorName) =>
//         editingModel.findDirectorByName(directorName)
//       );
//       const directorsExist = await Promise.all(directorsPromises);
//       const directorIds = [];

//       for (let i = 0; i < directorsExist.length; i++) {
//         const director = directorsExist[i][0];
//         if (!director) {
//           const result = await editingModel.insertDirector(directors[i]);
//           directorIds.push(result.insertId);
//         } else {
//           directorIds.push(director[0].id);
//         }
//       }

//       const directorPromises = directorIds.map((directorId) =>
//         editingMovieModel.addMovieDirector(movieId, directorId)
//       );
//       await Promise.all(directorPromises);
//     }

//     if (castings && castings.length > 0) {
//       const castingsPromises = castings.map((castingName) =>
//         editingModel.findCastingByName(castingName)
//       );
//       const castingExist = await Promise.all(castingsPromises);
//       const castingIds = [];

//       for (let i = 0; i < castingExist.length; i++) {
//         const casting = castingExist[i][0];
//         if (!casting) {
//           const result = await editingModel.insertCasting(castings[i]);
//           castingIds.push(result.insertId);
//         } else {
//           castingIds.push(casting[0].id);
//         }
//       }

//       const castingPromises = castingIds.map((castingId) =>
//         editingMovieModel.addMovieCasting(movieId, castingId)
//       );
//       await Promise.all(castingPromises);
//     }

//     if (screenwriters && screenwriters.length > 0) {
//       const screenwritersPromises = screenwriters.map((screenwriterName) =>
//         editingModel.findScreenwriterByName(screenwriterName)
//       );

//       const screenwriterExist = await Promise.all(screenwritersPromises);
//       const screenwriterIds = [];

//       for (let i = 0; i < screenwriterExist.length; i++) {
//         const screenwriter = screenwriterExist[i][0];
//         if (!screenwriter) {
//           const result = await editingModel.insertScreenwriter(
//             screenwriters[i]
//           );
//           screenwriterIds.push(result.insertId);
//         } else {
//           screenwriterIds.push(screenwriter[0].id);
//         }
//       }

//       const screenwriterPromises = screenwriterIds.map((screenwriterId) =>
//         editingMovieModel.addMovieScreenwriter(movieId, screenwriterId)
//       );

//       await Promise.all(screenwriterPromises);
//     }

//     if (compositors && compositors.length > 0) {
//       const compositorsPromises = compositors.map((compositorName) =>
//         editingModel.findCompositorByName(compositorName)
//       );

//       const compositorExist = await Promise.all(compositorsPromises);
//       const compositorIds = [];

//       for (let i = 0; i < compositorExist.length; i++) {
//         const compositor = compositorExist[i][0];
//         if (!compositor) {
//           const result = await editingModel.insertCompositor(compositors[i]);
//           compositorIds.push(result.insertId);
//         } else {
//           compositorIds.push(compositor[0].id);
//         }
//       }

//       const compositorPromises = compositorIds.map((compositorId) =>
//         editingMovieModel.addMovieMusic(movieId, compositorId)
//       );
//       await Promise.all(compositorPromises);
//     }

//     // Studios
//     if (studios && studios.length > 0) {
//       const studioIds = [];

//       for (let i = 0; i < studios.length; i++) {
//         const rawStudioName = studios[i];
//         const studioName = cleanStudioName(rawStudioName);
//         if (!studioName) continue;

//         const existingStudioId =
//           await editingModel.findStudioByName(studioName);
//         if (existingStudioId) {
//           studioIds.push(existingStudioId);
//         } else {
//           const result = await editingModel.insertStudio(studioName);
//           studioIds.push(result.insertId);
//         }
//       }

//       const studioPromises = studioIds.map((studioId) =>
//         editingMovieModel.addMovieStudio(movieId, studioId)
//       );
//       await Promise.all(studioPromises);
//     }

//     // Countries
//     if (countries && countries.length > 0) {
//       const countriesPromises = countries.map((countryName) =>
//         editingModel.findCountryByName(countryName)
//       );
//       const countryExist = await Promise.all(countriesPromises);
//       const countryIds = [];

//       for (let i = 0; i < countryExist.length; i++) {
//         const country = countryExist[i][0];
//         if (!country) {
//           const result = await editingModel.insertCountry(countries[i]);
//           countryIds.push(result.insertId);
//         } else {
//           countryIds.push(country[0].id);
//         }
//       }

//       const countryPromises = countryIds.map((countryId) =>
//         editingMovieModel.addMovieCountry(movieId, countryId)
//       );
//       await Promise.all(countryPromises);
//     }

//     // Languages
//     if (languages && languages.length > 0) {
//       const languagesPromises = languages.map((languageName) =>
//         editingModel.findLanguageByName(languageName)
//       );
//       const languageExist = await Promise.all(languagesPromises);
//       const languageIds = [];

//       for (let i = 0; i < languageExist.length; i++) {
//         const language = languageExist[i][0];
//         if (!language) {
//           const result = await editingModel.insertLanguage(languages[i]);
//           languageIds.push(result.insertId);
//         } else {
//           languageIds.push(language[0].id);
//         }
//       }

//       const languagePromises = languageIds.map((languageId) =>
//         editingMovieModel.addMovieLanguage(movieId, languageId)
//       );
//       await Promise.all(languagePromises);
//     }

//     // Tags
//     if (tags && tags.length > 0) {
//       const cleanedTags = cleanTags(tags);
//       if (cleanedTags.length > 0) {
//         const tagIds = [];
//         for (const tagName of cleanedTags) {
//           if (!tagName || tagName.trim() === "") continue;
//           const existingTag =
//             await editingModel.findTagByNameInBackend(tagName);
//           if (existingTag && existingTag.id) {
//             tagIds.push(existingTag.id);
//           } else {
//             const result = await editingModel.insertTag(tagName);
//             if (result && result.insertId) tagIds.push(result.insertId);
//           }
//         }
//         if (tagIds.length > 0) {
//           const tagPromises = tagIds.map((tagId) =>
//             editingMovieModel.addMovieTag(movieId, tagId)
//           );
//           await Promise.all(tagPromises);
//         }
//       }
//     }

//     // Focus
//     if (focus && focus.length > 0) {
//       const focusIds = focus.map((f) => f.id);
//       const focusPromises = focusIds.map((focusId) =>
//         editingMovieModel.addMovieFocus(movieId, focusId)
//       );
//       await Promise.all(focusPromises);
//     }

//     // --------------------------
//     // IMAGE HANDLING (POST)
//     // --------------------------

//     try {
//       // 🟢 1️⃣ UPLOAD LOCAL (fichier envoyé via FormData)
//       if (req.file && req.file.buffer) {
//         const resizedBuffer = await resizeAndCropBuffer(
//           req.file.buffer,
//           306,
//           459
//         );

//         const { publicId } = await uploadBufferToCloudinary(
//           resizedBuffer,
//           CLOUD_FOLDER,
//           "cover"
//         );

//         const filename = `${publicId.split("/").pop()}.jpg`;
//         await editingMovieModel.updateMovieImage(filename, movieId);
//       }

//       // 🔵 2️⃣ IMPORT TMDB (URL distante)
//       else if (req.body.coverUrl) {
//         const response = await axios.get(req.body.coverUrl, {
//           responseType: "arraybuffer",
//         });

//         const buffer = Buffer.from(response.data);
//         const resizedBuffer = await resizeAndCropBuffer(buffer, 306, 459);

//         const { publicId } = await uploadBufferToCloudinary(
//           resizedBuffer,
//           CLOUD_FOLDER,
//           "cover"
//         );

//         const filename = `${publicId.split("/").pop()}.jpg`;
//         await editingMovieModel.updateMovieImage(filename, movieId);
//       }
//     } catch (e) {
//       console.error("❌ Erreur upload cover (POST addMovie):", e);
//       // ⚠️ on ne bloque PAS la création du film
//     }

//     // Purge orphan records
//     await purgeModel.purgeOrphanedRecords();

//     return res.status(201).json({ message: "Movie successfully created" });
//   } catch (error) {
//     console.error("Error movie creation :", error);
//     return res.status(500).json({ message: "Error movie creation" });
//   }
// };

const addMovie = async (req, res) => {
  try {
    // --------------------------
    // 1️⃣ Parser le body
    // --------------------------
    const parsedBody = {};
    Object.entries(req.body).forEach(([key, value]) => {
      try {
        parsedBody[key] = JSON.parse(value);
      } catch {
        parsedBody[key] = value;
      }
    });

    // Normaliser les booléens
    const normalizeBool = (val) =>
      val === true || val === "true" || val === 1 || val === "1" ? 1 : 0;
    parsedBody.vostfr = normalizeBool(parsedBody.vostfr);
    parsedBody.multi = normalizeBool(parsedBody.multi);
    parsedBody.isTvShow = normalizeBool(parsedBody.isTvShow);

    // --------------------------
    // 2️⃣ Gestion de l’image avant insertion
    // --------------------------
    let coverFilename = "00_cover_default.jpg"; // valeur par défaut

    if (req.file?.buffer) {
      // IMAGE LOCALE
      const resizedBuffer = await resizeAndCropBuffer(
        req.file.buffer,
        306,
        459
      );
      const { publicId } = await uploadBufferToCloudinary(
        resizedBuffer,
        CLOUD_FOLDER,
        "cover"
      );
      coverFilename = `${publicId.split("/").pop()}.jpg`;
    } else if (parsedBody.coverUrl) {
      // IMAGE TMDB
      const imageResponse = await fetch(parsedBody.coverUrl);
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      const resizedBuffer = await resizeAndCropBuffer(buffer, 306, 459);
      const { publicId } = await uploadBufferToCloudinary(
        resizedBuffer,
        CLOUD_FOLDER,
        "cover"
      );
      coverFilename = `${publicId.split("/").pop()}.jpg`;
    }

    parsedBody.cover = coverFilename;

    // --------------------------
    // 3️⃣ Création du film
    // --------------------------
    const movieId = await editingMovieModel.insertMovie(parsedBody);

    // --------------------------
    // 4️⃣ Gestion des relations
    // --------------------------
    // genres
    if (parsedBody.genres?.length > 0) {
      await Promise.all(
        parsedBody.genres.map((g) =>
          editingMovieModel.addMovieKind(movieId, g.id)
        )
      );
    }

    // directors
    if (parsedBody.directors?.length > 0) {
      const directorIds = [];
      for (const name of parsedBody.directors) {
        console.log("➡️ Processing director:", name);

        const [rows] = await editingModel.findDirectorByName(name);
        let existing = rows[0];
        console.log("   Found in DB:", existing);

        if (!existing) {
          console.log("   Director not found, inserting:", name);
          await editingModel.insertDirector(name);
          const [rowsAfter] = await editingModel.findDirectorByName(name);
          existing = rowsAfter[0];
          console.log("   After insert, found:", existing);
        }

        if (!existing?.id)
          console.warn("⚠️ Could not get ID for director:", name);
        else directorIds.push(existing.id);
      }

      await Promise.all(
        directorIds.map((id) => editingMovieModel.addMovieDirector(movieId, id))
      );
      console.log("   Directors linked to movieId:", movieId);
    }

    // castings
    if (parsedBody.castings?.length > 0) {
      const castingIds = [];
      for (const name of parsedBody.castings) {
        const [rows] = await editingModel.findCastingByName(name);
        let existing = rows[0];
        if (!existing) {
          const result = await editingModel.insertCasting(name);
          const [rowsAfter] = await editingModel.findCastingByName(name);
          existing = rowsAfter[0];
        }
        if (existing?.id) castingIds.push(existing.id);
      }
      await Promise.all(
        castingIds.map((id) => editingMovieModel.addMovieCasting(movieId, id))
      );
    }

    // screenwriters
    if (parsedBody.screenwriters?.length > 0) {
      const screenwriterIds = [];
      for (const name of parsedBody.screenwriters) {
        const [rows] = await editingModel.findScreenwriterByName(name);
        let existing = rows[0];
        if (!existing) {
          const result = await editingModel.insertScreenwriter(name);
          const [rowsAfter] = await editingModel.findScreenwriterByName(name);
          existing = rowsAfter[0];
        }
        if (existing?.id) screenwriterIds.push(existing.id);
      }
      await Promise.all(
        screenwriterIds.map((id) =>
          editingMovieModel.addMovieScreenwriter(movieId, id)
        )
      );
    }

    // compositors
    if (parsedBody.compositors?.length > 0) {
      const compositorIds = [];
      for (const name of parsedBody.compositors) {
        const [rows] = await editingModel.findCompositorByName(name);
        let existing = rows[0];
        if (!existing) {
          const result = await editingModel.insertCompositor(name);
          const [rowsAfter] = await editingModel.findCompositorByName(name);
          existing = rowsAfter[0];
        }
        if (existing?.id) compositorIds.push(existing.id);
      }
      await Promise.all(
        compositorIds.map((id) => editingMovieModel.addMovieMusic(movieId, id))
      );
    }

    // studios
    if (parsedBody.studios?.length > 0) {
      const studioIds = [];
      for (const raw of parsedBody.studios) {
        const name = cleanStudioName(raw);
        if (!name) continue;

        let existingId = await editingModel.findStudioByName(name);
        console.log("➡️ Processing studio:", name);
        console.log("   Found in DB ID:", existingId);

        if (!existingId) {
          console.log("   Studio not found, inserting:", name);
          const result = await editingModel.insertStudio(name);
          console.log("   Insert result:", result[0]); // insertId dans result[0].insertId
          existingId = result[0].insertId;
        }

        if (existingId) studioIds.push(existingId);
        else console.warn("⚠️ Could not get ID for studio:", name);
      }

      console.log("   Studio IDs to link:", studioIds);

      await Promise.all(
        studioIds.map((id) => editingMovieModel.addMovieStudio(movieId, id))
      );

      console.log("   Studios linked to movieId:", movieId);
    }

    // countries
    if (parsedBody.countries?.length > 0) {
      const countryIds = [];
      for (const country of parsedBody.countries) {
        const [rows] = await editingModel.findCountryByName(country);
        let existing = rows[0];
        if (!existing) {
          const result = await editingModel.insertCountry(country);
          const [rowsAfter] = await editingModel.findCountryByName(country);
          existing = rowsAfter[0];
        }
        if (existing?.id) countryIds.push(existing.id);
      }
      await Promise.all(
        countryIds.map((id) => editingMovieModel.addMovieCountry(movieId, id))
      );
    }

    // languages
    if (parsedBody.languages?.length > 0) {
      const languageIds = [];
      for (const language of parsedBody.languages) {
        const [rows] = await editingModel.findLanguageByName(language);
        let existing = rows[0];
        if (!existing) {
          const result = await editingModel.insertLanguage(language);
          const [rowsAfter] = await editingModel.findLanguageByName(language);
          existing = rowsAfter[0];
        }
        if (existing?.id) languageIds.push(existing.id);
      }
      await Promise.all(
        languageIds.map((id) => editingMovieModel.addMovieLanguage(movieId, id))
      );
    }

    // tags
    if (parsedBody.tags?.length > 0) {
      const tagIds = [];
      const cleanedTags = cleanTags(parsedBody.tags);

      for (const t of cleanedTags) {
        if (!t?.trim()) continue;

        let existing = await editingModel.findTagByNameInBackend(t);
        console.log("➡️ Processing tag:", t, "Found in DB:", existing);

        if (!existing?.id) {
          console.log("   Tag not found, inserting:", t);
          const insertId = await editingModel.insertTag(t);
          existing = { id: insertId };
          console.log("   After insert, ID:", insertId);
        }

        if (existing?.id) tagIds.push(existing.id);
        else console.warn("⚠️ Could not get ID for tag:", t);
      }

      console.log("   Tag IDs to link:", tagIds);

      await Promise.all(
        tagIds.map((id) => editingMovieModel.addMovieTag(movieId, id))
      );

      console.log("   Tags linked to movieId:", movieId);
    }

    // focus
    if (parsedBody.focus?.length > 0) {
      await Promise.all(
        parsedBody.focus.map((f) =>
          editingMovieModel.addMovieFocus(movieId, f.id)
        )
      );
    }

    // --------------------------
    // 5️⃣ Réponse front
    // --------------------------
    const coverUrl =
      coverFilename === "00_cover_default.jpg"
        ? DEFAULT_COVER
        : cloudinary.url(`${CLOUD_FOLDER}/${coverFilename}`);
    res.status(201).json({ message: "Film créé", movieId, coverUrl });
  } catch (error) {
    console.error("❌ addMovie error:", error);
    res.status(500).json({ error: "Erreur lors de la création du film" });
  }
};

// -------------------------- DELETE MOVIE (supprime aussi l'image Cloudinary) --------------------------

const deleteMovie = async (req, res) => {
  const { id } = req.params;
  const movieId = Number(id);

  console.info("🗑️ Tentative de suppression du film avec ID:", movieId);

  try {
    // 1️⃣ Récupérer le film
    const [movie] = await editingMovieModel.findMovieById(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Film introuvable" });
    }

    // 2️⃣ Supprimer l’image Cloudinary (si pas défaut)
    if (movie.cover && movie.cover !== DEFAULT_COVER) {
      // movie.cover = "cover-uuid.jpg"
      const baseName = movie.cover.replace(/\.[^.]+$/, "");
      const publicId = `jmdb/covers/${baseName}`;

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true, // 🔥 indispensable (cache CDN)
      });

      console.info("🧹 Cloudinary delete:", publicId, result);
    }

    // 3️⃣ Supprimer le film en base
    await editingMovieModel.eraseMovie(movieId);

    // 4️⃣ Réponse
    return res.status(200).json({
      message: "Film supprimé avec succès",
      movieId,
    });
  } catch (err) {
    console.error("❌ Erreur deleteMovie:", err);
    return res.status(500).json({
      message: "Erreur lors de la suppression",
      error: err.message,
    });
  }
};

// -------------------------- EDIT MOVIE IMAGE (upload via req.file.buffer) --------------------------

// const editMovieImage = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // accepter soit req.file.buffer, soit body.imageUrl
//     const fileBuffer = req.file ? req.file.buffer : null;
//     const { imageUrl } = req.body;

//     if (!fileBuffer && !imageUrl) {
//       return res.status(400).json({ message: "Aucune image fournie" });
//     }

//     // récupérer l'ancienne image pour suppression éventuelle
//     const [movieRow] = await editingMovieModel.findMovieById(id);
//     const currentImageUrl = movieRow?.cover;

//     let uploadResult;
//     if (fileBuffer) {
//       uploadResult = await uploadBufferToCloudinary(fileBuffer, {
//         folder: `jmdb/covers/${id}`,
//         public_id: "cover",
//         overwrite: true,
//       });
//     } else if (imageUrl) {
//       uploadResult = await uploadUrlToCloudinary(imageUrl, {
//         folder: `jmdb/covers/${id}`,
//         public_id: "cover",
//         overwrite: true,
//       });
//     }

//     if (!uploadResult || !uploadResult.secure_url) {
//       return res.status(500).json({ message: "Erreur lors de l'upload" });
//     }

//     const newCoverUrl = uploadResult.secure_url;

//     // mettre à jour la base avec la nouvelle URL
//     await editingMovieModel.updateMovieImage(newCoverUrl, id);

//     // supprimer l'ancienne image Cloudinary si nécessaire
//     if (currentImageUrl && currentImageUrl !== "00_cover_default.jpg") {
//       await deleteCloudinaryImageFromUrl(currentImageUrl);
//     }

//     const [updatedMovie] = await editingMovieModel.findMovieById(id);
//     return res
//       .status(200)
//       .json({ message: "Image successfully updated", movie: updatedMovie });
//   } catch (error) {
//     console.error("Erreur lors du téléchargement de l'image :", error);
//     return res
//       .status(500)
//       .json({ message: "Error updating image", error: error.message });
//   }
// };

const editMovieImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file || !req.file.buffer)
      return res.status(400).json({ message: "Aucun fichier fourni" });

    const [movie] = await editingMovieModel.findMovieById(id);
    if (!movie) return res.status(404).json({ message: "Film introuvable" });

    const oldCover = movie.cover;

    // 🗑️ Suppression ancienne image Cloudinary
    if (oldCover && oldCover !== DEFAULT_COVER) {
      try {
        const publicId = `${CLOUD_FOLDER}/${oldCover.replace(/\.[^.]+$/, "")}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("❌ Cloudinary delete error:", err);
      }
    }

    // 🔄 Resize & crop (AFFICHE 2:3)
    const resizedBuffer = await resizeAndCropBuffer(req.file.buffer, 306, 459);

    // ☁ Upload Cloudinary
    const { publicId, url } = await uploadBufferToCloudinary(
      resizedBuffer,
      CLOUD_FOLDER,
      "cover"
    );

    const filenameOnly = publicId.split("/").pop();
    const filename = `${filenameOnly}.jpg`;

    // 💾 Update BDD (ON STOCKE LE NOM, PAS L’URL)
    await editingMovieModel.updateMovieImage(filename, id);

    return res.status(200).json({
      message: "Image successfully updated",
      filename,
      url,
    });
  } catch (error) {
    console.error("❌ editMovieImage:", error);
    return res.status(500).json({ message: "Error updating image" });
  }
};

// -------------------------- EDIT MOVIE (update meta data) --------------------------

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
    } = req.body;
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

    // Genres
    if (genres && genres.length > 0) {
      await editingMovieModel.eraseKindByMovieId(id);
      for (const genreId of genres) {
        await editingMovieModel.addMovieKind(id, genreId);
      }
    }

    // Directors
    if (directors && directors.length > 0) {
      await editingMovieModel.eraseDirectorByMovieId(id);
      for (const directorId of directors) {
        await editingMovieModel.addMovieDirector(id, directorId);
      }
    }

    // Castings
    if (castings && castings.length > 0) {
      await editingMovieModel.eraseCastingByMovieId(id);
      for (const castingId of castings) {
        await editingMovieModel.addMovieCasting(id, castingId);
      }
    }

    // Screenwriters
    if (screenwriters && screenwriters.length > 0) {
      await editingMovieModel.eraseScreenwriterByMovieId(id);
      for (const screenwriterId of screenwriters) {
        await editingMovieModel.addMovieScreenwriter(id, screenwriterId);
      }
    }

    // Musics
    if (musics && musics.length > 0) {
      await editingMovieModel.eraseMusicByMovieId(id);
      for (const musicId of musics) {
        await editingMovieModel.addMovieMusic(id, musicId);
      }
    }

    // Studios
    if (studios && studios.length > 0) {
      await editingMovieModel.eraseStudioByMovieId(id);
      for (const studioId of studios) {
        await editingMovieModel.addMovieStudio(id, studioId);
      }
    }

    // Countries
    if (countries && countries.length > 0) {
      await editingMovieModel.eraseCountryByMovieId(id);
      for (const countryId of countries) {
        await editingMovieModel.addMovieCountry(id, countryId);
      }
    }

    // Tags
    if (tags && tags.length > 0) {
      await editingMovieModel.eraseTagByMovieId(id);
      for (const tagId of tags) {
        await editingMovieModel.addMovieTag(id, tagId);
      }
    }

    // Focus
    if (focus) {
      await editingMovieModel.eraseFocusByMovieId(id);
      for (const focusId of focus) {
        await editingMovieModel.addMovieFocus(id, focusId);
      }
    }

    // Purger
    await purgeModel.purgeOrphanedRecords();

    const updatedMovie = await editingMovieModel.findMovieExtendedById(id);
    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error("Erreur editMovieById :", error);
    res.status(500).send("Erreur lors de la mise à jour du film");
  }
};

module.exports = {
  downloadPoster,
  addMovie,
  deleteMovie,
  editMovieImage,
  editMovieById,
  updateImageFromUrl,
  uploadLocalCoverToCloudinary,
  uploadLocalCover,
};
