const router = require("express").Router();
const favoriteController = require("../controllers/favoriteControllers");
const auth = require("../middlewares/authMiddleware");

router.post("/favorites", favoriteController.addFavorite);
router.delete("/favorites", favoriteController.unFavorite);
// ✅ Récupérer tous les favoris du user connecté
router.get("/favorites", auth, favoriteController.getAllFavoritesByUser);

// ✅ Tri alphabétique / chronologique
router.get("/favorites/sorted0", auth, favoriteController.getFavoritesAlphaAsc);
router.get(
  "/favorites/sorted1",
  auth,
  favoriteController.getFavoritesAlphaDesc
);
router.get("/favorites/sorted2", auth, favoriteController.getFavoritesYearAsc);
router.get("/favorites/sorted3", auth, favoriteController.getFavoritesYearDesc);

router.get("/favorites/:userId/:movieId", favoriteController.isFavorite);

module.exports = router;
