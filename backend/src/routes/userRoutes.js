const router = require("express").Router();

const userController = require("../controllers/userControllers");

router.get("/user/sorted_id", userController.getAllUserIdDesc);

module.exports = router;
