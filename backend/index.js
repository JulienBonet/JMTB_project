// Load environment variables from .env file
// require("dotenv").config();
// require("dotenv").config({
//   path: `.env.${process.env.NODE_ENV || "development"}`,
// });
require("dotenv").config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

// Import app from app.js
const app = require("./src/app");

// Get the port from the environment variables
const port = process.env.APP_PORT || 3310;

// Start the server and listen on the specified port
app
  .listen(port, () => {
    console.info(`Server is listening on port ${port}`);
  })
  .on("error", (err) => {
    console.error("Error:", err.message);
  });
