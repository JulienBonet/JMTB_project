const router = require("express").Router();

const musicController = require("../controllers/musicControllers");

router.get("/music", musicController.getAllArtistAsc);
router.get("/music/sorted_z", musicController.getAllArtistDesc);
router.get("/music/:id", musicController.getAllMoviesByArtistId);
router.get("/music/:id/sorted/0", musicController.getAllSorted0);
router.get("/music/:id/sorted/1", musicController.getAllSorted1);
router.get("/music/:id/sorted/2", musicController.getAllSorted2);
router.get("/music/:id/sorted/3", musicController.getAllSorted3);
router.get("/music/sorted/:letter", musicController.getAllByLetter);

module.exports = router;
