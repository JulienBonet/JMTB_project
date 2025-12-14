/* eslint-disable consistent-return */
const express = require("express");

const router = express.Router();
const upload = require("../middlewares/fileUpload");
const editingMovieController = require("../controllers/editingMovieControllers");

// MOVIES ROUTES
// router.post("/movie", editingMovieController.addMovie);
router.post(
  "/movie",
  upload.single("cover"), // 🔥 local file
  editingMovieController.addMovie
);

// --- Upload d'affiche depuis une URL ---
router.post("/upload-cover", async (req, res) => {
  if (!req.body.posterUrl) {
    return res.status(400).json({ message: "Poster URL is required" });
  }

  try {
    const coverUrl = await editingMovieController.downloadPoster(
      req.body.posterUrl
    );
    res.status(200).json({ coverUrl });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du téléchargement de l'image",
      error: error.message,
    });
  }
});

// --- Upload d'affiche locale vers Cloudinary ---
router.post(
  "/upload-local-cover",
  upload.single("cover"),
  editingMovieController.uploadLocalCoverToCloudinary
);

// --- Mise à jour des infos du film ---
router.put("/movie/:id", editingMovieController.editMovieById);

// --- Mise à jour de l'image du film ---
router.put(
  "/movie/:id/image",
  upload.single("cover"),
  editingMovieController.editMovieImage
);

// --- Update affiche depuis URL ---
router.put(
  "/movie/:id/image-from-url",
  editingMovieController.updateImageFromUrl
);

// --- Suppression d'un film ---
router.delete("/movie/:id", editingMovieController.deleteMovie);

module.exports = router;
