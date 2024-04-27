const express = require("express");

const router = express.Router();
// const { fileUpload, setType } = require("../middlewares/fileUpload");
const editingMovieController = require("../controllers/editingMovieControllers");

// MOVIES ROUTES
router.post("/movie", editingMovieController.addMovie);

module.exports = router;
