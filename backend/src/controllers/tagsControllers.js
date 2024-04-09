const tagsModel = require("../models/tagsModel");

const getAllTagsIdDesc = async (req, res, next) => {
  try {
    const [tags] = await tagsModel.findAllTagIdDesc();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTagsIdDesc,
};
