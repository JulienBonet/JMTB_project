const router = require("express").Router();
const authController = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");

// Public route
router.post("/login", authController.login);

// Admin-only routes
router.post("/user", auth, adminOnly, authController.register);
router.patch(
  "/user/:id/password",
  auth,
  adminOnly,
  authController.changePassword
);
router.delete("/user/:id", auth, adminOnly, authController.deleteUser);

module.exports = router;
