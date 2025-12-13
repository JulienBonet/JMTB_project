/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
const { cleanTags } = require("../utils/tags");
const { cleanStudioName } = require("../utils/studio");

const { uploadBufferToCloudinary, cloudinary } = require("../utils/cloudinary");
const { resizeAndCropBuffer } = require("../utils/imageUtils");

const editingModel = require("../models/editingModel");

const DEFAULT_IMAGE = "00_item_default.png";
const CLOUD_FOLDER = "jmdb/covers";

//-----------------------------
// EDIT DIRECTOR
//-----------------------------
const addDirector = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Director's name is required" });
    }
    await editingModel.insertDirector(name);

    return res.status(201).json({ message: "Director successfully created" });
  } catch (error) {
    console.error("Error director creation :", error);
    return res.status(500).json({ message: "Error director creation" });
  }
};

const editingDirector = async (req, res) => {
  try {
    const {
      name,
      pitch,
      wikilink,
      imdblink,
      senscritiquelink,
      websitelink,
      birthDate,
      deathDate,
      isFocus,
    } = req.body;
    const { id } = req.params;

    const existing = await editingModel.findDirectorById(id);
    if (!existing.length) {
      return res.status(404).json({ message: "Director not found" });
    }

    const old = existing[0];

    // Détection des changements
    const noChange =
      old.name === name &&
      old.pitch === pitch &&
      old.wikilink === wikilink &&
      old.imdblink === imdblink &&
      old.senscritiquelink === senscritiquelink &&
      old.websitelink === websitelink &&
      old.birthDate === birthDate &&
      old.deathDate === deathDate &&
      old.isFocus === isFocus;

    if (noChange) {
      return res
        .status(400)
        .json({ message: "No change detected for director" });
    }

    // Mise à jour
    const result = await editingModel.editDirector(
      name,
      pitch,
      wikilink,
      imdblink,
      senscritiquelink,
      websitelink,
      birthDate,
      deathDate,
      isFocus,
      id
    );

    if (result.affectedRows !== 0) {
      return res.status(200).json({ message: "Director successfully updated" });
    }
    return res.status(400).json({ message: "Error updating director" });
  } catch (error) {
    console.error("Stack trace :", error.stack);
    return res.status(500).json({ message: "Error updating director" });
  }
};

const uploadDirectorImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file || !req.file.buffer)
      return res.status(400).json({ message: "Aucun fichier fourni" });

    const [director] = await editingModel.findDirectorById(id);
    if (!director)
      return res.status(404).json({ message: "Director introuvable" });

    const oldImage = director.image;

    // 🗑️ Supprim ancienne image Cloudinary
    if (oldImage && oldImage !== DEFAULT_IMAGE) {
      try {
        const publicId = `${CLOUD_FOLDER}/${oldImage.replace(/\.[^.]+$/, "")}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("❌ Cloudinary delete error:", err);
      }
    }

    // 🔄 Resize 1:1
    const resizedBuffer = await resizeAndCropBuffer(req.file.buffer, 500, 500);

    // ☁ Upload Cloudinary
    const { publicId, url } = await uploadBufferToCloudinary(
      resizedBuffer,
      CLOUD_FOLDER,
      "director"
    );

    const filenameOnly = publicId.split("/").pop();
    const filename = `${filenameOnly}.jpg`;

    await editingModel.editDirectorImage(filename, id);

    return res
      .status(200)
      .json({ message: "Image successfully updated", filename, url });
  } catch (err) {
    console.error("❌ uploadDirectorImage:", err);
    return res.status(500).json({ message: "Error updating image" });
  }
};

const eraseDirector = async (req, res = null) => {
  try {
    const directorId = req.params.id;
    const rows = await editingModel.findDirectorById(directorId);
    if (!rows || rows.length === 0) {
      if (res) return res.status(404).json({ message: "Director non trouvé" });
      return;
    }

    const imageUrl = rows[0].image;

    // ☁ delete Cloudinary
    if (imageUrl && imageUrl !== DEFAULT_IMAGE) {
      try {
        const publicId = `${CLOUD_FOLDER}/${imageUrl.replace(/\.[^.]+$/, "")}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("❌ Cloudinary delete error:", err);
      }
    }

    await editingModel.deleteDirector(directorId);
    if (res) res.sendStatus(204);
  } catch (err) {
    if (res) res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

//-----------------------------
// EDIT CASTING
//-----------------------------
const addCasting = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Casting's name is required" });
    }
    await editingModel.insertCasting(name);

    return res.status(201).json({ message: "Casting successfully created" });
  } catch (error) {
    console.error("Error Casting creation :", error);
    return res.status(500).json({ message: "Error Casting creation" });
  }
};

