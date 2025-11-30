/* eslint-disable consistent-return */
const { writeToStream } = require("@fast-csv/format");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const db = require("../../database/client");
require("dotenv").config();

const exportCSV = async (req, res) => {
  try {
    await db.query("SET SESSION group_concat_max_len = 1000000;");

    const [rows] = await db.query(`
  SELECT 
    m.id AS movieId,
    m.title,
    m.year,
    m.duration,
    g.genres,
    co.countries,
    l.languages,
    d.directors,
    s.screenwriters,
    mu.composers,
    ca.cast,
    st.studios,
    t.tags,
    f.focus
  FROM movies m
  LEFT JOIN (
      SELECT md.movieId, GROUP_CONCAT(d.name SEPARATOR ', ') AS directors
      FROM movie_director md
      JOIN director d ON d.id = md.directorId
      GROUP BY md.movieId
  ) d ON d.movieId = m.id
  LEFT JOIN (
      SELECT ms.movieId, GROUP_CONCAT(s.name SEPARATOR ', ') AS screenwriters
      FROM movie_screenwriter ms
      JOIN screenwriter s ON s.id = ms.screenwriterId
      GROUP BY ms.movieId
  ) s ON s.movieId = m.id
  LEFT JOIN (
      SELECT mm.movieId, GROUP_CONCAT(mu.name SEPARATOR ', ') AS composers
      FROM movie_music mm
      JOIN music mu ON mu.id = mm.musicId
      GROUP BY mm.movieId
  ) mu ON mu.movieId = m.id
  LEFT JOIN (
      SELECT mc.movieId, GROUP_CONCAT(ca.name SEPARATOR ', ') AS cast
      FROM movie_casting mc
      JOIN casting ca ON ca.id = mc.castingId
      GROUP BY mc.movieId
  ) ca ON ca.movieId = m.id
  LEFT JOIN (
      SELECT mco.movieId, GROUP_CONCAT(co.name SEPARATOR ', ') AS countries
      FROM movie_country mco
      JOIN country co ON co.id = mco.countryId
      GROUP BY mco.movieId
  ) co ON co.movieId = m.id
  LEFT JOIN (
      SELECT ml.movieId, GROUP_CONCAT(l.name SEPARATOR ', ') AS languages
      FROM movie_language ml
      JOIN language l ON l.id = ml.languageId
      GROUP BY ml.movieId
  ) l ON l.movieId = m.id
  LEFT JOIN (
      SELECT mg.movieId, GROUP_CONCAT(g.name SEPARATOR ', ') AS genres
      FROM movie_genre mg
      JOIN genre g ON g.id = mg.genreId
      GROUP BY mg.movieId
  ) g ON g.movieId = m.id
  LEFT JOIN (
      SELECT mf.movieId, GROUP_CONCAT(f.name SEPARATOR ', ') AS focus
      FROM movie_focus mf
      JOIN focus f ON f.id = mf.focusId
      GROUP BY mf.movieId
  ) f ON f.movieId = m.id
  LEFT JOIN (
      SELECT mst.movieId, GROUP_CONCAT(st.name SEPARATOR ', ') AS studios
      FROM movie_studio mst
      JOIN studio st ON st.id = mst.studioId
      GROUP BY mst.movieId
  ) st ON st.movieId = m.id
  LEFT JOIN (
      SELECT mt.movieId, GROUP_CONCAT(t.name SEPARATOR ', ') AS tags
      FROM movie_tag mt
      JOIN tag t ON t.id = mt.tagId
      GROUP BY mt.movieId
  ) t ON t.movieId = m.id
  ORDER BY m.title;
`);

    if (!rows.length) {
      return res.status(404).send("Aucune donnée à exporter");
    }

    const tmpDir = path.join(__dirname, "../tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const filePath = path.join(
      tmpDir,
      `movies_export_${new Date().toISOString().replace(/[:.]/g, "-")}.csv`
    );
    const ws = fs.createWriteStream(filePath);

    writeToStream(ws, rows, { headers: true })
      .on("finish", () => {
        res.download(filePath, "movies_export.csv", (err) => {
          if (!err) fs.unlinkSync(filePath);
        });
      })
      .on("error", (err) => {
        console.error("Erreur fast-csv:", err);
        res.status(500).send("Erreur lors de l'écriture du CSV");
      });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de l'export CSV");
  }
};

