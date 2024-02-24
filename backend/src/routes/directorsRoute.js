const router = require("express").Router();

const directorsController = require("../controllers/directorsControllers");

router.get("/directors", directorsController.getAllDirectorsAsc);
router.get("/directors/sorted_z", directorsController.getAllDirectorsDesc);
router.get("/directors/:id", directorsController.getAllMoviesByDirectorId);
router.get("/directors/:id/sorted/0", directorsController.getAllSorted0);
router.get("/directors/:id/sorted/1", directorsController.getAllSorted1);
router.get("/directors/:id/sorted/2", directorsController.getAllSorted2);
router.get("/directors/:id/sorted/3", directorsController.getAllSorted3);

module.exports = router;
