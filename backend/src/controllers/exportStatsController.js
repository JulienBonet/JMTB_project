const { writeToStream } = require("@fast-csv/format");
const fs = require("fs");
const path = require("path");
const db = require("../../database/client");

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

    const filePath = path.join(tmpDir, "movies_export.csv");
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

module.exports = { exportCSV };
