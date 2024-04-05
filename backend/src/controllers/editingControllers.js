const editingModel = require("../models/editingModel");

const addDirector = async (req, res) => {
  try {
    const { name } = req.body; // Supposant que vous envoyez le nom du directeur dans le corps de la requête

    // Assurez-vous que le nom du directeur est fourni
    if (!name) {
      return res.status(400).json({ message: "Director's name is required" });
    }

    // Insérer le directeur dans la base de données
    await editingModel.insertDirector(name);

    return res.status(201).json({ message: "Director creation succes" });
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
};
