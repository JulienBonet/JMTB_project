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
      // Logique de gestion de l'erreur si les données sont identiques
      return res
        .status(400)
        .json({ message: "Error updating director: no changes detected" });
    }

    // Mettre à jour le réalisateur avec les nouvelles informations
    const result = await editingModel.editDirector(
      name,
      pitch,
      wikilink,
      imdblink,
      id
    );

    if (result.affectedRows !== 0) {
      // Logique de gestion de la mise à jour réussie
      return res.status(200).json({ message: "Director successfully updated" });
    }
    // Logique de gestion de l'erreur de mise à jour
    return res.status(400).json({ message: "Error updating director" });
  } catch (error) {
    // Gestion des erreurs
    console.error("Stack trace :", error.stack);
    return res.status(500).json({ message: "Error updating director" });
  }
};

const uploadDirectorImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si un fichier a été téléchargé
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier n'a été téléchargé" });
    }

    // Construire l'URL de l'image en utilisant le protocole, l'hôte et le nom du fichier téléchargé
    const imageUrl = `${req.protocol}://${req.get("host")}/${
      req.file.filename
    }`;

    // Mettre à jour l'image du réalisateur dans la base de données
    const result = await editingModel.editDirectorImage(imageUrl, id);

    if (result.affectedRows > 0) {
      // Logique de gestion de la mise à jour réussie
      return res.status(200).json({ message: "Image successfully updated" });
    }
    // Logique de gestion de l'erreur de mise à jour
    console.error("Erreur lors de la mise à jour de l'image");
    return res.status(500).json({ message: "Error updating image" });
  } catch (error) {
    // Gestion des erreurs
    console.error("Erreur lors du téléchargement de l'image :", error);
    return res.status(500).json({ message: "Error updating image" });
  }
};

const eraseDirector = async (req, res, next) => {
  try {
    const directorId = req.params.id;
    await editingModel.deleteDirector(directorId);
    res.sendStatus(204).json({ message: "Director successfully deleted" });
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

    // Vérifier si les nouvelles données sont différentes des données existantes
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

    // Mettre à jour le réalisateur avec les nouvelles informations
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

const uploadDCastingImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si un fichier a été téléchargé
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier n'a été téléchargé" });
    }

    // Construire l'URL de l'image en utilisant le protocole, l'hôte et le nom du fichier téléchargé
    const imageUrl = `${req.protocol}://${req.get("host")}/${
      req.file.filename
    }`;

    // Mettre à jour l'image du réalisateur dans la base de données
    const result = await editingModel.editCastingImage(imageUrl, id);

    if (result.affectedRows > 0) {
      // Logique de gestion de la mise à jour réussie
      return res.status(200).json({ message: "Image successfully updated" });
    }
    // Logique de gestion de l'erreur de mise à jour
    console.error("Erreur lors de la mise à jour de l'image");
    return res.status(500).json({ message: "Error updating image" });
  } catch (error) {
    // Gestion des erreurs
    console.error("Erreur lors du téléchargement de l'image :", error);
    return res.status(500).json({ message: "Error updating image" });
  }
};

const eraseCasting = async (req, res, next) => {
  try {
    const castingId = req.params.id;

    // Supprimer l'image
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

    // Supprimer le casting de la base de données
    await editingModel.deleteCasting(castingId);
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
  uploadDCastingImage,
  eraseCasting,
};
