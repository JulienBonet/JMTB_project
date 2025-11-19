/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
const fs = require("fs");
const path = require("path");
const { resizeImage } = require("../middlewares/resizeImage");
const { cleanTags } = require("../utils/tags");
const editingModel = require("../models/editingModel");

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

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier n'a été téléchargé" });
    }

    const director = await editingModel.findDirectorById(id);
    const currentImageUrl = director[0].image;

    // Effacer la précédente image
    if (currentImageUrl !== "00_item_default.png") {
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

    // Mettre à jour la nouvelle image
    const imageUrl = req.file.filename;
    await resizeImage(req.multerType, imageUrl);
    const result = await editingModel.editDirectorImage(imageUrl, id);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Image successfully updated" });
    }
    console.error("Erreur lors de la mise à jour de l'image");
    return res.status(500).json({ message: "Error updating image" });
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image :", error);
    return res.status(500).json({ message: "Error updating image" });
  }
};

const eraseDirector = async (req, res = null) => {
  try {
    const directorId = req.params.id;

    const directors = await editingModel.findDirectorById(directorId);
    if (!directors || directors.length === 0) {
      if (res) {
        return res.status(404).json({ message: "Director non trouvé" });
      }
      return;
    }

    const director = directors[0];
    const imageUrl = director.image;
    if (imageUrl && imageUrl !== "00_item_default.png") {
      try {
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(imageUrl)
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

    await editingModel.deleteDirector(directorId);
    if (res) {
      res.sendStatus(204);
    }
  } catch (error) {
    if (res) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du réalisateur" });
    }
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

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier n'a été téléchargé" });
    }

    const casting = await editingModel.findCastingById(id);
    const currentImageUrl = casting[0].image;

    if (currentImageUrl !== "00_item_default.png") {
      try {
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          currentImageUrl
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

    const imageUrl = req.file.filename;
    await resizeImage(req.multerType, imageUrl);
    const result = await editingModel.editCastingImage(imageUrl, id);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Image successfully updated" });
    }
    console.error("Erreur lors de la mise à jour de l'image");
    return res.status(500).json({ message: "Error updating image" });
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image :", error);
    return res.status(500).json({ message: "Error updating image" });
  }
};

const eraseCasting = async (req, res = null) => {
  try {
    const castingId = req.params.id;

    const castings = await editingModel.findCastingById(castingId);
    if (!castings || castings.length === 0) {
      if (res) {
        return res.status(404).json({ message: "Casting non trouvé" });
      }
      return; // Si pas de res, on arrête là
    }

    const casting = castings[0];
    const imageUrl = casting.image;
    if (imageUrl && imageUrl !== "00_item_default.png") {
      try {
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(imageUrl)
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

    await editingModel.deleteCasting(castingId);
    if (res) {
      res.sendStatus(204);
    }
  } catch (error) {
    if (res) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du casting" });
    }
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

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier n'a été téléchargé" });
    }

    const screenwriter = await editingModel.findScreenwriterById(id);
    const currentImageUrl = screenwriter[0].image;

    if (currentImageUrl !== "00_item_default.png") {
      try {
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          currentImageUrl
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

    const imageUrl = req.file.filename;
    await resizeImage(req.multerType, imageUrl);
    const result = await editingModel.editScreenwriterImage(imageUrl, id);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Image successfully updated" });
    }
    console.error("Erreur lors de la mise à jour de l'image");
    return res.status(500).json({ message: "Error updating image" });
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image :", error);
    return res.status(500).json({ message: "Error updating image" });
  }
};

const eraseScreenwriter = async (req, res = null) => {
  try {
    const screenwriterId = req.params.id;

    const screenwriters =
      await editingModel.findScreenwriterById(screenwriterId);
    if (!screenwriters || screenwriters.length === 0) {
      if (res) {
        return res.status(404).json({ message: "Scénariste non trouvé" });
      }
      return; // Arrêter si aucune réponse HTTP n'est envoyée
    }

    const screenwriter = screenwriters[0];
    const imageUrl = screenwriter.image;
    if (imageUrl && imageUrl !== "00_item_default.png") {
      try {
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(imageUrl)
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

    await editingModel.deleteScreenwriter(screenwriterId);

    if (res) {
      res.sendStatus(204); // Envoyer la réponse seulement si 'res' est défini
    }
  } catch (error) {
    if (res) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du scénariste" });
    }
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

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier n'a été téléchargé" });
    }

    const compositor = await editingModel.findCompositorById(id);
    const currentImageUrl = compositor[0].image;

    if (currentImageUrl !== "00_item_default.png") {
      try {
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          currentImageUrl
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

    const imageUrl = req.file.filename;
    await resizeImage(req.multerType, imageUrl);
    const result = await editingModel.editCompositorImage(imageUrl, id);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Image successfully updated" });
    }
    console.error("Erreur lors de la mise à jour de l'image");
    return res.status(500).json({ message: "Error updating image" });
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image :", error);
    return res.status(500).json({ message: "Error updating image" });
  }
};

const eraseCompositor = async (req, res = null) => {
  try {
    const compositorId = req.params.id;

    const compositors = await editingModel.findCompositorById(compositorId);
    if (!compositors || compositors.length === 0) {
      if (res) {
        return res.status(404).json({ message: "Compositor non trouvé" });
      }
      return; // Arrêter l'exécution si aucune réponse HTTP n'est envoyée
    }

    const compositor = compositors[0];
    const imageUrl = compositor.image;
    if (imageUrl && imageUrl !== "00_item_default.png") {
      try {
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(imageUrl)
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

    await editingModel.deleteCompositor(compositorId);

    if (res) {
      res.sendStatus(204); // Envoyer la réponse uniquement si 'res' est défini
    }
  } catch (error) {
    if (res) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du compositeur" });
    }
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
    await editingModel.insertStudio(name);

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

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier n'a été téléchargé" });
    }

    const studio = await editingModel.findStudioById(id);
    const currentImageUrl = studio[0].image;

    if (currentImageUrl !== "00_jmtb_item_default.jpg") {
      try {
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          currentImageUrl
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

    const imageUrl = req.file.filename;
    await resizeImage(req.multerType, imageUrl);
    const result = await editingModel.editStudioImage(imageUrl, id);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Image successfully updated" });
    }
    console.error("Erreur lors de la mise à jour de l'image");
    return res.status(500).json({ message: "Error updating image" });
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image :", error);
    return res.status(500).json({ message: "Error updating image" });
  }
};

const eraseStudio = async (req, res = null) => {
  try {
    const studioId = req.params.id;

    const studios = await editingModel.findStudioById(studioId);
    if (!studios || studios.length === 0) {
      if (res) {
        return res.status(404).json({ message: "Studio non trouvé" });
      }
      return; // Arrêter l'exécution si aucune réponse HTTP n'est envoyée
    }

    const studio = studios[0];
    const imageUrl = studio.image;
    if (imageUrl && imageUrl !== "00_jmtb_item_default.jpg") {
      try {
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(imageUrl)
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

    await editingModel.deleteStudio(studioId);

    if (res) {
      res.sendStatus(204); // Envoyer la réponse uniquement si 'res' est défini
    }
  } catch (error) {
    if (res) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du studio" });
    }
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

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier n'a été téléchargé" });
    }

    const [country] = await editingModel.findCountryById(id);
    const currentImageUrl = country.image;

    if (currentImageUrl !== "00_jmtb_flag_item_default.jpg") {
      try {
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          currentImageUrl
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

    const imageUrl = req.file.filename;
    await resizeImage(req.multerType, imageUrl);
    const result = await editingModel.editCountryImage(imageUrl, id);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Image successfully updated" });
    }
    console.error("Erreur lors de la mise à jour de l'image");
    return res.status(500).json({ message: "Error updating image" });
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image :", error);
    return res.status(500).json({ message: "Error updating image" });
  }
};

const eraseCountry = async (req, res = null) => {
  try {
    const countryId = req.params.id;

    const countries = await editingModel.findCountryById(countryId);
    if (!countries || countries.length === 0) {
      if (res) {
        return res.status(404).json({ message: "Country non trouvé" });
      }
      return; // Arrêter l'exécution si aucune réponse HTTP n'est envoyée
    }

    const country = countries[0];
    const imageUrl = country.image;
    if (imageUrl && imageUrl !== "00_jmtb_flag_item_default.jpg") {
      try {
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(imageUrl)
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

    await editingModel.deleteCountry(countryId);

    if (res) {
      res.sendStatus(204); // Envoyer la réponse uniquement si 'res' est défini
    }
  } catch (error) {
    if (res) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du country" });
    }
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
      // tagIds: insertedTags,
      tags: await Promise.all(
        insertedTags.map((id) => editingModel.findTagById(id)) // pas besoin de `await` ici
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
    const { id } = req.params;

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier n'a été téléchargé" });
    }

    const thema = await editingModel.findFocusById(id);
    const currentImageUrl = thema[0].image;

    if (currentImageUrl !== "00_jmtb_item_default.jpg") {
      try {
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          currentImageUrl
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

    const imageUrl = req.file.filename;
    await resizeImage(req.multerType, imageUrl);
    const result = await editingModel.editFocusImage(imageUrl, id);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Image successfully updated" });
    }
    console.error("Erreur lors de la mise à jour de l'image");
    return res.status(500).json({ message: "Error updating image" });
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image :", error);
    return res.status(500).json({ message: "Error updating image" });
  }
};

const eraseFocus = async (req, res = null) => {
  try {
    const focusId = req.params.id;

    const focus = await editingModel.findFocusById(focusId);
    if (!focus || focus.length === 0) {
      if (res) {
        return res.status(404).json({ message: "Thema non trouvé" });
      }
      return; // Arrêter l'exécution si aucune réponse HTTP n'est envoyée
    }

    const f = focus[0];
    const imageUrl = f.image;
    if (imageUrl && imageUrl !== "00_jmtb_item_default.jpg") {
      try {
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(imageUrl)
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

    await editingModel.deleteFocus(focusId);

    if (res) {
      res.sendStatus(204); // Envoyer la réponse uniquement si 'res' est défini
    }
  } catch (error) {
    if (res) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du thema" });
    }
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
