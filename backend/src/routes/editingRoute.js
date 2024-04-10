const express = require("express");

const router = express.Router();
// const fileUpload = require("../middlewares/fileUpload");
const { fileUpload, setType } = require("../middlewares/fileUpload");
const editingController = require("../controllers/editingControllers");

// DIRECTORS ROUTE
router.post("/director", editingController.addDirector);
router.put("/director/:id", editingController.editingDirector);
router.put(
  "/director/:id/image",
  setType("director"),
  fileUpload.single("image"),
  editingController.uploadDirectorImage
);
router.delete("/director/delete/:id", editingController.eraseDirector);

// CASTING ROUTE
router.post("/casting", editingController.addCasting);
router.put("/casting/:id", editingController.editingCasting);
router.put(
  "/casting/:id/image",
  fileUpload.single("image"),
  editingController.uploadCastingImage
);
router.delete("/casting/:id", editingController.eraseCasting);

// SCREENWRITER ROUTE
router.post("/screenwriter", editingController.addScreenwriter);
router.put("/screenwriter/:id", editingController.editingScreenwriter);
router.put(
  "/screenwriter/:id/image",
  fileUpload.single("image"),
  editingController.uploadScreenwriterImage
);
router.delete("/screenwriter/:id", editingController.eraseScreenwriter);

// COMPOSITOR ROUTE
router.post("/compositor", editingController.addCompositor);
router.put("/compositor/:id", editingController.editingCompositor);
router.put(
  "/compositor/:id/image",
  fileUpload.single("image"),
  editingController.uploadCompositorImage
);
router.delete("/compositor/:id", editingController.eraseCompositor);

// STUDIO ROUTE
router.post("/studio", editingController.addStudio);
router.put("/studio/:id", editingController.editingStudio);
router.put(
  "/studio/:id/image",
  fileUpload.single("image"),
  editingController.uploadStudioImage
);
router.delete("/studio/:id", editingController.eraseStudio);

module.exports = router;
