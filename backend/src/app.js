const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// CORS pour permettre les requêtes du frontend
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST"], // Méthodes autorisées
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware pour parser les données JSON
app.use(express.json({ limit: "30mb" }));
app.use(
  express.urlencoded({ extended: false, limit: "30mb", parameterLimit: 50000 })
);

// *** Servir les fichiers statiques à partir du dossier 'public' ***
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Import des routes API
const router = require("./router");
// Assure-toi que le chemin soit correct
app.use("/api", router); // Routes API

// Chemin vers le build React (une fois construit)
const reactBuildPath = path.join(__dirname, "../../frontend/build");
app.use(express.static(reactBuildPath));

// Rediriger toutes les autres routes vers l'index.html de React
app.get("*", (req, res) => {
  res.sendFile(path.join(reactBuildPath, "index.html"));
});

// Exporter l'application sans la démarrer
module.exports = app;

// _______________________________________________________________________________
// /* eslint-disable no-unused-vars */
// // Load the express module to create a web application

// const express = require("express");
// const path = require("path");

// const app = express();

// /* ************************************************************************* */

// const cors = require("cors");

// app.use(
//   cors({
//     origin: [
//       process.env.FRONTEND_URL,
//       "http://mysite.com",
//       "http://another-domain.com",
//     ],
//   })
// );

// /* ************************************************************************* */

// app.use(express.json({ limit: "30mb" }));
// app.use(
//   express.urlencoded({ extended: false, limit: "30mb", parameterLimit: 50000 })
// );
// // app.use(express.text());
// // app.use(express.raw());

// /* ************************************************************************* */

// // Cookies: Why and how to use the `cookie-parser` module?

// // Cookies are small pieces of data stored in the client's browser. They are often used to store user-specific information or session data.

// // The `cookie-parser` module allows us to parse and manage cookies in our Express application. It parses the `Cookie` header in incoming requests and populates `req.cookies` with an object containing the cookies.

// // To use `cookie-parser`, make sure it is installed in `backend/package.json` (you may need to install it separately):
// // npm install cookie-parser

// // Then, require the module and use it as middleware in your Express application:

// // const cookieParser = require("cookie-parser");
// // app.use(cookieParser());

// // Once `cookie-parser` is set up, you can read and set cookies in your routes.
// // For example, to set a cookie named "username" with the value "john":
// // res.cookie("username", "john");

// // To read the value of a cookie named "username":
// // const username = req.cookies.username;

// /* ************************************************************************* */

// // Import the API routes from the router module
// const router = require("./router");

// // Mount the API routes under the "/api" endpoint
// app.use("/api", router);

// /* ************************************************************************* */

// /*
// const reactBuildPath = `${__dirname}/../../frontend/dist`;

// // Serve react resources

// app.use(express.static(reactBuildPath));

// // Redirect unhandled requests to the react index file

// app.get("*", (req, res) => {
//   res.sendFile(`${reactBuildPath}/index.html`);
// });
// */

// const publicFolderPath = path.join(__dirname, "../public/images");
// app.use(express.static(publicFolderPath));

// /* ************************************************************************* */

// // Define a middleware function to log errors
// const logErrors = (err, req, res, next) => {
//   // Log the error to the console for debugging purposes
//   console.error(err);
//   console.error("on req:", req.method, req.path);

//   // Pass the error to the next middleware in the stack
//   res.status(500).json(err.message);
// };

// // Mount the logErrors middleware globally
// app.use(logErrors);

// /* ************************************************************************* */

// module.exports = app;
