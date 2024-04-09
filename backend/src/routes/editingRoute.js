const express = require("express");

const router = express.Router();
const fileUpload = require("../middlewares/fileUpload");
const editingController = require("../controllers/editingControllers");

router.post("/director", editingController.addDirector);
router.put("/director/:id", editingController.editingDirector);
router.put(
  "/director/:id/image",
  fileUpload.single("image"),
  editingController.uploadDirectorImage
);
router.delete("/director/delete/:id", editingController.eraseDirector);

router.post("/casting", editingController.addCasting);
router.put("/casting/:id", editingController.editingCasting);
router.put(
  "/casting/:id/image",
  fileUpload.single("image"),
  editingController.uploadDCastingImage
);
router.delete("/casting/:id", editingController.eraseCasting);

module.exports = router;
