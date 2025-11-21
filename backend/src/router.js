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
const focusRouter = require("./routes/focusRoute");
const editingRouter = require("./routes/editingRoute");
const editingMovieRouter = require("./routes/editingMovieRoute");
const purgeRouter = require("./routes/purgeRoute");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");

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
router.use(focusRouter);
router.use(editingRouter);
router.use(editingMovieRouter);
router.use(purgeRouter);
router.use(userRouter);
router.use("/auth", authRouter);

/* ************************************************************************* */

module.exports = router;
