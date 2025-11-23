/* eslint-disable no-useless-return */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-shadow */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

// --------------------------------------------------------------
// CMD:
//
// node backend/database/ import_some_items_from_tmdb.js --reset
//
// node ./database/import_some_items_from_tmdb.js --reset
// --------------------------------------------------------------

require("dotenv").config();
const mysql = require("mysql2/promise");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { translateCountry } = require("./translateCountry");

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

  const delay = delayArg ? parseInt(delayArg.split("=")[1], 10) : 500;
  const batchSize = 20;
  const batchPause = 5000;

  if (shouldReset) {
    console.log("🧹 Réinitialisation complète...");
    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.query("UPDATE movies SET altTitle = NULL, trailer = NULL");
    await db.query("TRUNCATE TABLE movie_studio");
    await db.query("TRUNCATE TABLE movie_tag");
    await db.query(
      "DELETE FROM movie_director WHERE movieId IN (SELECT id FROM movies WHERE isTvShow = 1)"
    );
    await db.query("TRUNCATE TABLE movie_country");
    await db.query("TRUNCATE TABLE country");
    await db.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("✅ Réinitialisation terminée !");
  }

  // --- Récupération des films ---
  let [movies] = await db.query(
    "SELECT id, title, isTvShow, idTheMovieDb FROM movies WHERE idTheMovieDb IS NOT NULL"
  );

  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : null;
  if (limit) movies = movies.slice(0, limit);

  console.log(`🎞️ ${movies.length} films à synchroniser.`);

  // --- Préchargement des maps ---
  const [[tags], [studios], [countries], [directors]] = await Promise.all([
    db.query("SELECT id, name FROM tag"),
    db.query("SELECT id, name FROM studio"),
    db.query("SELECT id, name FROM country"),
    db.query("SELECT id, name FROM director"),
  ]);
  const tagMap = new Map(tags.map((t) => [t.name.toLowerCase(), t.id]));
  const studioMap = new Map(studios.map((s) => [s.name.toLowerCase(), s.id]));
  const countryMap = new Map(
    countries.map((c) => [c.name.toLowerCase(), c.id])
  );
  const directorMap = new Map(
    directors.map((d) => [d.name.toLowerCase(), d.id])
  );

  // --- Fonction processMovie à la racine ---
  async function processMovie(
    movie,
    db,
    tagMap,
    studioMap,
    countryMap,
    directorMap
  ) {
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

      if (data.status_code === 429) {
        console.warn(
          `⚠️ Limite TMDB atteinte pour ${movie.idTheMovieDb}. Pause 10s...`
        );
        await new Promise((r) => setTimeout(r, 10000));
        return processMovie(
          movie,
          db,
          tagMap,
          studioMap,
          countryMap,
          directorMap
        );
      }

      if (data.status_code) {
        console.warn(
          `⚠️ Erreur TMDB pour ${movie.idTheMovieDb}: ${data.status_message}`
        );
        return;
      }

      // --- TITRE & ALT TITLE ---
      const tmdbTitle = data.title?.trim() || null;
      const tmdbOriginal = data.original_title?.trim() || null;
      const altTitle =
        tmdbOriginal &&
        tmdbTitle &&
        tmdbOriginal.toLowerCase() !== tmdbTitle.toLowerCase()
          ? tmdbOriginal
          : null;

      // --- TRAILER ---
      const trailer = data.videos?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      const trailerUrl = trailer
        ? `https://www.youtube.com/watch?v=${trailer.key}`
        : null;

      await db.execute(
        "UPDATE movies SET altTitle = ?, trailer = ? WHERE id = ?",
        [altTitle, trailerUrl, movie.id]
      );

      // --- STUDIOS ---
      for (const s of data.production_companies ?? []) {
        const name = s.name.trim();
        if (!name) continue;
        const key = name.toLowerCase();
        let studioId = studioMap.get(key);
        if (!studioId) {
          const [result] = await db.execute(
            "INSERT INTO studio (name) VALUES (?)",
            [name]
          );
          studioId = result.insertId;
          studioMap.set(key, studioId);
        }
        await db.execute(
          "INSERT IGNORE INTO movie_studio (movieId, studioId) VALUES (?, ?)",
          [movie.id, studioId]
        );
      }

      // --- PAYS ---
      for (const c of data.production_countries ?? []) {
        const iso = c.iso_3166_1;
        if (!iso) continue;
        const nameFr = translateCountry(iso, c.name).trim();
        if (!nameFr) continue;
        const key = nameFr.toLowerCase();
        let countryId = countryMap.get(key);
        if (!countryId) {
          const [result] = await db.execute(
            "INSERT INTO country (name) VALUES (?)",
            [nameFr]
          );
          countryId = result.insertId;
          countryMap.set(key, countryId);
        }
        await db.execute(
          "INSERT IGNORE INTO movie_country (movieId, countryId) VALUES (?, ?)",
          [movie.id, countryId]
        );
      }

      // --- REALISATEURS TV ---
      if (movie.isTvShow) {
        for (const d of data.created_by ?? []) {
          const name = d.name.trim();
          if (!name) continue;
          const key = name.toLowerCase();
          let directorId = directorMap.get(key);
          if (!directorId) {
            const [result] = await db.execute(
              "INSERT INTO director (name) VALUES (?)",
              [name]
            );
            directorId = result.insertId;
            directorMap.set(key, directorId);
          }
          await db.execute(
            "INSERT IGNORE INTO movie_director (movieId, directorId) VALUES (?, ?)",
            [movie.id, directorId]
          );
        }
      }

      // --- TAGS ---
      const keywords =
        data.keywords?.keywords ??
        (Array.isArray(data.keywords) ? data.keywords : []);
      const tagSet = new Set();
      for (const kw of keywords) {
        if (!kw?.name) continue;
        kw.name
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
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
        `✅ ${movie.idTheMovieDb} OK | AltTitle: ${altTitle || "N/A"} | Pays FR: ${data.production_countries?.length || 0} | Studios: ${data.production_companies?.length || 0} | Tags: ${tagSet.size}`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));

      return; // <-- ajoute ce return pour ESLint
    } catch (err) {
      console.error(`❌ Erreur sur ${movie.idTheMovieDb}:`, err.message);
      return;
    }
  }

  // --- Batching ---
  for (let i = 0; i < movies.length; i += batchSize) {
    const batch = movies.slice(i, i + batchSize);
    for (const movie of batch) {
      await processMovie(movie, db, tagMap, studioMap, countryMap, directorMap);
    }
    if (i + batchSize < movies.length) {
      console.log(`⏸️ Pause ${batchPause / 1000}s avant le batch suivant...`);
      await new Promise((r) => setTimeout(r, batchPause));
    }
  }

  await db.end();
})();
