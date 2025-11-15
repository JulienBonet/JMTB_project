const router = require("express").Router();

const focusController = require("../controllers/focusControllers");

router.get("/focus", focusController.getAllFocusSortedNameAsc);
router.get("/focus/sorted_id", focusController.getAllFocusSortedIdDesc);
router.get("/focus/:id", focusController.getAllFocusByCategoryIdRandom);
router.get("/focus/:id/sorted0", focusController.getAllFocusByCategoryIdAsc);
router.get("/focus/:id/sorted1", focusController.getAllFocusByCategoryIdDesc);
router.get("/focus/:id/movies", focusController.getAllMoviesByCategoryId);
router.get(
  "/focus/:id/movies/sorted0",
  focusController.getAllMoviesByCategoryIdAsc
);
router.get(
  "/focus/:id/movies/sorted1",
  focusController.getAllMoviesByCategoryIdDesc
);
router.get(
  "/focus/:id/movies/sorted2",
  focusController.getAllMoviesByCategoryIdYearAsc
);
router.get(
  "/focus/:id/movies/sorted3",
  focusController.getAllMoviesByCategoryIdYearDesc
);

router.get("/focus/byname/:name", focusController.getFocusByName);

router.get("/focus/byid/:id", focusController.getFocusById);

router.get("/focuscategory", focusController.getAllFocusCategory);

router.get("/focuscategory/byid/:id", focusController.getFocusCategoryById);

router.get(
  "/focuscategory/byname/:name",
  focusController.getFocusCategoryByName
);

module.exports = router;
