const router = require("express").Router();

const studioController = require("../controllers/studioControllers");

router.get("/studio", studioController.getAllArtistAsc);
router.get("/studio/sorted_z", studioController.getAllArtistDesc);
router.get("/studio/:id", studioController.getAllMoviesByArtistId);
router.get("/studio/:id/sorted/0", studioController.getAllSorted0);
router.get("/studio/:id/sorted/1", studioController.getAllSorted1);
router.get("/studio/:id/sorted/2", studioController.getAllSorted2);
router.get("/studio/:id/sorted/3", studioController.getAllSorted3);
router.get("/studio/sorted/:letter", studioController.getAllByLetter);

module.exports = router;