const editingCasting = async (req, res) => {
  try {
    const { name, pitch, wikilink, imdblink, birthDate, deathDate, isFocus } =
      req.body;
    const { id } = req.params;

    const existing = await editingModel.findCastingById(id);
    if (!existing.length) {
      return res.status(404).json({ message: "Casting not found" });
    }

    const old = existing[0];

    // Vérifier les changements
    const noChange =
      old.name === name &&
      old.pitch === pitch &&
      old.wikilink === wikilink &&
      old.imdblink === imdblink &&
      old.birthDate === birthDate &&
      old.deathDate === deathDate &&
      old.isFocus === isFocus;

    if (noChange) {
      return res
        .status(400)
        .json({ message: "No change detected for casting" });
    }

    // Mise à jour
    const result = await editingModel.editCasting(
      name,
      pitch,
      wikilink,
      imdblink,
      birthDate,
      deathDate,
      isFocus,
      id
    );

    if (result.affectedRows !== 0) {
      return res.status(200).json({ message: "Casting successfully updated" });
    }
    return res.status(400).json({ message: "Error updating casting" });
  } catch (error) {
    console.error("Stack trace :", error.stack);
    return res.status(500).json({ message: "Error updating casting" });
  }
};

const uploadCastingImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file || !req.file.buffer)
      return res.status(400).json({ message: "Aucun fichier fourni" });

    const [casting] = await editingModel.findCastingById(id);
    if (!casting)
      return res.status(404).json({ message: "Casting introuvable" });

    const oldImage = casting.image;

    if (oldImage && oldImage !== DEFAULT_IMAGE) {
      try {
        const publicId = `${CLOUD_FOLDER}/${oldImage.replace(/\.[^.]+$/, "")}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("❌ delete cast:", err);
      }
    }

    const resizedBuffer = await resizeAndCropBuffer(req.file.buffer, 500, 500);

    const { publicId, url } = await uploadBufferToCloudinary(
      resizedBuffer,
      CLOUD_FOLDER,
      "casting"
    );

    const filename = `${publicId.split("/").pop()}.jpg`;
    await editingModel.editCastingImage(filename, id);

    return res.status(200).json({ message: "Image updated", filename, url });
  } catch (err) {
    console.error("❌ uploadCastingImage:", err);
    res.status(500).json({ message: "Error updating image" });
  }
};

const eraseCasting = async (req, res = null) => {
  try {
    const castingId = req.params.id;
    const rows = await editingModel.findCastingById(castingId);
    if (!rows.length) {
      if (res) return res.status(404).json({ message: "Casting non trouvé" });
      return;
    }

    const imageUrl = rows[0].image;

    if (imageUrl && imageUrl !== DEFAULT_IMAGE) {
      try {
        const publicId = `${CLOUD_FOLDER}/${imageUrl.replace(/\.[^.]+$/, "")}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("❌ delete cast:", err);
      }
    }

    await editingModel.deleteCasting(castingId);
    if (res) res.sendStatus(204);
  } catch (err) {
    if (res) res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

//-----------------------------
// EDIT SCREENWRITER
//-----------------------------
const addScreenwriter = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Screenwriter's name is required" });
    }
    await editingModel.insertScreenwriter(name);

    return res
      .status(201)
      .json({ message: "Screenwriter successfully created" });
  } catch (error) {
    console.error("Error Screenwriter creation :", error);
    return res.status(500).json({ message: "Error Screenwriter creation" });
  }
};

const editingScreenwriter = async (req, res) => {
  try {
    const { name, pitch, wikilink, imdblink } = req.body;
    const { id } = req.params;

    const existingScreenwriter = await editingModel.findScreenwriterById(id);
    if (
      existingScreenwriter[0].name === name &&
      existingScreenwriter[0].pitch === pitch &&
      existingScreenwriter[0].wikilink === wikilink &&
      existingScreenwriter[0].imdblink === imdblink
    ) {
      return res
        .status(400)
        .json({ message: "Error updating Screenwriter: no changes detected" });
    }

    const result = await editingModel.editScreenwriter(
      name,
      pitch,
      wikilink,
      imdblink,
      id
    );

    if (result.affectedRows !== 0) {
      return res
        .status(200)
        .json({ message: "Screenwriter successfully updated" });
    }
    return res.status(400).json({ message: "Error updating Screenwriter" });
  } catch (error) {
    console.error("Stack trace :", error.stack);
    return res.status(500).json({ message: "Error updating Screenwriter" });
  }
};

const uploadScreenwriterImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file || !req.file.buffer)
      return res.status(400).json({ message: "Aucun fichier fourni" });

    const [row] = await editingModel.findScreenwriterById(id);
    if (!row)
      return res.status(404).json({ message: "Screenwriter introuvable" });

    const oldImage = row.image;
    if (oldImage && oldImage !== DEFAULT_IMAGE) {
      try {
        const publicId = `${CLOUD_FOLDER}/${oldImage.replace(/\.[^.]+$/, "")}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("❌ delete screenwriter:", err);
      }
    }

    const resizedBuffer = await resizeAndCropBuffer(req.file.buffer, 500, 500);

    const { publicId, url } = await uploadBufferToCloudinary(
      resizedBuffer,
      CLOUD_FOLDER,
      "screenwriter"
    );

    const filename = `${publicId.split("/").pop()}.jpg`;
    await editingModel.editScreenwriterImage(filename, id);

    return res.status(200).json({ message: "Image updated", filename, url });
  } catch (err) {
    console.error("❌ uploadScreenwriterImage:", err);
    res.status(500).json({ message: "Error updating image" });
  }
};

const eraseScreenwriter = async (req, res = null) => {
  try {
    const id = req.params.id;

    const rows = await editingModel.findScreenwriterById(id);
    if (!rows.length) {
      if (res)
        return res.status(404).json({ message: "Screenwriter non trouvé" });
      return;
    }

    const imageUrl = rows[0].image;

    if (imageUrl && imageUrl !== DEFAULT_IMAGE) {
      try {
        const pub = `${CLOUD_FOLDER}/${imageUrl.replace(/\.[^.]+$/, "")}`;
        await cloudinary.uploader.destroy(pub);
      } catch (err) {
        console.error("❌ delete screenwriter:", err);
      }
    }

    await editingModel.deleteScreenwriter(id);
    if (res) res.sendStatus(204);
  } catch (err) {
    if (res) res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

//-----------------------------
// EDIT COMPOSITOR
//-----------------------------

const addCompositor = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Compositor's name is required" });
    }
    await editingModel.insertCompositor(name);

    return res.status(201).json({ message: "Compositor successfully created" });
  } catch (error) {
    console.error("Error Compositor creation :", error);
    return res.status(500).json({ message: "Error Compositor creation" });
  }
};

const editingCompositor = async (req, res) => {
  try {
    const { name, pitch, wikilink, imdblink } = req.body;
    const { id } = req.params;

    const existingCompositor = await editingModel.findCompositorById(id);
    if (
      existingCompositor[0].name === name &&
      existingCompositor[0].pitch === pitch &&
      existingCompositor[0].wikilink === wikilink &&
      existingCompositor[0].imdblink === imdblink
    ) {
      return res
        .status(400)
        .json({ message: "Error updating Compositor: no changes detected" });
    }

    const result = await editingModel.editCompositor(
      name,
      pitch,
      wikilink,
      imdblink,
      id
    );

    if (result.affectedRows !== 0) {
      return res
        .status(200)
        .json({ message: "Compositor successfully updated" });
    }
    return res.status(400).json({ message: "Error updating Compositor" });
  } catch (error) {
    console.error("Stack trace :", error.stack);
    return res.status(500).json({ message: "Error updating Compositor" });
  }
};

const uploadCompositorImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file?.buffer)
      return res.status(400).json({ message: "Aucun fichier fourni" });

    const [row] = await editingModel.findCompositorById(id);
    if (!row)
      return res.status(404).json({ message: "Compositor introuvable" });

    const old = row.image;
    if (old && old !== DEFAULT_IMAGE) {
      try {
        const pub = `${CLOUD_FOLDER}/${old.replace(/\.[^.]+$/, "")}`;
        await cloudinary.uploader.destroy(pub);
      } catch (err) {
        console.error("❌ delete compositor:", err);
      }
    }

    const resized = await resizeAndCropBuffer(req.file.buffer, 500, 500);

    const { publicId, url } = await uploadBufferToCloudinary(
      resized,
      CLOUD_FOLDER,
      "compositor"
    );

    const filename = `${publicId.split("/").pop()}.jpg`;
    await editingModel.editCompositorImage(filename, id);

    return res.status(200).json({ filename, url });
  } catch (err) {
    console.error("❌ uploadCompositorImage:", err);
    res.status(500).json({ message: "Error updating image" });
  }
};

const eraseCompositor = async (req, res = null) => {
  try {
    const id = req.params.id;

    const rows = await editingModel.findCompositorById(id);
    if (!rows.length) {
      if (res)
        return res.status(404).json({ message: "Compositor non trouvé" });
      return;
    }

    const imageUrl = rows[0].image;

    if (imageUrl && imageUrl !== DEFAULT_IMAGE) {
      try {
        const pub = `${CLOUD_FOLDER}/${imageUrl.replace(/\.[^.]+$/, "")}`;
        await cloudinary.uploader.destroy(pub);
      } catch (err) {
        console.error("❌ delete compositor:", err);
      }
    }

    await editingModel.deleteCompositor(id);
    if (res) res.sendStatus(204);
  } catch (err) {
    if (res) res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

//-----------------------------
// EDIT STUDIO
//-----------------------------

const addStudio = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Studio's name is required" });
    }

    // 🔥 Nettoyage du nom
    const cleanedName = cleanStudioName(name);

    await editingModel.insertStudio(cleanedName);

    return res.status(201).json({ message: "Studio successfully created" });
  } catch (error) {
    console.error("Error Studio creation :", error);
    return res.status(500).json({ message: "Error Studio creation" });
  }
};

const editingStudio = async (req, res) => {
  try {
    const { name, pitch, wikilink, imdblink } = req.body;
    const { id } = req.params;

    const existingStudio = await editingModel.findStudioById(id);
    if (
      existingStudio[0].name === name &&
      existingStudio[0].pitch === pitch &&
      existingStudio[0].wikilink === wikilink &&
      existingStudio[0].imdblink === imdblink
    ) {
      return res
        .status(400)
        .json({ message: "Error updating Studio: no changes detected" });
    }

    const result = await editingModel.editStudio(
      name,
      pitch,
      wikilink,
      imdblink,
      id
    );

    if (result.affectedRows !== 0) {
      return res.status(200).json({ message: "Studio successfully updated" });
    }
    return res.status(400).json({ message: "Error updating Studio" });
  } catch (error) {
    console.error("Stack trace :", error.stack);
    return res.status(500).json({ message: "Error updating Studio" });
  }
};

const uploadStudioImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file?.buffer)
      return res.status(400).json({ message: "Aucun fichier fourni" });

    const [row] = await editingModel.findStudioById(id);
    if (!row) return res.status(404).json({ message: "Studio introuvable" });

    const old = row.image;
    if (old && old !== "00_jmtb_item_default.jpg") {
      try {
        const pub = `${CLOUD_FOLDER}/${old.replace(/\.[^.]+$/, "")}`;
        await cloudinary.uploader.destroy(pub);
      } catch (err) {
        console.error("❌ delete studio:", err);
      }
    }

    const resized = await resizeAndCropBuffer(req.file.buffer, 500, 500);

    const { publicId, url } = await uploadBufferToCloudinary(
      resized,
      CLOUD_FOLDER,
      "studio"
    );

    const filename = `${publicId.split("/").pop()}.jpg`;
    await editingModel.editStudioImage(filename, id);

    return res.status(200).json({ filename, url });
  } catch (err) {
    console.error("❌ uploadStudioImage:", err);
    res.status(500).json({ message: "Error updating image" });
  }
};

const eraseStudio = async (req, res = null) => {
  try {
    const id = req.params.id;

    const rows = await editingModel.findStudioById(id);
    if (!rows.length) {
      if (res) return res.status(404).json({ message: "Studio non trouvé" });
      return;
    }

    const imageUrl = rows[0].image;

    if (imageUrl && imageUrl !== DEFAULT_IMAGE) {
      try {
        const pub = `${CLOUD_FOLDER}/${imageUrl.replace(/\.[^.]+$/, "")}`;
        await cloudinary.uploader.destroy(pub);
      } catch (err) {
        console.error("❌ delete studio:", err);
      }
    }

    await editingModel.deleteStudio(id);
    if (res) res.sendStatus(204);
  } catch (err) {
    if (res) res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

//-----------------------------
// EDIT COUNTRY
//-----------------------------

const addCountry = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Country's name is required" });
    }
    await editingModel.insertCountry(name);

    return res.status(201).json({ message: "Country successfully created" });
  } catch (error) {
    console.error("Error Country creation :", error);
    return res.status(500).json({ message: "Error Country creation" });
  }
};

const editingCountry = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const existingcountry = await editingModel.findCountryById(id);
    if (existingcountry[0].name === name) {
      return res
        .status(400)
        .json({ message: "Error updating Country: no changes detected" });
    }

    const result = await editingModel.editCountry(name, id);

    if (result.affectedRows !== 0) {
      return res.status(200).json({ message: "Country successfully updated" });
    }
    return res.status(400).json({ message: "Error updating Country" });
  } catch (error) {
    console.error("Stack trace :", error.stack);
    return res.status(500).json({ message: "Error updating Country" });
  }
};

const uploadCountryImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file?.buffer)
      return res.status(400).json({ message: "Aucun fichier fourni" });

    const [country] = await editingModel.findCountryById(id);
    if (!country)
      return res.status(404).json({ message: "Country introuvable" });

    const oldImage = country.image;

    // 🗑️ Suppression ancienne image Cloudinary
    if (oldImage && oldImage !== "00_jmtb_flag_item_default.jpg") {
      try {
        const publicId = `${CLOUD_FOLDER}/${oldImage.replace(/\.[^.]+$/, "")}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("❌ delete country:", err);
      }
    }

    // 🔄 Resize (flag → carré OK comme les autres items)
    const resizedBuffer = await resizeAndCropBuffer(req.file.buffer, 500, 281);

    // ☁ Upload Cloudinary
    const { publicId, url } = await uploadBufferToCloudinary(
      resizedBuffer,
      CLOUD_FOLDER,
      "country"
    );

    const filename = `${publicId.split("/").pop()}.jpg`;
    await editingModel.editCountryImage(filename, id);

    return res.status(200).json({
      message: "Image successfully updated",
      filename,
      url,
    });
  } catch (err) {
    console.error("❌ uploadCountryImage:", err);
    return res.status(500).json({ message: "Error updating image" });
  }
};

