const themasModel = require("../models/themasModel");

const getAllThemaIdDesc = async (req, res, next) => {
  try {
    const [themas] = await themasModel.findAllThemaIdDesc();
    res.status(200).json(themas);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllThemaIdDesc,
};
