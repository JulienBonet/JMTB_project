const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import routes here
const moviesRouter = require("./routes/moviesRoute");

// Apply routes
router.use(moviesRouter);

/* ************************************************************************* */

module.exports = router;
