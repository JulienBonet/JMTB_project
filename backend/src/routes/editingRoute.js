const express = require("express");

const router = express.Router();
const fileUpload = require("../middlewares/fileUpload");
const editingController = require("../controllers/editingControllers");

router.put("/director/:id", editingController.editingDirector);
router.put(
  "/director/:id/image",
  fileUpload.single("image"),
  editingController.uploadDirectorImage
);

module.exports = router;
