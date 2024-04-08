const moviesModel = require("../models/moviesModel");

const getAll = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAll();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted0 = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAll("title", "ASC");
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted1 = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAll("title", "DESC");
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted2 = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAll("year", "ASC");
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted3 = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAll("year", "DESC");
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSortedNox = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAllSortedNoX();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const [[movie]] = await moviesModel.findById(req.params.id);
    if (movie == null) {
      res.sendStatus(404);
    } else {
      res.json(movie);
    }
  } catch (err) {
    next(err);
  }
};

const getByLetter = async (req, res, next) => {
  try {
    const { letter } = req.params;
    const [movies] = await moviesModel.findByLetter(letter);
    if (!movies || movies.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(movies);
    }
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};

const getByLetterNumber = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findByLetterNumber();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getByYear = async (req, res, next) => {
  try {
    const { year } = req.params;
    const [movies] = await moviesModel.findByYear(year);
    if (!movies || movies.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(movies);
    }
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};

const getByYearSorted0 = async (req, res, next) => {
  try {
    const { year } = req.params;
    const [movies] = await moviesModel.findByYearSortedA(year);
    if (!movies || movies.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(movies);
    }
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};

const getByYearSorted1 = async (req, res, next) => {
  try {
    const { year } = req.params;
    const [movies] = await moviesModel.findByYearSortedZ(year);
    if (!movies || movies.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(movies);
    }
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};

const getAllCountry = async (req, res, next) => {
  try {
    const [years] = await moviesModel.findAllCountry();
    res.status(200).json(years);
  } catch (error) {
    next(error);
  }
};

const getAllCountryIdDesc = async (req, res, next) => {
  try {
    const [years] = await moviesModel.findAllCountryIdDesc();
    res.status(200).json(years);
  } catch (error) {
    next(error);
  }
};

const getAllByCountry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await moviesModel.findByCountry(id);
    if (!movies || movies.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(movies);
    }
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};

const getAllByCountrySorted0 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await moviesModel.findByCountrySortedAlpha(id);
    if (!movies || movies.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(movies);
    }
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};

const getAllByCountrySorted1 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await moviesModel.findByCountrySortedZeta(id);
    if (!movies || movies.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(movies);
    }
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};

const getAllByCountrySorted2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await moviesModel.findByCountrySortedYearAsc(id);
    if (!movies || movies.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(movies);
    }
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};

const getAllByCountrySorted3 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [movies] = await moviesModel.findByCountrySortedYearDesc(id);
    if (!movies || movies.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(movies);
    }
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};

const getAllYears = async (req, res, next) => {
  try {
    const [years] = await moviesModel.findAllYears();
    res.status(200).json(years);
  } catch (error) {
    next(error);
  }
};

const getAllDecades = async (req, res, next) => {
  try {
    const [decades] = await moviesModel.findAllDecades();
    res.status(200).json(decades);
  } catch (error) {
    next(error);
  }
};

const getAllForSearchFilter = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAllForSearchFilter();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  getAllSorted0,
  getAllSorted1,
  getAllSorted2,
  getAllSorted3,
  getAllSortedNox,
  getByLetter,
  getByLetterNumber,
  getByYear,
  getByYearSorted0,
  getByYearSorted1,
  getAllYears,
  getAllCountry,
  getAllCountryIdDesc,
  getAllByCountry,
  getAllByCountrySorted0,
  getAllByCountrySorted1,
  getAllByCountrySorted2,
  getAllByCountrySorted3,
  getAllDecades,
  getAllForSearchFilter,
};
