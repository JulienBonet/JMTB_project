const express = require("express");
const { exportCSV } = require("../controllers/exportStatsController");
const { exportSQL } = require("../controllers/exportStatsController");
const { getAdminStats } = require("../controllers/exportStatsController");

const router = express.Router();

router.get("/admin/export-csv", exportCSV);
router.get("/admin/export-sql", exportSQL);
router.get("/admin/stats", getAdminStats);

module.exports = router;
