const router = require("express").Router();

const purgeControllers = require("../controllers/purgeControllers");

router.post("/purge", purgeControllers.purgeDatabase);

module.exports = router;