const eraseCountry = async (req, res = null) => {
  try {
    const id = req.params.id;

    const rows = await editingModel.findCountryById(id);
    if (!rows || rows.length === 0) {
      if (res) return res.status(404).json({ message: "Country non trouvé" });
      return;
    }

    const imageUrl = rows[0].image;

    if (imageUrl && imageUrl !== DEFAULT_IMAGE) {
      try {
        const publicId = `${CLOUD_FOLDER}/${imageUrl.replace(/\.[^.]+$/, "")}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("❌ delete country:", err);
      }
    }

    await editingModel.deleteCountry(id);
    if (res) res.sendStatus(204);
  } catch (err) {
    if (res)
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du country" });
  }
};

const getCountryByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const [[country]] = await editingModel.findCountryByName(name);
    res.status(200).json(country);
  } catch (error) {
    next(error);
  }
};

//-----------------------------
// EDIT GENRE
//-----------------------------

const addGenre = async (req, res) => {
  try {
    const { name } = req.body;
    console.info("name in addGenre", name);
    if (!name) {
      return res.status(400).json({ message: "Genre's name is required" });
    }
    const result = await editingModel.insertGenre(name);

    return res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    console.error("Error Genre creation :", error);
    return res.status(500).json({ message: "Error Genre creation" });
  }
};

const editingGenre = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const existingGenre = await editingModel.findGenreById(id);
    if (existingGenre[0].name === name) {
      return res
        .status(400)
        .json({ message: "Error updating Genre: no changes detected" });
    }

    const result = await editingModel.editGenre(name, id);

    if (result.affectedRows !== 0) {
      return res.status(200).json({ message: "Genre successfully updated" });
    }
    return res.status(400).json({ message: "Error updating Genre" });
  } catch (error) {
    console.error("Stack trace :", error.stack);
    return res.status(500).json({ message: "Error updating Genre" });
  }
};

const eraseGenre = async (req, res, next) => {
  try {
    const genreId = req.params.id;

    const genres = await editingModel.findGenreById(genreId);
    if (!genres || genres.length === 0) {
      return res.status(404).json({ message: "Genre non trouvé" });
    }

    await editingModel.deleteGenre(genreId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

//-----------------------------
// EDIT LANGUAGE
//----------------------------

const addLanguage = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Language's name is required" });
    }
    await editingModel.insertLanguage(name);

    return res.status(201).json({ message: "Language successfully created" });
  } catch (error) {
    console.error("Error Language creation :", error);
    return res.status(500).json({ message: "Error Language creation" });
  }
};

const editingLanguage = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const existingLanguage = await editingModel.findLanguageById(id);
    if (existingLanguage[0].name === name) {
      return res
        .status(400)
        .json({ message: "Error updating Language: no changes detected" });
    }

    const result = await editingModel.editLanguage(name, id);

    if (result.affectedRows !== 0) {
      return res.status(200).json({ message: "Language successfully updated" });
    }
    return res.status(400).json({ message: "Error updating Language" });
  } catch (error) {
    console.error("Stack trace :", error.stack);
    return res.status(500).json({ message: "Error updating Language" });
  }
};

const eraseLanguage = async (req, res, next) => {
  try {
    const languageId = req.params.id;

    const languages = await editingModel.findLanguageById(languageId);
    if (!languages || languages.length === 0) {
      return res.status(404).json({ message: "Genre non trouvé" });
    }

    await editingModel.deleteLanguage(languageId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getLanguageByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const [[language]] = await editingModel.findLanguageByName(name);
    res.status(200).json(language);
  } catch (error) {
    next(error);
  }
};

//-----------------------------
// EDIT TAG
//-----------------------------

const addTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Tag's name is required" });
    }

    // 🔹 Nettoyage et normalisation
    const cleanedTags = cleanTags([{ name }]);

    if (cleanedTags.length === 0) {
      return res.status(400).json({ message: "No valid tag found" });
    }

    // 🔹 Vérifie l'existence ou insère en parallèle
    const insertedTags = await Promise.all(
      cleanedTags.map(async (tagName) => {
        const existingTag = await editingModel.findTagByName(tagName);
        if (existingTag) return existingTag.id;

        const insertedId = await editingModel.insertTag(tagName);
        return insertedId;
      })
    );

    return res.status(201).json({
      message: "Tag(s) successfully created",
      tags: await Promise.all(
        insertedTags.map((id) => editingModel.findTagById(id))
      ),
    });
  } catch (error) {
    console.error("Error Tag creation :", error);
    return res.status(500).json({ message: "Error Tag creation" });
  }
};

const editingTag = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const existingTag = await editingModel.findTagById(id);
    if (existingTag[0].name === name) {
      return res
        .status(400)
        .json({ message: "Error updating Tag: no changes detected" });
    }

    const result = await editingModel.editTag(name, id);

    if (result.affectedRows !== 0) {
      return res.status(200).json({ message: "Tag successfully updated" });
    }
    return res.status(400).json({ message: "Error updating Tag" });
  } catch (error) {
    console.error("Stack trace :", error.stack);
    return res.status(500).json({ message: "Error updating Tag" });
  }
};

const eraseTag = async (req, res, next) => {
  try {
    const TagId = req.params.id;

    const tags = await editingModel.findTagById(TagId);
    if (!tags || tags.length === 0) {
      return res.status(404).json({ message: "Tag non trouvé" });
    }

    await editingModel.deleteTag(TagId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getTagByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const tag = await editingModel.findTagByName(name); // déjà l'objet ou null
    res.status(200).json(tag);
  } catch (error) {
    next(error);
  }
};

//-----------------------------
// EDIT FOCUS
//-----------------------------

const addFocus = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({ message: "name and categoryId required" });
    }

    await editingModel.insertFocus(name, categoryId);
    return res.status(201).json({ message: "Focus successfully created" });
  } catch (error) {
    console.error("Error Focus creation :", error);
    return res.status(500).json({ message: "Error Focus creation" });
  }
};

const editingFocus = async (req, res) => {
  try {
    const { name, pitch, categoryId } = req.body;
    const { id } = req.params;

    const existingFocus = await editingModel.findFocusById(id);

    if (
      existingFocus[0].name === name &&
      existingFocus[0].pitch === pitch &&
      existingFocus[0].categoryId === Number(categoryId)
    ) {
      return res.status(400).json({
        message: "Error updating Focus: no changes detected",
      });
    }

    const result = await editingModel.editFocus(name, pitch, categoryId, id);

    if (result.affectedRows !== 0) {
      return res.status(200).json({ message: "Focus successfully updated" });
    }

    return res.status(400).json({ message: "Error updating Focus" });
  } catch (error) {
    console.error("Stack trace :", error.stack);
    return res.status(500).json({ message: "Error updating Focus" });
  }
};

const uploadFocusImage = async (req, res) => {
  try {
    const focusId = req.params.id;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
    }

    // 1️⃣ Récupérer l'ancien enregistrement
    const [focus] = await editingModel.findFocusById(focusId);
    if (!focus) {
      return res.status(404).json({ message: "Focus introuvable" });
    }

    const oldImage = focus.image;

    // 2️⃣ SUPPRESSION de l’ancienne image Cloudinary si ce n'est pas l'image par défaut
    if (oldImage && oldImage !== "00_jmtb_item_default.jpg") {
      try {
        const publicId = `jmdb/covers/${oldImage.replace(/\.[^.]+$/, "")}`;
        await cloudinary.uploader.destroy(publicId);

        // console.log("✔️ Ancienne image supprimée de Cloudinary");
      } catch (err) {
        console.error("❌ Erreur suppression ancienne image Cloudinary :", err);
      }
    }
    // 3️⃣ RESIZE du buffer avant upload
    const bufferToUpload = await resizeAndCropBuffer(req.file.buffer, 500, 500);

    // 3️⃣ UPLOAD Cloudinary de la nouvelle image
    const { publicId: newPublicId, url } = await uploadBufferToCloudinary(
      bufferToUpload,
      "jmdb/covers",
      "focus"
    );

    // public_id ressemble à : jmdb/covers/focus-xxxx-xxxx
    const filenameOnly = newPublicId.split("/").pop();
    const filenameWithExt = `${filenameOnly}.jpg`;

    // 4️⃣ Mise à jour en BDD
    await editingModel.editFocusImage(filenameWithExt, focusId);

    return res.status(200).json({
      message: "Image focus uploadée avec succès",
      filename: filenameWithExt,
      url,
    });
  } catch (error) {
    console.error("❌ Erreur uploadFocusImage :", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'upload", error: error.message });
  }
};

const eraseFocus = async (req, res = null) => {
  try {
    const focusId = req.params.id;

    // 1️⃣ Récupérer le focus depuis la BDD
    const focus = await editingModel.findFocusById(focusId);
    if (!focus || focus.length === 0) {
      if (res) return res.status(404).json({ message: "Thema non trouvé" });
      return;
    }

    const f = focus[0];
    const imageUrl = f.image;

    // 2️⃣ Supprimer l'image de Cloudinary si ce n'est pas l'image par défaut
    if (imageUrl && imageUrl !== "00_jmtb_item_default.jpg") {
      try {
        // Supprimer l'extension pour obtenir le public_id Cloudinary
        const publicId = `jmdb/covers/${imageUrl.replace(/\.[^.]+$/, "")}`;
        console.log("➡️ Suppression Cloudinary public_id =", publicId);

        await cloudinary.uploader.destroy(publicId);
        console.log("✔️ Image supprimée de Cloudinary");
      } catch (cloudErr) {
        console.error("❌ Erreur suppression Cloudinary :", cloudErr);
      }
    }

    // 3️⃣ Supprimer l'enregistrement en BDD
    await editingModel.deleteFocus(focusId);

    if (res) res.sendStatus(204); // réponse HTTP seulement si 'res' défini
  } catch (error) {
    console.error("❌ Erreur eraseFocus :", error);
    if (res)
      res.status(500).json({
        message: "Erreur lors de la suppression du thema",
        error: error.message,
      });
  }
};

module.exports = {
  addDirector,
  editingDirector,
  uploadDirectorImage,
  eraseDirector,
  addCasting,
  editingCasting,
  uploadCastingImage,
  eraseCasting,
  addScreenwriter,
  editingScreenwriter,
  uploadScreenwriterImage,
  eraseScreenwriter,
  addCompositor,
  editingCompositor,
  uploadCompositorImage,
  eraseCompositor,
  addStudio,
  editingStudio,
  uploadStudioImage,
  eraseStudio,
  addCountry,
  editingCountry,
  uploadCountryImage,
  eraseCountry,
  getCountryByName,
  addGenre,
  editingGenre,
  eraseGenre,
  addLanguage,
  editingLanguage,
  eraseLanguage,
  getLanguageByName,
  addTag,
  editingTag,
  eraseTag,
  getTagByName,
  addFocus,
  editingFocus,
  uploadFocusImage,
  eraseFocus,
};
