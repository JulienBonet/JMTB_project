const languagesModel = require("../models/languagesModel");

const getAllLanguagesIdDesc = async (req, res, next) => {
  try {
    const [languages] = await languagesModel.findAllLanguagesIdDesc();
    res.status(200).json(languages);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLanguagesIdDesc,
};
