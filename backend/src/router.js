const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// API Routes
/* ************************************************************************* */

// Import routes
const moviesRouter = require("./routes/moviesRoute");
const kindsRouter = require("./routes/kindsRoute");
const directorsRouter = require("./routes/directorsRoute");
const castingRouter = require("./routes/castingRoute");
const screenwriterRouter = require("./routes/screenwritersRoute");
const music = require("./routes/musicRoute");
const studio = require("./routes/studioRoute");

// Apply routes
router.use(moviesRouter);
router.use(kindsRouter);
router.use(directorsRouter);
router.use(castingRouter);
router.use(screenwriterRouter);
router.use(music);
router.use(studio);

/* ************************************************************************* */

module.exports = router;
