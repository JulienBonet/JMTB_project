const tagsModel = require("../models/tagsModel");

const getAllTagAsc = async (req, res, next) => {
  try {
    const [tags] = await tagsModel.findAllTagAsc();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

const getAllTagDesc = async (req, res, next) => {
  try {
    const [tags] = await tagsModel.findAllTagDesc();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

const getAllTagsIdDesc = async (req, res, next) => {
  try {
    const [tags] = await tagsModel.findAllTagIdDesc();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

const getAllMoviesByTagId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await tagsModel.findAllMoviesByTagId(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted0 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await tagsModel.findAllMoviesByTagIdAsc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted1 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await tagsModel.findAllMoviesByTagIdDesc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await tagsModel.findAllMoviesByTagIdYearAsc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted3 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await tagsModel.findAllMoviesByTagIdYearDesc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllByLetter = async (req, res, next) => {
  try {
    const { letter } = req.params;
    const [tags] = await tagsModel.findAllByLetter(letter);
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

const getAllByName = async (req, res) => {
  try {
    const { name } = req.params;
    const [rows] = await tagsModel.findTagByName(name);

    if (rows.length === 0) {
      // 🔥 Toujours renvoyer un JSON valide
      return res.status(200).json([]);
    }

    // rows[0] contient ton tag
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error in getAllByName:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[tags]] = await tagsModel.findTagById(id);
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTagAsc,
  getAllTagDesc,
  getAllTagsIdDesc,
  getAllMoviesByTagId,
  getAllSorted0,
  getAllSorted1,
  getAllSorted2,
  getAllSorted3,
  getAllByLetter,
  getAllByName,
  getAllById,
};
