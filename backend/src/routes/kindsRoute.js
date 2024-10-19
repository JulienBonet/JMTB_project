const router = require("express").Router();

const kindsController = require("../controllers/kindsControllers");

router.get("/kinds", kindsController.getAllKinds);
router.get("/kinds/sorted_id", kindsController.getAllKindsIdDesc);
router.get("/kinds/:genre", kindsController.getAllMovieByKinds);
router.get("/kinds/:genre/sorted/0", kindsController.getAllSorted0);
router.get("/kinds/:genre/sorted/1", kindsController.getAllSorted1);
router.get("/kinds/:genre/sorted/2", kindsController.getAllSorted2);
router.get("/kinds/:genre/sorted/3", kindsController.getAllSorted3);
// ici il faut gérer une harmonisation genres, genre, kinds trés confusante
// router.get("/genres/:name", kindsController.getAllByName);
// router.get("/genre/byname/:name", kindsController.getAllByName);

router.get("/kind/:name", kindsController.getAllByName);
router.get("/genre/byname/:name", kindsController.getAllByName);

module.exports = router;
