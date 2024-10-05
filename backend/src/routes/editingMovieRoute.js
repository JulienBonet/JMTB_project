/* eslint-disable consistent-return */
// /* eslint-disable consistent-return */
const express = require("express");

const router = express.Router();
// const path = require("path");
const { fileUpload, setType } = require("../middlewares/fileUpload");

const editingMovieController = require("../controllers/editingMovieControllers");

// MOVIES ROUTES
router.post(
  "/movie",
  fileUpload.single("cover"),
  editingMovieController.addMovie
);

router.post("/upload-cover", async (req, res) => {
  // console.info("Données reçues dans upload-cover:", req.body);

  // Vérifiez que l'URL du poster est présente
  if (!req.body.posterUrl) {
    console.error("Poster URL manquant !");
    return res.status(400).json({ message: "Poster URL is required" });
  }

  try {
    console.info(
      "Tentative de téléchargement de l'image depuis l'URL:",
      req.body.posterUrl
    );
    const coverFilename = await editingMovieController.downloadPoster(
      req.body.posterUrl
    );

    // Envoyez le nom de fichier de l'image de couverture en réponse
    res.status(200).json({ coverFilename });
  } catch (error) {
    console.error("Error uploading cover:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.post(
  "/upload-local-cover",
  setType("cover"),
  fileUpload.single("cover"),
  async (req, res) => {
    // console.info("File uploaded in upload-local-cover:", req.file);
    try {
      if (!req.file) {
        console.error("Aucun fichier trouvé dans la requête.");
        return res.status(400).json({ message: "Aucun fichier uploadé." });
      }

      const localCoverPath = req.file.path; // Utilise req.file.path ici
      // console.info("Chemin du fichier local:", localCoverPath);
      const coverUrl = `/images/${req.file.filename}`; // URL publique du fichier
      const coverFilename = await editingMovieController.uploadLocalCover(
        localCoverPath,
        coverUrl
      );
      res.status(200).json({ coverFilename });
    } catch (error) {
      console.error("Error uploading local cover:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
);

module.exports = router;
