const express = require("express");
const { exportCSV } = require("../controllers/exportStatsController");
const { exportSQL } = require("../controllers/exportStatsController");

const router = express.Router();

router.get("/admin/export-csv", exportCSV);
router.get("/admin/export-sql", exportSQL);

module.exports = router;
