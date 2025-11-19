const router = require("express").Router();
const moviesController = require("../controllers/moviesControllers");

// ⭐ ROUTE PRINCIPALE DES FILTRES
router.get("/movies/search-filter", moviesController.getFilteredMovies);

// ⭐ LISTE COMPLÈTE (non filtrée)
router.get("/movies", moviesController.getAll);

// ⭐ FILMS PAR NOM
router.get("/movies/name/:name", moviesController.getByName);

// ⭐ FILMS PAR ID
router.get("/movies/:id", moviesController.getById);

// ⭐ TRI DIVERS
router.get("/movies/sorted/0", moviesController.getAllSorted0);
router.get("/movies/sorted/1", moviesController.getAllSorted1);
router.get("/movies/sorted/2", moviesController.getAllSorted2);
router.get("/movies/sorted/3", moviesController.getAllSorted3);
router.get("/movies/sorted/nox", moviesController.getAllSortedNox);

// ⭐ PAYS
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

// ⭐ ANNÉES
router.get("/movies/year/sorted/:year", moviesController.getByYear);
router.get("/movies/year/sorted/0/:year", moviesController.getByYearSorted0);
router.get("/movies/year/sorted/1/:year", moviesController.getByYearSorted1);

// ⭐ SERIES / TVSHOW
router.get("/movies/filter/tvshow", moviesController.getByTvShow);

// ⭐ OPTIONS (listes pour select)
router.get("/years", moviesController.getAllYears);
router.get("/decades", moviesController.getAllDecades);
router.get("/country", moviesController.getAllCountry);
router.get("/country/sorted_id", moviesController.getAllCountryIdDesc);
router.get("/country/byname/:name", moviesController.getAllCountryByName);

module.exports = router;
