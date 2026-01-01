// const router = require("express").Router();

// const focusController = require("../controllers/focusControllers");

// router.get("/focus", focusController.getAllFocusSortedNameAsc);
// router.get("/focus/sorted_id", focusController.getAllFocusSortedIdDesc);
// router.get("/focus/:id", focusController.getAllFocusByCategoryIdRandom);
// router.get("/focus/:id/sorted0", focusController.getAllFocusByCategoryIdAsc);
// router.get("/focus/:id/sorted1", focusController.getAllFocusByCategoryIdDesc);
// router.get("/focus/:id/movies", focusController.getAllMoviesByCategoryId);
// router.get(
//   "/focus/:id/movies/sorted0",
//   focusController.getAllMoviesByCategoryIdAsc
// );
// router.get(
//   "/focus/:id/movies/sorted1",
//   focusController.getAllMoviesByCategoryIdDesc
// );
// router.get(
//   "/focus/:id/movies/sorted2",
//   focusController.getAllMoviesByCategoryIdYearAsc
// );
// router.get(
//   "/focus/:id/movies/sorted3",
//   focusController.getAllMoviesByCategoryIdYearDesc
// );

// router.get("/focus/byname/:name", focusController.getFocusByName);

// router.get("/focus/byid/:id", focusController.getFocusById);

// router.get("/focuscategory", focusController.getAllFocusCategory);

// router.get("/focuscategory/byid/:id", focusController.getFocusCategoryById);

// router.get(
//   "/focuscategory/byname/:name",
//   focusController.getFocusCategoryByName
// );

// module.exports = router;

const router = require("express").Router();
const focusController = require("../controllers/focusControllers");

// -------------------------------------------------
// FOCUS LIST
// -------------------------------------------------

router.get("/focus", focusController.getAllFocusSortedNameAsc); // tri par nom ASC
router.get("/focus/sorted_id", focusController.getAllFocusSortedIdDesc); // tri par id DESC

// -------------------------------------------------
// FOCUS BY CATEGORY ID
// -------------------------------------------------

// random order
router.get("/focus/:id", focusController.getAllFocusByCategoryIdRandom);

// alphabetical order (ASC / DESC)
router.get("/focus/:id/sorted0", focusController.getAllFocusByCategoryIdAsc);
router.get("/focus/:id/sorted1", focusController.getAllFocusByCategoryIdDesc);

// -------------------------------------------------
// MOVIES BY FOCUS CATEGORY
// -------------------------------------------------

router.get("/focus/:id/movies", focusController.getAllMoviesByCategoryId);
router.get(
  "/focus/:id/movies/sorted0",
  focusController.getAllMoviesByCategoryIdAsc
); // titre ASC
router.get(
  "/focus/:id/movies/sorted1",
  focusController.getAllMoviesByCategoryIdDesc
); // titre DESC
router.get(
  "/focus/:id/movies/sorted2",
  focusController.getAllMoviesByCategoryIdYearAsc
); // année ASC
router.get(
  "/focus/:id/movies/sorted3",
  focusController.getAllMoviesByCategoryIdYearDesc
); // année DESC

// -------------------------------------------------
// SINGLE FOCUS
// -------------------------------------------------

router.get("/focus/byname/:name", focusController.getFocusByName);
router.get("/focus/byid/:id", focusController.getFocusById);

// -------------------------------------------------
// FOCUS CATEGORY
// -------------------------------------------------

router.get("/focuscategory", focusController.getAllFocusCategory);
router.get("/focuscategory/byid/:id", focusController.getFocusCategoryById);
router.get(
  "/focuscategory/byname/:name",
  focusController.getFocusCategoryByName
);

module.exports = router;
