const router = require("express").Router();

const editingController = require("../controllers/editingControllers");

router.put("/director/:id", editingController.editingDirector);

module.exports = router;
