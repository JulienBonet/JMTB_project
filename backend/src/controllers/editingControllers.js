/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
const fs = require("fs");
const path = require("path");
const editingModel = require("../models/editingModel");

// EDIT DIRECTOR
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
    const { name, pitch, wikilink, imdblink } = req.body;
    const { id } = req.params;

    // Vérifier si les nouvelles données sont différentes des données existantes
    const existingDirector = await editingModel.findDirectorById(id);
    if (
      existingDirector[0].name === name &&
      existingDirector[0].pitch === pitch &&
      existingDirector[0].wikilink === wikilink &&
      existingDirector[0].imdblink === imdblink
    ) {
      return res
        .status(400)
        .json({ message: "Error updating director: no changes detected" });
    }

    // Mettre à jour le réalisateur
    const result = await editingModel.editDirector(
      name,
      pitch,
      wikilink,
      imdblink,
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
    // effacer la précédente image
    if (currentImageUrl !== "http://localhost:3310/00_item_default.png") {
      try {
        const pathname = new URL(currentImageUrl).pathname;
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(pathname)
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
    // mettre à jour la nouvelle image
    const imageUrl = `${req.protocol}://${req.get("host")}/${
      req.file.filename
    }`;
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

const eraseDirector = async (req, res, next) => {
  try {
    const directorId = req.params.id;

    // Supprimer l'image
    const directors = await editingModel.findDirectorById(directorId);
    if (!directors || directors.length === 0) {
      return res.status(404).json({ message: "director non trouvé" });
    }

    const director = directors[0];
    const imageUrl = director.image;
    if (imageUrl && imageUrl !== "http://localhost:3310/00_item_default.png") {
      try {
        const pathname = new URL(imageUrl).pathname;
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(pathname)
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

    // Supprimer le director de la base de données
    await editingModel.deleteDirector(directorId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

// EDIT CASTING
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
    const { name, pitch, wikilink, imdblink } = req.body;
    const { id } = req.params;

    const existingCasting = await editingModel.findCastingById(id);
    if (
      existingCasting[0].name === name &&
      existingCasting[0].pitch === pitch &&
      existingCasting[0].wikilink === wikilink &&
      existingCasting[0].imdblink === imdblink
    ) {
      return res
        .status(400)
        .json({ message: "Error updating Casting: no changes detected" });
    }

    const result = await editingModel.editCasting(
      name,
      pitch,
      wikilink,
      imdblink,
      id
    );

    if (result.affectedRows !== 0) {
      return res.status(200).json({ message: "Casting successfully updated" });
    }
    return res.status(400).json({ message: "Error updating Casting" });
  } catch (error) {
    console.error("Stack trace :", error.stack);
    return res.status(500).json({ message: "Error updating Casting" });
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

    if (currentImageUrl !== "http://localhost:3310/00_item_default.png") {
      try {
        const pathname = new URL(currentImageUrl).pathname;
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(pathname)
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

    const imageUrl = `${req.protocol}://${req.get("host")}/${
      req.file.filename
    }`;

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

const eraseCasting = async (req, res, next) => {
  try {
    const castingId = req.params.id;

    const castings = await editingModel.findCastingById(castingId);
    if (!castings || castings.length === 0) {
      return res.status(404).json({ message: "Casting non trouvé" });
    }

    const casting = castings[0];
    const imageUrl = casting.image;
    if (imageUrl && imageUrl !== "http://localhost:3310/00_item_default.png") {
      try {
        const pathname = new URL(imageUrl).pathname;
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(pathname)
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
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

// EDIT SCREENWRITER
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

    if (currentImageUrl !== "http://localhost:3310/00_item_default.png") {
      try {
        const pathname = new URL(currentImageUrl).pathname;
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(pathname)
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

    const imageUrl = `${req.protocol}://${req.get("host")}/${
      req.file.filename
    }`;

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

const eraseScreenwriter = async (req, res, next) => {
  try {
    const screenwriterId = req.params.id;

    const screenwriters = await editingModel.findScreenwriterById(
      screenwriterId
    );
    if (!screenwriters || screenwriters.length === 0) {
      return res.status(404).json({ message: "Casting non trouvé" });
    }

    const screenwriter = screenwriters[0];
    const imageUrl = screenwriter.image;
    if (imageUrl && imageUrl !== "http://localhost:3310/00_item_default.png") {
      try {
        const pathname = new URL(imageUrl).pathname;
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(pathname)
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
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

// EDIT COMPOSITOR
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

    if (currentImageUrl !== "http://localhost:3310/00_item_default.png") {
      try {
        const pathname = new URL(currentImageUrl).pathname;
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(pathname)
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

    const imageUrl = `${req.protocol}://${req.get("host")}/${
      req.file.filename
    }`;

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

const eraseCompositor = async (req, res, next) => {
  try {
    const compositorId = req.params.id;

    const compositors = await editingModel.findCompositorById(compositorId);
    if (!compositors || compositors.length === 0) {
      return res.status(404).json({ message: "compositor non trouvé" });
    }

    const compositor = compositors[0];
    const imageUrl = compositor.image;
    if (imageUrl && imageUrl !== "http://localhost:3310/00_item_default.png") {
      try {
        const pathname = new URL(imageUrl).pathname;
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(pathname)
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
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

// EDIT STUDIO
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
    console.info(studio);
    console.info(currentImageUrl);

    if (currentImageUrl !== "http://localhost:3310/00_jmtb_item_default.jpg") {
      try {
        const pathname = new URL(currentImageUrl).pathname;
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(pathname)
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

    const imageUrl = `${req.protocol}://${req.get("host")}/${
      req.file.filename
    }`;

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

const eraseStudio = async (req, res, next) => {
  try {
    const studioId = req.params.id;

    const studios = await editingModel.findStudioById(studioId);
    if (!studios || studios.length === 0) {
      return res.status(404).json({ message: "Studio non trouvé" });
    }

    const studio = studios[0];
    const imageUrl = studio.image;
    if (
      imageUrl &&
      imageUrl !== "http://localhost:3310/00_jmtb_item_default.jpg"
    ) {
      try {
        const pathname = new URL(imageUrl).pathname;
        const fullPath = path.join(
          __dirname,
          "../../public/images",
          path.basename(pathname)
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
    res.sendStatus(204);
  } catch (error) {
    next(error);
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
};
