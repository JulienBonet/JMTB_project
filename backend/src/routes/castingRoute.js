const router = require("express").Router();

const castingController = require("../controllers/castingControllers");

router.get("/casting", castingController.getAllArtistAsc);
router.get("/casting/sorted_z", castingController.getAllArtistDesc);
router.get("/casting/sorted_id", castingController.getAllArtistIdDesc);
router.get("/casting/:id", castingController.getAllMoviesByArtistId);
router.get("/casting/:id/sorted/0", castingController.getAllSorted0);
router.get("/casting/:id/sorted/1", castingController.getAllSorted1);
router.get("/casting/:id/sorted/2", castingController.getAllSorted2);
router.get("/casting/:id/sorted/3", castingController.getAllSorted3);
router.get("/casting/sorted/:letter", castingController.getAllByLetter);
router.get("/casting/byname/:name", castingController.getAllByName);
router.get("/casting/byid/:id", castingController.getAllById);

module.exports = router;
