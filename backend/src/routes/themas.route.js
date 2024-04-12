const router = require("express").Router();

const ThemasController = require("../controllers/themasControllers");

router.get("/themas/sorted_id", ThemasController.getAllThemaIdDesc);

module.exports = router;
