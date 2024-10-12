/* eslint-disable consistent-return */
// /* eslint-disable consistent-return */
const express = require("express");

const router = express.Router();
// const path = require("path");
const { fileUpload, setType } = require("../middlewares/fileUpload");

const editingMovieController = require("../controllers/editingMovieControllers");

// MOVIES ROUTES
router.post("/movie", editingMovieController.addMovie);

router.post("/upload-cover", async (req, res) => {
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
  fileUpload.single("cover"), // multer gère l'upload ici
  async (req, res) => {
    try {
      if (!req.file) {
        console.error("Aucun fichier trouvé dans la requête.");
        return res.status(400).json({ message: "Aucun fichier uploadé." });
      }

      const coverFilename = req.file.filename;

      console.info("Nom du fichier pour la base de données:", coverFilename);

      res.status(200).json({ coverFilename });
    } catch (error) {
      console.error("Error uploading local cover:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  }
);

router.put(
  "/movie/:id",
  (req, res, next) => {
    console.info("La route PUT a été appelée"); // Vérifier que la route est appelée
    next();
  },
  editingMovieController.editMovieById
);

router.delete("/movie/:id", editingMovieController.deleteMovie);

module.exports = router;
