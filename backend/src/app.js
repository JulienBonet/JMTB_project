const express = require("express");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://jmdb.julienbonet.fr"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parsing
app.use(express.json({ limit: "30mb" }));
app.use(
  express.urlencoded({ extended: false, limit: "30mb", parameterLimit: 50000 })
);

// Auth routes
app.use("/auth", authRoutes);

// Import des routes API
const router = require("./router");

app.use("/api", router);

// Build React
const reactBuildPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(reactBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(reactBuildPath, "index.html"));
});

// Error handler
app.use((err, req, res) => {
  console.error("🔥 Server Error:", err.message);
  console.error("➡️ On route:", req.method, req.url);
  res.status(500).json({ error: err.message });
});

module.exports = app;
