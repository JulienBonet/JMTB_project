/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */

require("dotenv").config({ path: "../.env.development" });
const mysql = require("mysql2/promise");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

(async () => {
  const db = await mysql.createConnection({
    host: "gondola.proxy.rlwy.net",
    port: "28587" || 3306,
    user: "root",
    password: "qrlqywGySEjWwLVhedEStcDxbpUfRKnk",
    database: "jmdb",
  });

  // Genres à vérifier
  const targetGenres = [
    "action",
    "science fiction",
    "science-fiction",
    "thriller",
  ];

  // Récupération de la map des genres existants
  const [genres] = await db.query("SELECT id, name FROM genre");
  const genreMap = new Map(genres.map((g) => [g.name.toLowerCase(), g.id]));

  // Récupération des films
  const [movies] = await db.query(
    "SELECT id, idTheMovieDb FROM movies WHERE idTheMovieDb IS NOT NULL"
  );

  console.log(`🎞️ ${movies.length} films à vérifier pour les genres.`);

  for (const movie of movies) {
    try {
      const [type, tmdbId] = movie.idTheMovieDb.split("/");

      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${tmdbId}?language=fr-FR`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VITE_APP_TMDB_AUTH_TOKEN}`,
          },
        }
      );
      const data = await res.json();

      if (data.status_code === 429) {
        console.warn(
          `⚠️ Limite TMDB atteinte pour ${movie.idTheMovieDb}, pause 10s...`
        );
        await new Promise((r) => setTimeout(r, 10000));
        continue;
      }

      if (data.status_code) {
        console.warn(
          `⚠️ Erreur TMDB pour ${movie.idTheMovieDb}: ${data.status_message}`
        );
        continue;
      }

      // Genres du film depuis TMDB
      const movieGenres = (data.genres ?? []).map((g) => g.name.toLowerCase());

      // Vérifie chaque genre cible
      for (const target of targetGenres) {
        if (movieGenres.includes(target)) {
          const genreId = genreMap.get(target);
          if (!genreId) {
            console.warn(
              `⚠️ Le genre "${target}" n'existe pas en base, skipping...`
            );
            continue;
          }

          // Vérifie si le film a déjà ce genre
          const [existing] = await db.query(
            "SELECT 1 FROM movie_genre WHERE movieId = ? AND genreId = ?",
            [movie.id, genreId]
          );

          if (existing.length === 0) {
            await db.execute(
              "INSERT INTO movie_genre (movieId, genreId) VALUES (?, ?)",
              [movie.id, genreId]
            );
            console.log(
              `➕ Ajout du genre "${target}" pour le film ${movie.idTheMovieDb}`
            );
          } else {
            console.log(
              `ℹ️ Le film ${movie.idTheMovieDb} a déjà le genre "${target}"`
            );
          }
        }
      }

      // Petit delay pour éviter de saturer TMDB
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`❌ Erreur sur ${movie.idTheMovieDb}:`, err.message);
    }
  }

  await db.end();
  console.log("🎯 Script terminé !");
})();