const exportSQL = async (req, res) => {
  try {
    // Dossier temporaire
    const tmpDir = path.join(__dirname, "../tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const filePath = path.join(
      tmpDir,
      `jmdb_database_backup_${new Date().toISOString().replace(/[:.]/g, "-")}.sql`
    );

    // Récupérer les infos depuis le .env
    const { DB_USER, DB_PASSWORD, DB_NAME } = process.env;

    // Commande mysqldump dynamique
    // Attention : pas d'espace entre -p et le mot de passe
    const cmd = `mysqldump -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > "${filePath}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erreur export SQL: ${error.message}`);
        return res.status(500).send("Erreur lors de l'export SQL");
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }

      // Téléchargement du fichier
      res.download(filePath, `${DB_NAME}_backup.sql`, (err) => {
        if (!err) fs.unlinkSync(filePath);
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};

const getAdminStats = async (req, res) => {
  try {
    const stats = {};

    // Nombre total de films
    const [[{ totalMovies }]] = await db.query(
      "SELECT COUNT(*) AS totalMovies FROM movies"
    );
    stats.totalMovies = totalMovies;
    // Nombre de DVD original
    const [[{ totalDVDOriginal }]] = await db.query(
      "SELECT COUNT(*) AS totalDVDOriginal FROM movies WHERE videoSupport = 'DVD original'"
    );
    stats.totalDVDOriginal = totalDVDOriginal;

    // Nombre de DVD R/RW
    const [[{ totalDVDRRW }]] = await db.query(
      "SELECT COUNT(*) AS totalDVDRRW FROM movies WHERE videoSupport = 'DVD R/RW'"
    );
    stats.totalDVDRRW = totalDVDRRW;

    // Nombre de fichiers multimédias
    const [[{ totalMediaFiles }]] = await db.query(
      "SELECT COUNT(*) AS totalMediaFiles FROM movies WHERE videoSupport = 'Fichier multimédia'"
    );
    stats.totalMediaFiles = totalMediaFiles;

    // Poids total des fichiers multimédia
    const [[{ totalSize }]] = await db.query(
      `SELECT SUM(
        CASE
          WHEN fileSize LIKE '%GB' THEN CAST(REPLACE(fileSize, ' GB', '') AS DECIMAL(10,2))*1024
          WHEN fileSize LIKE '%MB' THEN CAST(REPLACE(fileSize, ' MB', '') AS DECIMAL(10,2))
          ELSE 0
        END
      ) AS totalSize
      FROM movies`
    );
    stats.totalSizeMB = totalSize ? Number(totalSize) : 0; // en MB

    // Durée totale de tous les films (en minutes)
    const [[{ totalDuration }]] = await db.query(
      "SELECT SUM(duration) AS totalDuration FROM movies"
    );
    stats.totalDuration = totalDuration || 0;

    // Nombre total de genres
    const [[{ totalGenres }]] = await db.query(
      "SELECT COUNT(*) AS totalGenres FROM genre"
    );
    stats.totalGenres = totalGenres;

    // Liste des genres avec nombre de films par genre
    const [genresByCount] = await db.query(`
      SELECT g.name, COUNT(mg.movieId) AS movieCount
      FROM genre g
      LEFT JOIN movie_genre mg ON mg.genreId = g.id
      GROUP BY g.id
      ORDER BY movieCount DESC
    `);
    stats.genresByCount = genresByCount;

    // Nombre total de réalisateurs
    const [[{ totalDirectors }]] = await db.query(
      "SELECT COUNT(*) AS totalDirectors FROM director"
    );
    stats.totalDirectors = totalDirectors;

    // Nombre total de scénaristes
    const [[{ totalScreenwriters }]] = await db.query(
      "SELECT COUNT(*) AS totalScreenwriters FROM screenwriter"
    );
    stats.totalScreenwriters = totalScreenwriters;

    // Nombre total de compositeurs
    const [[{ totalComposers }]] = await db.query(
      "SELECT COUNT(*) AS totalComposers FROM music"
    );
    stats.totalComposers = totalComposers;

    // Nombre total de studios
    const [[{ totalStudios }]] = await db.query(
      "SELECT COUNT(*) AS totalStudios FROM studio"
    );
    stats.totalStudios = totalStudios;

    // Nombre total de tags
    const [[{ totalTags }]] = await db.query(
      "SELECT COUNT(*) AS totalTags FROM tag"
    );
    stats.totalTags = totalTags;

    // Nombre total de focus
    const [[{ totalFocus }]] = await db.query(
      "SELECT COUNT(*) AS totalFocus FROM focus"
    );
    stats.totalFocus = totalFocus;

    // Liste des categories de focus avec nombres de focus
    const [focusByCategory] = await db.query(`
      SELECT fc.name AS categoryName, COUNT(f.id) AS focusCount
      FROM focuscategory fc
      LEFT JOIN focus f ON f.categoryId = fc.id
      GROUP BY fc.id
      ORDER BY focusCount DESC
    `);
    stats.focusByCategory = focusByCategory;

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération des stats");
  }
};

module.exports = { exportCSV, exportSQL, getAdminStats };
