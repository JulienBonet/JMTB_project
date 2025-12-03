const express = require("express");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

// CORS pour permettre les requêtes du frontend
app.use(
  cors({
    // origin: ["http://localhost:3310", process.env.FRONTEND_URL],
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware pour parser les données JSON
app.use(express.json({ limit: "30mb" }));
app.use(
  express.urlencoded({ extended: false, limit: "30mb", parameterLimit: 50000 })
);

// Toutes les routes d’auth (login, register, changePassword)
app.use("/auth", authRoutes);

// *** Servir les fichiers statiques à partir du dossier 'public' ***
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Import des routes API
const router = require("./router");
// Assure-toi que le chemin soit correct
app.use("/api", router); // Routes API

// Chemin vers le build React (une fois construit)
// const reactBuildPath = path.join(__dirname, "../../frontend/build");
const reactBuildPath = path.join(__dirname, "../../frontend/dist"); // correction pour mise en prod
app.use(express.static(reactBuildPath));

// Rediriger toutes les autres routes vers l'index.html de React
app.get("*", (req, res) => {
  res.sendFile(path.join(reactBuildPath, "index.html"));
});

// --- Global Error Handler ---
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  console.error("➡️ On route:", req.method, req.url);
  res.status(500).json({ error: err.message });
});

// Exporter l'application sans la démarrer
module.exports = app;
