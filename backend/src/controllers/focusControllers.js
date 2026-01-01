// const focusModel = require("../models/focusModel");

// const getAllFocusSortedNameAsc = async (req, res, next) => {
//   try {
//     const [focus] = await focusModel.findAllFocusSortedNameAsc();
//     res.status(200).json(focus);
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllFocusSortedIdDesc = async (req, res, next) => {
//   try {
//     const [focus] = await focusModel.findAllFocusSortedIdDesc();
//     res.status(200).json(focus);
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllFocusByCategoryIdRandom = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const [focus] = await focusModel.findAllFocusByCategoryIdRandom(id);
//     res.status(200).json(focus);
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllFocusByCategoryIdAsc = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const [focus] = await focusModel.findAllFocusByCategoryIdAsc(id);
//     res.status(200).json(focus);
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllFocusByCategoryIdDesc = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const [focus] = await focusModel.findAllFocusByCategoryIdDesc(id);
//     res.status(200).json(focus);
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllMoviesByCategoryId = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const [focus] = await focusModel.findAllMoviesByCategoryId(id);
//     res.status(200).json(focus);
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllMoviesByCategoryIdAsc = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const [focus] = await focusModel.findAllMoviesByCategoryIdAsc(id);
//     res.status(200).json(focus);
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllMoviesByCategoryIdDesc = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const [focus] = await focusModel.findAllMoviesByCategoryIdDesc(id);
//     res.status(200).json(focus);
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllMoviesByCategoryIdYearAsc = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const [focus] = await focusModel.findAllMoviesByCategoryIdYearAsc(id);
//     res.status(200).json(focus);
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllMoviesByCategoryIdYearDesc = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const [focus] = await focusModel.findAllMoviesByCategoryIdYearDesc(id);
//     res.status(200).json(focus);
//   } catch (error) {
//     next(error);
//   }
// };

// const getFocusByName = async (req, res, next) => {
//   try {
//     const { name } = req.params;
//     const [[focus]] = await focusModel.findFocusByName(name);
//     res.status(200).json(focus);
//   } catch (error) {
//     next(error);
//   }
// };

// const getFocusById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const [[focus]] = await focusModel.findFocusById(id);
//     res.status(200).json(focus);
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllFocusCategory = async (req, res, next) => {
//   try {
//     const [focusCategory] = await focusModel.findAllFocusCategory();
//     res.status(200).json(focusCategory);
//   } catch (error) {
//     next(error);
//   }
// };

// const getFocusCategoryByName = async (req, res, next) => {
//   try {
//     const { name } = req.params;
//     const [focus] = await focusModel.findFocusCategoryByName(name);
//     res.status(200).json(focus);
//   } catch (error) {
//     next(error);
//   }
// };

// const getFocusCategoryById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const [focus] = await focusModel.findFocusCategoryById(id);
//     res.status(200).json(focus);
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   getAllFocusSortedNameAsc,
//   getAllFocusSortedIdDesc,
//   getAllFocusByCategoryIdRandom,
//   getAllFocusByCategoryIdAsc,
//   getAllFocusByCategoryIdDesc,
//   getAllMoviesByCategoryId,
//   getAllMoviesByCategoryIdAsc,
//   getAllMoviesByCategoryIdDesc,
//   getAllMoviesByCategoryIdYearAsc,
//   getAllMoviesByCategoryIdYearDesc,
//   getFocusByName,
//   getFocusById,
//   getAllFocusCategory,
//   getFocusCategoryByName,
//   getFocusCategoryById,
// };

const focusModel = require("../models/focusModel");

// -------------------------------------------------
// FOCUS LIST
// -------------------------------------------------

const getAllFocusSortedNameAsc = async (req, res, next) => {
  try {
    const [focus] = await focusModel.findAllFocusSortedNameAsc();
    res.status(200).json(focus);
  } catch (error) {
    next(error);
  }
};

const getAllFocusSortedIdDesc = async (req, res, next) => {
  try {
    const [focus] = await focusModel.findAllFocusSortedIdDesc();
    res.status(200).json(focus);
  } catch (error) {
    next(error);
  }
};

const getAllFocusByCategoryIdRandom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [focus] = await focusModel.findAllFocusByCategoryIdRandom(id);
    res.status(200).json(focus);
  } catch (error) {
    next(error);
  }
};

const getAllFocusByCategoryIdAsc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [focus] = await focusModel.findAllFocusByCategoryIdAsc(id);
    res.status(200).json(focus);
  } catch (error) {
    next(error);
  }
};

const getAllFocusByCategoryIdDesc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [focus] = await focusModel.findAllFocusByCategoryIdDesc(id);
    res.status(200).json(focus);
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------
// MOVIES BY FOCUS
// -------------------------------------------------

const getAllMoviesByCategoryId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await focusModel.findAllMoviesByCategoryId(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllMoviesByCategoryIdAsc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await focusModel.findAllMoviesByCategoryIdAsc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllMoviesByCategoryIdDesc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await focusModel.findAllMoviesByCategoryIdDesc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllMoviesByCategoryIdYearAsc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await focusModel.findAllMoviesByCategoryIdYearAsc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllMoviesByCategoryIdYearDesc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await focusModel.findAllMoviesByCategoryIdYearDesc(id);
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------
// SINGLE FOCUS
// -------------------------------------------------

const getFocusByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const [[focus]] = await focusModel.findFocusByName(name);
    res.status(200).json(focus);
  } catch (error) {
    next(error);
  }
};

const getFocusById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[focus]] = await focusModel.findFocusById(id);
    res.status(200).json(focus);
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------
// FOCUS CATEGORY
// -------------------------------------------------

const getAllFocusCategory = async (req, res, next) => {
  try {
    const [focusCategory] = await focusModel.findAllFocusCategory();
    res.status(200).json(focusCategory);
  } catch (error) {
    next(error);
  }
};

const getFocusCategoryByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const [category] = await focusModel.findFocusCategoryByName(name);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const getFocusCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [category] = await focusModel.findFocusCategoryById(id);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------
// EXPORTS
// -------------------------------------------------

module.exports = {
  getAllFocusSortedNameAsc,
  getAllFocusSortedIdDesc,
  getAllFocusByCategoryIdRandom,
  getAllFocusByCategoryIdAsc,
  getAllFocusByCategoryIdDesc,
  getAllMoviesByCategoryId,
  getAllMoviesByCategoryIdAsc,
  getAllMoviesByCategoryIdDesc,
  getAllMoviesByCategoryIdYearAsc,
  getAllMoviesByCategoryIdYearDesc,
  getFocusByName,
  getFocusById,
  getAllFocusCategory,
  getFocusCategoryByName,
  getFocusCategoryById,
};
