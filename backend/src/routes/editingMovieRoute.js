/* eslint-disable consistent-return */
// /* eslint-disable consistent-return */
// // /* eslint-disable consistent-return */
// const express = require("express");

// const router = express.Router();
// // const path = require("path");
// const { fileUpload, setType } = require("../middlewares/fileUpload");
// const { resizeImage } = require("../middlewares/resizeImage");

// const editingMovieController = require("../controllers/editingMovieControllers");

// // MOVIES ROUTES
// router.post("/movie", editingMovieController.addMovie);

// router.post("/upload-cover", async (req, res) => {
//   // Vérifiez que l'URL du poster est présente
//   if (!req.body.posterUrl) {
//     console.error("Poster URL manquant !");
//     return res.status(400).json({ message: "Poster URL is required" });
//   }

//   try {
//     console.info(
//       "Tentative de téléchargement de l'image depuis l'URL:",
//       req.body.posterUrl
//     );
//     const coverFilename = await editingMovieController.downloadPoster(
//       req.body.posterUrl
//     );

//     res.status(200).json({ coverFilename });
//   } catch (error) {
//     console.error("Error uploading cover:", error);
//     res
//       .status(500)
//       .json({ message: "Internal Server Error", error: error.message });
//   }
// });

// router.post(
//   "/upload-local-cover",
//   setType("cover"),
//   fileUpload.single("cover"), // multer gère l'upload ici
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         console.error("Aucun fichier trouvé dans la requête.");
//         return res.status(400).json({ message: "Aucun fichier uploadé." });
//       }

//       const coverFilename = req.file.filename;

//       console.info("Nom du fichier pour la base de données:", coverFilename);

//       // ✅ Redimensionnement juste après l’upload
//       await resizeImage(req.multerType, coverFilename);

//       console.info("Nom du fichier pour la base de données:", coverFilename);

//       res.status(200).json({ coverFilename });
//     } catch (error) {
//       console.error("Error uploading local cover:", error);
//       res.status(500).json({ message: "Erreur interne du serveur" });
//     }
//   }
// );

// router.put("/movie/:id", editingMovieController.editMovieById);

// router.put(
//   "/movie/:id/image",
//   setType("cover"),
//   fileUpload.single("cover"),
//   editingMovieController.editMovieImage
// );

// router.put(
//   "/movie/:id/image-from-url",
//   editingMovieController.updateImageFromUrl
// );

// router.delete("/movie/:id", editingMovieController.deleteMovie);

// module.exports = router;

const express = require("express");

const router = express.Router();
const upload = require("../middlewares/fileUpload");
const editingMovieController = require("../controllers/editingMovieControllers");

// MOVIES ROUTES
router.post("/movie", editingMovieController.addMovie);

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
