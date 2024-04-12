const express = require("express");

const router = express.Router();
const { fileUpload, setType } = require("../middlewares/fileUpload");
const editingController = require("../controllers/editingControllers");

// DIRECTORS ROUTES
router.post("/director", editingController.addDirector);
router.put("/director/:id", editingController.editingDirector);
router.put(
  "/director/:id/image",
  setType("director"),
  fileUpload.single("image"),
  editingController.uploadDirectorImage
);
router.delete("/director/delete/:id", editingController.eraseDirector);

// CASTING ROUTES
router.post("/casting", editingController.addCasting);
router.put("/casting/:id", editingController.editingCasting);
router.put(
  "/casting/:id/image",
  setType("casting"),
  fileUpload.single("image"),
  editingController.uploadCastingImage
);
router.delete("/casting/:id", editingController.eraseCasting);

// SCREENWRITER ROUTES
router.post("/screenwriter", editingController.addScreenwriter);
router.put("/screenwriter/:id", editingController.editingScreenwriter);
router.put(
  "/screenwriter/:id/image",
  setType("screenwriter"),
  fileUpload.single("image"),
  editingController.uploadScreenwriterImage
);
router.delete("/screenwriter/:id", editingController.eraseScreenwriter);

// COMPOSITOR ROUTES
router.post("/compositor", editingController.addCompositor);
router.put("/compositor/:id", editingController.editingCompositor);
router.put(
  "/compositor/:id/image",
  setType("compositor"),
  fileUpload.single("image"),
  editingController.uploadCompositorImage
);
router.delete("/compositor/:id", editingController.eraseCompositor);

// STUDIO ROUTES
router.post("/studio", editingController.addStudio);
router.put("/studio/:id", editingController.editingStudio);
router.put(
  "/studio/:id/image",
  setType("studio"),
  fileUpload.single("image"),
  editingController.uploadStudioImage
);
router.delete("/studio/:id", editingController.eraseStudio);

// THEMA ROUTES
router.post("/thema", editingController.addThema);
router.put("/thema/:id", editingController.editingThema);
router.put(
  "/thema/:id/image",
  setType("thema"),
  fileUpload.single("image"),
  editingController.uploadThemaImage
);
router.delete("/thema/:id", editingController.eraseThema);

// COUNTRY ROUTES
router.post("/country", editingController.addCountry);
router.put("/country/:id", editingController.editingCountry);
router.put(
  "/country/:id/image",
  setType("country"),
  fileUpload.single("image"),
  editingController.uploadCountryImage
);
router.delete("/country/:id", editingController.eraseCountry);

// GENRE ROUTES
router.post("/genre", editingController.addGenre);
router.put("/genre/:id", editingController.editingGenre);
router.delete("/genre/:id", editingController.eraseGenre);

// LANGUAGE ROUTES
router.post("/language", editingController.addLanguage);
router.put("/language/:id", editingController.editingLanguage);
router.delete("/language/:id", editingController.eraseLanguage);

// TAG ROUTES
router.post("/tag", editingController.addTag);
router.put("/tag/:id", editingController.editingTag);
router.delete("/tag/:id", editingController.eraseTag);

module.exports = router;
