/* eslint-disable no-promise-executor-return */
/* eslint-disable no-shadow */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

// ---------------------------------------------
// CMD:

// node backend/database/ import_some_items_from_tmdb.js
//
// node backend/database/import_some_items_from_tmdb.js --reset
// ---------------------------------------------

require("dotenv").config();
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
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const delayArg = process.argv.find((arg) => arg.startsWith("--delay="));

  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : null;
  const delay = delayArg ? parseInt(delayArg.split("=")[1], 10) : 300;

  if (shouldReset) {
    console.log(
      "🧹 Réinitialisation des champs altTitle/trailer et des associations..."
    );
    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.query("UPDATE movies SET altTitle = NULL, trailer = NULL");
    await db.query("TRUNCATE TABLE movie_studio");
    await db.query("TRUNCATE TABLE movie_country");
    await db.query("TRUNCATE TABLE movie_tag");
    await db.query(
      "DELETE FROM movie_director WHERE movieId IN (SELECT id FROM movies WHERE isTvShow = 1)"
    );
    await db.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("✅ Réinitialisation terminée !");
  }

  try {
    let [movies] = await db.query(
      "SELECT id, title, isTvShow, idTheMovieDb FROM movies WHERE idTheMovieDb IS NOT NULL"
    );

    if (limit) movies = movies.slice(0, limit);

    console.log(
      `🎞️ ${movies.length} films/TV shows trouvés avec idTheMovieDb.`
    );

    // Précharger tags, studios, countries, directors pour éviter doublons
    const [tags] = await db.query("SELECT id, name FROM tag");
    const tagMap = new Map(tags.map((t) => [t.name.toLowerCase(), t.id]));

    const [studios] = await db.query("SELECT id, name FROM studio");
    const studioMap = new Map(studios.map((s) => [s.name.toLowerCase(), s.id]));

    const [countries] = await db.query("SELECT id, name FROM country");
    const countryMap = new Map(
      countries.map((c) => [c.name.toLowerCase(), c.id])
    );

    const [directors] = await db.query("SELECT id, name FROM director");
    const directorMap = new Map(
      directors.map((d) => [d.name.toLowerCase(), d.id])
    );

    for (const movie of movies) {
      try {
        const [type, tmdbId] = movie.idTheMovieDb.split("/");

        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${tmdbId}?append_to_response=videos,keywords&language=fr-FR`,
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

        // --- Alt title ---
        let altTitle = null;
        if (movie.isTvShow) {
          if (data.original_name && data.original_name !== movie.title)
            altTitle = data.original_name;
        } else if (data.original_title && data.original_title !== movie.title)
          altTitle = data.original_title;

        // --- Trailer ---
        let trailerUrl = null;
        if (
          data.videos &&
          data.videos.results &&
          data.videos.results.length > 0
        ) {
          const trailer = data.videos.results.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );
          if (trailer)
            trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
        }

        // Update movies
        await db.execute(
          "UPDATE movies SET altTitle = ?, trailer = ? WHERE id = ?",
          [altTitle, trailerUrl, movie.id]
        );

        // --- Studios ---
        const studiosList = data.production_companies ?? [];
        for (const s of studiosList) {
          const name = s.name.trim();
          if (!name) continue;
          let studioId = studioMap.get(name.toLowerCase());
          if (!studioId) {
            const [result] = await db.execute(
              "INSERT INTO studio (name) VALUES (?)",
              [name]
            );
            studioId = result.insertId;
            studioMap.set(name.toLowerCase(), studioId);
          }
          await db.execute(
            "INSERT IGNORE INTO movie_studio (movieId, studioId) VALUES (?, ?)",
            [movie.id, studioId]
          );
        }

        // --- Countries ---
        const countriesList = data.production_countries ?? [];
        for (const c of countriesList) {
          const name = c.name.trim();
          if (!name) continue;
          let countryId = countryMap.get(name.toLowerCase());
          if (!countryId) {
            const [result] = await db.execute(
              "INSERT INTO country (name) VALUES (?)",
              [name]
            );
            countryId = result.insertId;
            countryMap.set(name.toLowerCase(), countryId);
          }
          await db.execute(
            "INSERT IGNORE INTO movie_country (movieId, countryId) VALUES (?, ?)",
            [movie.id, countryId]
          );
        }

        // --- Directors (TV show only) ---
        if (movie.isTvShow && Array.isArray(data.created_by)) {
          for (const d of data.created_by) {
            const name = d.name.trim();
            if (!name) continue;
            let directorId = directorMap.get(name.toLowerCase());
            if (!directorId) {
              const [result] = await db.execute(
                "INSERT INTO director (name) VALUES (?)",
                [name]
              );
              directorId = result.insertId;
              directorMap.set(name.toLowerCase(), directorId);
            }
            await db.execute(
              "INSERT IGNORE INTO movie_director (movieId, directorId) VALUES (?, ?)",
              [movie.id, directorId]
            );
          }
        }

        // --- Tags ---
        const keywords = Array.isArray(data.keywords?.keywords)
          ? data.keywords.keywords
          : Array.isArray(data.keywords)
            ? data.keywords
            : [];

        const tagSet = new Set();
        for (const kw of keywords) {
          if (!kw?.name) continue;
          kw.name
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
            .forEach((t) => tagSet.add(t.toLowerCase()));
        }
        for (const tagName of tagSet) {
          let tagId = tagMap.get(tagName);
          if (!tagId) {
            const [result] = await db.execute(
              "INSERT INTO tag (name) VALUES (?)",
              [tagName]
            );
            tagId = result.insertId;
            tagMap.set(tagName, tagId);
          }
          await db.execute(
            "INSERT IGNORE INTO movie_tag (movieId, tagId) VALUES (?, ?)",
            [movie.id, tagId]
          );
        }

        console.log(
          `✅ TMDB mis à jour pour ${movie.idTheMovieDb} (altTitle: ${altTitle || "N/A"}, trailer: ${trailerUrl ? "oui" : "non"}, studios: ${studiosList.length}, pays: ${countriesList.length}, tags: ${tagSet.size})`
        );

        // --- Pause pour l'API ---
        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (err) {
        console.error(`❌ Erreur sur ${movie.idTheMovieDb}:`, err.message);
      }
    }

    console.log("🏁 Import TMDB + Tags terminé !");
  } catch (err) {
    console.error("Erreur globale :", err.message);
  } finally {
    await db.end();
  }
})();
