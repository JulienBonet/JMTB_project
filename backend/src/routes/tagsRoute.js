const router = require("express").Router();

const tagsController = require("../controllers/tagsControllers");

router.get("/tags/sorted_id", tagsController.getAllTagsIdDesc);

module.exports = router;
