const router = require("express").Router();

const tagsController = require("../controllers/tagsControllers");

router.get("/tags", tagsController.getAllTagAsc);
router.get("/tags/sorted_z", tagsController.getAllTagDesc);
router.get("/tags/sorted_id", tagsController.getAllTagsIdDesc);
router.get("/tags/:id", tagsController.getAllMoviesByTagId);
router.get("/tags/:id/sorted/0", tagsController.getAllSorted0);
router.get("/tags/:id/sorted/1", tagsController.getAllSorted1);
router.get("/tags/:id/sorted/2", tagsController.getAllSorted2);
router.get("/tags/:id/sorted/3", tagsController.getAllSorted3);
router.get("/tags/sorted/:letter", tagsController.getAllByLetter);
router.get("/tags/byname/:name", tagsController.getAllByName);
router.get("/tags/byid/:id", tagsController.getAllById);

module.exports = router;
