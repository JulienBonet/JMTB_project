const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import routes here
const moviesRouter = require("./routes/moviesRoute");
const kindsRouter = require("./routes/kindsRoute");
const directorsRouter = require("./routes/directorsRoute");

// Apply routes
router.use(moviesRouter);
router.use(kindsRouter);
router.use(directorsRouter);

/* ************************************************************************* */

module.exports = router;
