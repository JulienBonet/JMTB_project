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
router.get("/movies/sorted/country/:id", moviesController.getAllByCountry);
router.get(
  "/movies/sorted/country/sorted/0/:id",
  moviesController.getAllByCountrySorted0
);
router.get(
  "/movies/sorted/country/sorted/1/:id",
  moviesController.getAllByCountrySorted1
);
router.get(
  "/movies/sorted/country/sorted/2/:id",
  moviesController.getAllByCountrySorted2
);
router.get(
  "/movies/sorted/country/sorted/3/:id",
  moviesController.getAllByCountrySorted3
);
router.get("/movies/year/sorted/:year", moviesController.getByYear);
router.get("/movies/year/sorted/0/:year", moviesController.getByYearSorted0);
router.get("/movies/year/sorted/1/:year", moviesController.getByYearSorted1);
router.get("/years", moviesController.getAllYears);
router.get("/country", moviesController.getAllCountry);
router.get("/country/sorted_id", moviesController.getAllCountryIdDesc);
router.get(
  "/movies/filter/:genre/:year/:country",
  moviesController.filterMovies
);

module.exports = router;
