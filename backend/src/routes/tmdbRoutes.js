/* eslint-disable no-restricted-syntax */
const express = require("express");

const router = express.Router();

const {
  fetchMovieById,
  fetchTmdbData,
  fetchTrailerFromTMDB,
  fetchCoverFromTMDB,
  fetchKeywordsFromTMDB,
  fetchTvSeasons,
} = require("../controllers/tmdbController");

// TV SEASON
router.get("/tmdb/:mediaType/:movieId/seasons", fetchTvSeasons);

// TRAILER
router.get("/tmdb/:mediaType/:movieId/trailer", fetchTrailerFromTMDB);

// COVER
router.get("/tmdb/:mediaType/:movieId/cover", fetchCoverFromTMDB);

// KEYWORDS
router.get("/tmdb/:mediaType/:movieId/keywords", fetchKeywordsFromTMDB);

// OLD global fetch route (movie details)
router.get("/tmdb/:mediaType/:id", fetchMovieById);

// PACK ROUTE (idTheMovieDb)
router.get("/tmdb/:idTheMovieDb", fetchTmdbData);

module.exports = router;
