/* eslint-disable no-shadow */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
require("dotenv").config();
const mysql = require("mysql2/promise");

// eslint-disable-next-line no-shadow
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

(async () => {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // pour reste les tables movie_tag et tag. s'enclenche ds node avec> npm run db:import-tags:reset
  const shouldReset = process.argv.includes("--reset");

  if (shouldReset) {
    console.log("🧹 Réinitialisation des tables tag et movie_tag...");

    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.query("TRUNCATE TABLE movie_tag");
    await db.query("TRUNCATE TABLE tag");
    await db.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("✅ Tables vidées avec succès !");
  }

  // Abonder les tables movie_tag et tag. s'enclenche ds node avec> npm run db:import-tags
  try {
    // 1️⃣ On récupère tous les films avec un id TMDB
    const [movies] = await db.query(
      "SELECT id, idTheMovieDb FROM movies WHERE idTheMovieDb IS NOT NULL"
    );
    console.log(`🎞️ ${movies.length} films trouvés avec idTheMovieDb.`);

    // 2️⃣ On boucle sur chaque film
    for (const movie of movies) {
      try {
        const [type, tmdbId] = movie.idTheMovieDb.split("/"); // "movie/680" -> ["movie", "680"]

        // 🔹 Requête TMDB
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${tmdbId}/keywords`,
          {
            headers: {
              Authorization: `Bearer ${process.env.VITE_APP_TMDB_AUTH_TOKEN}`,
            },
          }
        );

        const data = await res.json();

        // Vérification d'erreur côté TMDB
        if (data.status_code) {
          console.warn(
            `⚠️ Erreur TMDB pour ${movie.idTheMovieDb}: ${data.status_message}`
          );
          continue;
        }

        const keywords = data.keywords ?? data.results ?? [];
        console.log(
          `${movie.idTheMovieDb} - ${keywords.length} mots-clés trouvés`
        );

        // 3️⃣ On insère chaque tag s’il n’existe pas encore
        for (const kw of keywords) {
          // Vérifier existence du tag
          const [existing] = await db.execute(
            "SELECT id FROM tag WHERE name = ?",
            [kw.name]
          );

          let tagId;
          if (existing.length > 0) {
            tagId = existing[0].id;
          } else {
            const [result] = await db.execute(
              "INSERT INTO tag (name) VALUES (?)",
              [kw.name]
            );
            tagId = result.insertId;
          }

          // 4️⃣ Lier film et tag sans doublon
          await db.execute(
            "INSERT IGNORE INTO movie_tag (movieId, tagId) VALUES (?, ?)",
            [movie.id, tagId]
          );
        }

        console.log(
          `✅ Tags ajoutés pour ${movie.idTheMovieDb} (${keywords.length} tags)`
        );

        // Petite pause pour ne pas surcharger l’API
        await new Promise((r) => setTimeout(r, 300));
      } catch (err) {
        console.error(`❌ Erreur sur ${movie.idTheMovieDb}:`, err.message);
      }
    }

    console.log("🏁 Import terminé avec succès !");
  } catch (err) {
    console.error("Erreur globale :", err.message);
  } finally {
    await db.end();
  }
})();
