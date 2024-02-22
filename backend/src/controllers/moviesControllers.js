const moviesModel = require("../models/moviesModel");

const getAll = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAll();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
};
