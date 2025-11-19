/* eslint-disable no-shadow */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-await-in-loop */
require("dotenv").config();

//-------------
// COMMAND NODE
//----------------------------------------------------
// Avec reset (vide tag et movie_tag avant l’import)
// npm run db:import-tags:reset
//---------------------------------------------------
// Sans reset (ajoute les tags aux existants)
// npm run db:import-tags
//---------------------------------------------------

const mysql = require("mysql2/promise");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

(async () => {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const shouldReset = process.argv.includes("--reset");

  if (shouldReset) {
    console.log("🧹 Réinitialisation des tables tag et movie_tag...");
    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.query("TRUNCATE TABLE movie_tag");
    await db.query("TRUNCATE TABLE tag");
    await db.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("✅ Tables vidées avec succès !");
  }

  try {
    const [movies] = await db.query(
      "SELECT id, idTheMovieDb FROM movies WHERE idTheMovieDb IS NOT NULL"
    );
    console.log(`🎞️ ${movies.length} films trouvés avec idTheMovieDb.`);

    for (const movie of movies) {
      try {
        const [type, tmdbId] = movie.idTheMovieDb.split("/");

        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${tmdbId}/keywords`,
          {
            headers: {
              Authorization: `Bearer ${process.env.VITE_APP_TMDB_AUTH_TOKEN}`,
            },
          }
        );

        const data = await res.json();
        if (data.status_code) {
          console.warn(
            `⚠️ Erreur TMDB pour ${movie.idTheMovieDb}: ${data.status_message}`
          );
          continue;
        }

        const keywords = data.keywords ?? data.results ?? [];
        const tagSet = new Set(); // pour dédoublonner par film

        // 1️⃣ Split + trim + lowercase
        for (const kw of keywords) {
          kw.name
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
            .forEach((t) => tagSet.add(t.toLowerCase()));
        }

        // 2️⃣ Insertion tags + association
        for (const tagName of tagSet) {
          // Vérifier si le tag existe déjà
          const [existing] = await db.execute(
            "SELECT id FROM tag WHERE name = ?",
            [tagName]
          );

          let tagId;
          if (existing.length > 0) {
            tagId = existing[0].id;
          } else {
            const [result] = await db.execute(
              "INSERT INTO tag (name) VALUES (?)",
              [tagName]
            );
            tagId = result.insertId;
          }

          // Lier le film au tag
          await db.execute(
            "INSERT IGNORE INTO movie_tag (movieId, tagId) VALUES (?, ?)",
            [movie.id, tagId]
          );
        }

        console.log(
          `✅ Tags ajoutés pour ${movie.idTheMovieDb} (${tagSet.size} tags)`
        );

        // Petite pause pour l'API
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
