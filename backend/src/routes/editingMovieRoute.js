/* eslint-disable consistent-return */
const express = require("express");

const router = express.Router();
const { fileUpload, setType } = require("../middlewares/fileUpload");
const editingMovieController = require("../controllers/editingMovieControllers");

// MOVIES ROUTES
router.post("/movie", editingMovieController.addMovie);

router.post(
  "/upload-cover",
  setType("cover"),
  fileUpload.single("cover"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const coverUrl = `/images/${req.file.filename}`;
      // Téléchargez l'image de couverture et obtenez le nom de fichier
      const coverFilename =
        await editingMovieController.downloadPoster(coverUrl);
      // Envoyez le nom de fichier de l'image de couverture en réponse
      res.status(200).json({ coverFilename });
    } catch (error) {
      console.error("Error uploading cover:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
