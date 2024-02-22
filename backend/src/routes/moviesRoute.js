const router = require("express").Router();

const moviesController = require("../controllers/moviesControllers");

router.get("/movies", moviesController.getAll);

module.exports = router;
