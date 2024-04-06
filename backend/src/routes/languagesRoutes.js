const router = require("express").Router();

const languagesController = require("../controllers/languagesControllers");

router.get("/languages/sorted_id", languagesController.getAllLanguagesIdDesc);

module.exports = router;
