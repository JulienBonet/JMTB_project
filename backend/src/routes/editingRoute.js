/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
const express = require("express");

const router = express.Router();
const upload = require("../middlewares/fileUpload");
const editingController = require("../controllers/editingControllers");

// 🔧 Middleware commun pour toutes les routes d'upload
const safeUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("❌ Erreur Multer :", err.message);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// ---------------------- DIRECTORS ----------------------
router.post("/director", editingController.addDirector);
router.put("/director/:id", editingController.editingDirector);
router.put(
  "/director/:id/image",
  safeUpload,
  editingController.uploadDirectorImage
);
router.delete("/director/delete/:id", editingController.eraseDirector);

// ---------------------- CASTING ----------------------
router.post("/casting", editingController.addCasting);
router.put("/casting/:id", editingController.editingCasting);
router.put(
  "/casting/:id/image",
  safeUpload,
  editingController.uploadCastingImage
);
router.delete("/casting/:id", editingController.eraseCasting);

// ---------------------- SCREENWRITER ----------------------
router.post("/screenwriter", editingController.addScreenwriter);
router.put("/screenwriter/:id", editingController.editingScreenwriter);
router.put(
  "/screenwriter/:id/image",
  safeUpload,
  editingController.uploadScreenwriterImage
);
router.delete("/screenwriter/:id", editingController.eraseScreenwriter);

// ---------------------- COMPOSITOR ----------------------
router.post("/compositor", editingController.addCompositor);
router.put("/compositor/:id", editingController.editingCompositor);
router.put(
  "/compositor/:id/image",
  safeUpload,
  editingController.uploadCompositorImage
);
router.delete("/compositor/:id", editingController.eraseCompositor);

// ---------------------- STUDIO ----------------------
router.post("/studio", editingController.addStudio);
router.put("/studio/:id", editingController.editingStudio);
router.put(
  "/studio/:id/image",
  safeUpload,
  editingController.uploadStudioImage
);
router.delete("/studio/:id", editingController.eraseStudio);

// ---------------------- COUNTRY ----------------------
router.post("/country", editingController.addCountry);
router.put("/country/:id", editingController.editingCountry);
router.put(
  "/country/:id/image",
  safeUpload,
  editingController.uploadCountryImage
);
router.delete("/country/:id", editingController.eraseCountry);
router.get("/country/byname/:name", editingController.getCountryByName);

// ---------------------- GENRE ----------------------
router.post("/kind", editingController.addGenre);
router.put("/kind/:id", editingController.editingGenre);
router.delete("/kind/:id", editingController.eraseGenre);

// ---------------------- LANGUAGE ----------------------
router.post("/language", editingController.addLanguage);
router.put("/language/:id", editingController.editingLanguage);
router.delete("/language/:id", editingController.eraseLanguage);
router.get("/language/byname/:name", editingController.getLanguageByName);

// ---------------------- TAG ----------------------
router.post("/tag", editingController.addTag);
router.put("/tag/:id", editingController.editingTag);
router.delete("/tag/:id", editingController.eraseTag);
router.get("/tag/byname/:name", editingController.getTagByName);

// ---------------------- THEMA / FOCUS ----------------------
router.post("/focus", editingController.addFocus);
router.put("/focus/:id", editingController.editingFocus);
router.put("/focus/:id/image", safeUpload, editingController.uploadFocusImage);
router.delete("/focus/:id", editingController.eraseFocus);

module.exports = router;
