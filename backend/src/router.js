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
const musicRouter = require("./routes/musicRoute");
const studioRouter = require("./routes/studioRoute");
const tagsRouter = require("./routes/tagsRoute");
const languagesRouter = require("./routes/languagesRoutes");

// Apply routes
router.use(moviesRouter);
router.use(kindsRouter);
router.use(directorsRouter);
router.use(castingRouter);
router.use(screenwriterRouter);
router.use(musicRouter);
router.use(studioRouter);
router.use(tagsRouter);
router.use(languagesRouter);

/* ************************************************************************* */

module.exports = router;
