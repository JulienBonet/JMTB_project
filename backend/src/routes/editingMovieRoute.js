/* eslint-disable consistent-return */
const express = require("express");

const router = express.Router();
const upload = require("../middlewares/fileUpload");
const editingMovieController = require("../controllers/editingMovieControllers");

// MOVIES ROUTES
router.post("/movie", upload.single("cover"), editingMovieController.addMovie);

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
