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
const { cloudinary, uploadBufferToCloudinary } = require("../utils/cloudinary");
const { resizeAndCropBuffer } = require("../utils/imageUtils");

const { cleanTags } = require("../utils/tags");
const { cleanStudioName } = require("../utils/studio");
const editingModel = require("../models/editingModel");
const editingMovieModel = require("../models/editingMovieModel");
const purgeModel = require("../models/purgeModel");

const DEFAULT_COVER = "00_cover_default.jpg";
const CLOUD_FOLDER = "jmdb/covers";

// -------------------------- Fonctions Cloudinary --------------------------

const uploadLocalCover = async (localFilePath, movieId = null) => {
  const folder = movieId ? `jmdb/covers/${movieId}` : "jmdb/covers";
  const result = await cloudinary.uploader.upload(localFilePath, {
    folder,
    public_id: movieId ? "cover" : undefined,
    overwrite: true,
  });
  return result.secure_url;
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

// -------------------------- ADD MOVIE --------------------------

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
        const [rows] = await editingModel.findDirectorByName(name);
        let existing = rows[0];

        if (!existing) {
          await editingModel.insertDirector(name);
          const [rowsAfter] = await editingModel.findDirectorByName(name);
          existing = rowsAfter[0];
        }

        if (!existing?.id)
          console.warn("⚠️ Could not get ID for director:", name);
        else directorIds.push(existing.id);
      }

      await Promise.all(
        directorIds.map((id) => editingMovieModel.addMovieDirector(movieId, id))
      );
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

        if (!existingId) {
          const result = await editingModel.insertStudio(name);
          existingId = result[0].insertId;
        }

        if (existingId) studioIds.push(existingId);
        else console.warn("⚠️ Could not get ID for studio:", name);
      }

      await Promise.all(
        studioIds.map((id) => editingMovieModel.addMovieStudio(movieId, id))
      );
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

        if (!existing?.id) {
          const insertId = await editingModel.insertTag(t);
          existing = { id: insertId };
        }

        if (existing?.id) tagIds.push(existing.id);
        else console.warn("⚠️ Could not get ID for tag:", t);
      }

      await Promise.all(
        tagIds.map((id) => editingMovieModel.addMovieTag(movieId, id))
      );
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
  addMovie,
  deleteMovie,
  editMovieImage,
  editMovieById,
  updateImageFromUrl,
  uploadLocalCover,
};
