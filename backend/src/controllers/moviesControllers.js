const moviesModel = require("../models/moviesModel");

const imageBaseUrl = "http://localhost:3310/public";

// const getAll = async (req, res, next) => {
//   try {
//     const [movies] = await moviesModel.findAll();
//     res.status(200).json(movies);
//   } catch (error) {
//     next(error);
//   }
// };

const getAll = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAll();

    // Pour chaque film, ajoutez l'URL de l'image à ses détails
    const moviesWithImageUrl = movies.map((movie) => ({
      ...movie,
      imageUrl: `http://localhost:3310/${movie.image}`, // Supposons que le nom de l'image est stocké dans le champ "image" du modèle de film
    }));
    console.info(moviesWithImageUrl);
    res.status(200).json(moviesWithImageUrl);
  } catch (error) {
    next(error);
  }
};

const getAllSorted0 = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAllSortedAlpha();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted1 = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAllSortedZeta();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted2 = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAllSortedYear();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const getAllSorted3 = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAllSortedYearDESC();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

// const getAllSortedNox = async (req, res, next) => {
//   try {
//     const [movies] = await moviesModel.findAllSortedNoX();
//     res.status(200).json(movies);
//   } catch (error) {
//     next(error);
//   }
// };

const getAllSortedNox = async (req, res, next) => {
  try {
    const [movies] = await moviesModel.findAllSortedNoX();

    if (!movies || movies.length === 0) {
      res.sendStatus(404);
    } else {
      const moviesWithImageUrl = movies.map((movie) => ({
        ...movie,
        imageUrl: `${imageBaseUrl}/${movie.cover}`, // Utilisez imageBaseUrl pour former l'URL de l'image
      }));
      console.info(moviesWithImageUrl);
      res.json(moviesWithImageUrl);
    }
  } catch (err) {
    next(err);
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
};
