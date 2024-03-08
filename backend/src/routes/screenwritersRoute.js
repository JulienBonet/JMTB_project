const router = require("express").Router();

const screewritersController = require("../controllers/screenwritersControllers");

router.get("/screenwriters", screewritersController.getAllArtistAsc);
router.get("/screenwriters/sorted_z", screewritersController.getAllArtistDesc);
router.get("/screenwriters/:id", screewritersController.getAllMoviesByArtistId);
router.get("/screenwriters/:id/sorted/0", screewritersController.getAllSorted0);
router.get("/screenwriters/:id/sorted/1", screewritersController.getAllSorted1);
router.get("/screenwriters/:id/sorted/2", screewritersController.getAllSorted2);
router.get("/screenwriters/:id/sorted/3", screewritersController.getAllSorted3);
router.get(
  "/screenwriters/sorted/:letter",
  screewritersController.getAllByLetter
);

module.exports = router;
