const express = require("express");
const { exportCSV } = require("../controllers/exportStatsController");

const router = express.Router();

router.get("/admin/export-csv", exportCSV);

module.exports = router;
