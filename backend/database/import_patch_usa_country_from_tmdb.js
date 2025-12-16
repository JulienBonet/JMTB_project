/* eslint-disable no-shadow */
/* eslint-disable no-continue */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */

require("dotenv").config();
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

  // --- Pays à patcher ---
  const TARGET_COUNTRIES = [
    { iso: "US", dbName: "usa" },
    { iso: "GB", dbName: "royaume-uni" },
  ];

  // --- Récupération des IDs country ---
  const countryIdMap = new Map();

  for (const c of TARGET_COUNTRIES) {
    const [rows] = await db.query(
      "SELECT id FROM country WHERE LOWER(name) = ?",
      [c.dbName]
    );

    if (rows.length === 0) {
      console.error(`❌ Le pays "${c.dbName}" n'existe pas en base`);
      await db.end();
      return;
    }

    countryIdMap.set(c.iso, {
      id: rows[0].id,
      name: c.dbName,
    });
  }

  // --- Récupération des films ---
  const [movies] = await db.query(
    "SELECT id, idTheMovieDb FROM movies WHERE idTheMovieDb IS NOT NULL"
  );

  console.log(`🎞️ ${movies.length} films à vérifier pour USA & Royaume-Uni`);

  for (const movie of movies) {
    try {
      const [type, tmdbId] = movie.idTheMovieDb.split("/");

      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${tmdbId}?language=fr-FR`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMmE5ZDM3MjAyY2EzMDA0NWQyYTU3NThkYjQ5ODc4ZiIsIm5iZiI6MTcwNDU4MDM0NC41MzUsInN1YiI6IjY1OTlkNGY4NmU5MzhhMDA5MzFiNzI5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lxrKRrYh_y4YDzeWuxBXwLr2uTL3z-uaAa3Qwk4Ecbg`,
          },
        }
      );

      const data = await res.json();

      if (data.status_code === 429) {
        console.warn(`⚠️ Limite TMDB atteinte pour ${movie.idTheMovieDb}`);
        await new Promise((r) => setTimeout(r, 10000));
        continue;
      }

      if (data.status_code) {
        console.warn(
          `⚠️ Erreur TMDB pour ${movie.idTheMovieDb}: ${data.status_message}`
        );
        continue;
      }

      const tmdbCountries = data.production_countries ?? [];

      for (const target of TARGET_COUNTRIES) {
        const isPresentInTMDB = tmdbCountries.some(
          (c) => c.iso_3166_1 === target.iso
        );

        if (!isPresentInTMDB) continue;

        const { id: countryId, name } = countryIdMap.get(target.iso);

        const [existing] = await db.query(
          "SELECT 1 FROM movie_country WHERE movieId = ? AND countryId = ?",
          [movie.id, countryId]
        );

        if (existing.length === 0) {
          await db.execute(
            "INSERT INTO movie_country (movieId, countryId) VALUES (?, ?)",
            [movie.id, countryId]
          );
          console.log(
            `➕ ${name.toUpperCase()} ajouté au film ${movie.idTheMovieDb}`
          );
        } else {
          console.log(
            `ℹ️ ${name.toUpperCase()} déjà présent pour ${movie.idTheMovieDb}`
          );
        }
      }

      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`❌ Erreur sur ${movie.idTheMovieDb}:`, err.message);
    }
  }

  await db.end();
  console.log("🎯 Patch USA + Royaume-Uni terminé !");
})();
