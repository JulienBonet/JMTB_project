const userModel = require("../models/userModel");

const getAllUserIdDesc = async (req, res, next) => {
  try {
    const [tags] = await userModel.findAllByIdDesc();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUserIdDesc };
