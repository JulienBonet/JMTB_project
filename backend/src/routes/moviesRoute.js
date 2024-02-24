const router = require("express").Router();

const moviesController = require("../controllers/moviesControllers");

router.get("/movies", moviesController.getAll);
router.get("/movies/:id", moviesController.getById);
router.get("/movies/sorted/0", moviesController.getAllSorted0);
router.get("/movies/sorted/1", moviesController.getAllSorted1);
router.get("/movies/sorted/2", moviesController.getAllSorted2);
router.get("/movies/sorted/3", moviesController.getAllSorted3);

module.exports = router;
