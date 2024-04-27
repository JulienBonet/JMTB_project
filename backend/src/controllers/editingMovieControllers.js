/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
// const fs = require("fs");
// const path = require("path");
// const editingModel = require("../models/editingModel");
const editingMovieModel = require("../models/editingMovieModel");

const addMovie = async (req, res) => {
  try {
    const {
      title,
      altTitle,
      year,
      duration,
      trailer,
      pitch,
      story,
      location,
      videoFormat,
      videoSupport,
      fileSize,
      idTheMovieDb,
      idIMDb,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Movie's title is required" });
    }

    await editingMovieModel.insertMovie(
      title,
      altTitle,
      year,
      duration,
      trailer,
      pitch,
      story,
      location,
      videoFormat,
      videoSupport,
      fileSize,
      idTheMovieDb,
      idIMDb
    );

    return res.status(201).json({ message: "Movie successfully created" });
  } catch (error) {
    console.error("Error movie creation :", error);
    return res.status(500).json({ message: "Error movie creation" });
  }
};

module.exports = {
  addMovie,
};
