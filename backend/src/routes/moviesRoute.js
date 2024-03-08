const router = require("express").Router();

const moviesController = require("../controllers/moviesControllers");

router.get("/movies", moviesController.getAll);
router.get("/movies/:id", moviesController.getById);
router.get("/movies/sorted/0", moviesController.getAllSorted0);
router.get("/movies/sorted/1", moviesController.getAllSorted1);
router.get("/movies/sorted/2", moviesController.getAllSorted2);
router.get("/movies/sorted/3", moviesController.getAllSorted3);
router.get("/movies/sorted/nox", moviesController.getAllSortedNox);
router.get(
  "/movies/sorted/4/letter_numbers",
  moviesController.getByLetterNumber
);
router.get("/movies/sorted/4/:letter", moviesController.getByLetter);
router.get("/movies/sorted/5/:year", moviesController.getByYear);

module.exports = router;
