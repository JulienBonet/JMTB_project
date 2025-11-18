const router = require("express").Router();

const directorsController = require("../controllers/directorsControllers");

router.get("/directors", directorsController.getAllArtistAsc);
router.get("/directors/sorted_z", directorsController.getAllArtistDesc);
router.get("/directors/sorted_id", directorsController.getAllArtistIdDesc);
router.get(
  "/directors/focus/random",
  directorsController.getAllArtistFocusRandom
);

router.get(
  "/directors/focus/sorted/0",
  directorsController.getAllArtistFocusAsc
);

router.get(
  "/directors/focus/sorted/1",
  directorsController.getAllArtistFocusDesc
);

router.get(
  "/directors/focus/sorted/2",
  directorsController.getAllArtistFocusYearAsc
);

router.get(
  "/directors/focus/sorted/3",
  directorsController.getAllArtistFocusYearDesc
);
router.get("/directors/:id", directorsController.getAllMoviesByArtistId);
router.get("/directors/:id/sorted/0", directorsController.getAllSorted0);
router.get("/directors/:id/sorted/1", directorsController.getAllSorted1);
router.get("/directors/:id/sorted/2", directorsController.getAllSorted2);
router.get("/directors/:id/sorted/3", directorsController.getAllSorted3);
router.get("/directors/sorted/:letter", directorsController.getAllByLetter);
router.get("/director/byname/:name", directorsController.getAllByName);
router.get("/director/byid/:id", directorsController.getAllById);

module.exports = router;
