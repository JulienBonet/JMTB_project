/* eslint-disable no-restricted-syntax */
const editingModel = require("../models/editingModel");

const editingDirector = async (req, res) => {
  try {
    // Récupérer les données du corps de la requête
    const { name, pitch, wikilink, imdblink } = req.body;
    console.log("Name:", name);
    console.log("Pitch:", pitch);
    console.log("Wikilink:", wikilink);
    console.log("IMDbLink:", imdblink);

    // Récupérer l'ID du directeur à partir des paramètres de l'URL
    const { id } = req.params;
    console.log("id:", id);

    // Vérifier si le directeur existe
    const directorExists = await editingModel.findDirectorById(id);

    // Si le directeur n'existe pas, renvoyer une réponse 404
    if (!directorExists) {
      return res.status(404).json({ message: "Directeur non trouvé" });
    }

    // Mettre à jour le directeur
    const result = await editingModel.editDirector(
      name,
      pitch,
      wikilink,
      imdblink,
      id
    );

    // Vérifier si la mise à jour a été réussie
    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Directeur mis à jour avec succès" });
    }
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du directeur" });
  } catch (error) {
    console.error("Stack trace :", error.stack);
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du directeur" });
  }
};

module.exports = {
  editingDirector,
};
