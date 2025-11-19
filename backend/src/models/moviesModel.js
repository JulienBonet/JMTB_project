const db = require("../../database/client");

const findAll = (orderBy = "id", orderDir = "DESC") => {
  return db.query(`SELECT * FROM movies ORDER BY ${orderBy} ${orderDir}`, []);
};

const findAllSortedNoX = () => {
  return db
    .query(
      `SELECT *
    FROM movies
    WHERE id NOT IN (SELECT movieId FROM jmdb.movie_genre WHERE genreId = 1);`,
      []
    )
    .then((result) => {
      return result;
    });
};

const findById = (id) => {
  return db.query(
    `SELECT movies.*,
    GROUP_CONCAT(DISTINCT director.name SEPARATOR ', ') AS directors,
    GROUP_CONCAT(DISTINCT casting.name SEPARATOR ', ') AS casting,
    GROUP_CONCAT(DISTINCT genre.name SEPARATOR ', ') AS genres,
    GROUP_CONCAT(DISTINCT country.name SEPARATOR ', ') AS countries,
    GROUP_CONCAT(DISTINCT language.name SEPARATOR ', ') AS languages,
    GROUP_CONCAT(DISTINCT music.name SEPARATOR ', ') AS music,
    GROUP_CONCAT(DISTINCT screenwriter.name SEPARATOR ', ') AS screenwriters,
    GROUP_CONCAT(DISTINCT studio.name SEPARATOR ', ') AS studios,
    GROUP_CONCAT(DISTINCT tag.name SEPARATOR ', ') AS tags,
    GROUP_CONCAT(DISTINCT focus.name SEPARATOR ', ') AS focus
FROM movies
LEFT JOIN movie_director ON movies.id = movie_director.movieId
LEFT JOIN director ON movie_director.directorId = director.id
LEFT JOIN movie_casting ON movies.id = movie_casting.movieId
LEFT JOIN casting ON movie_casting.castingId = casting.id
LEFT JOIN movie_genre ON movies.id = movie_genre.movieId
LEFT JOIN genre ON movie_genre.genreId = genre.id
LEFT JOIN movie_country ON movies.id = movie_country.movieId
LEFT JOIN country ON movie_country.countryId = country.id
LEFT JOIN movie_language ON movies.id = movie_language.movieId
LEFT JOIN language ON movie_language.languageId = language.id
LEFT JOIN movie_music ON movies.id = movie_music.movieId
LEFT JOIN music ON movie_music.musicId = music.id
LEFT JOIN movie_screenwriter ON movies.id = movie_screenwriter.movieId
LEFT JOIN screenwriter ON movie_screenwriter.screenwriterId = screenwriter.id
LEFT JOIN movie_studio ON movies.id = movie_studio.movieId
LEFT JOIN studio ON movie_studio.studioId = studio.id
LEFT JOIN movie_tag ON movies.id = movie_tag.movieId
LEFT JOIN tag ON movie_tag.tagId = tag.id
LEFT JOIN movie_focus ON movies.id = movie_focus.movieId
LEFT JOIN focus ON movie_focus.focusId = focus.id
WHERE movies.id = ?
GROUP BY movies.id, movies.title, movies.altTitle, movies.year, movies.duration, movies.cover, movies.trailer, movies.pitch, movies.story, movies.location, movies.videoFormat, movies.comment, movies.videoSupport, movies.fileSize, movies.idTheMovieDb, movies.idIMDb;
  `,
    [id]
  );
};

const findAllYears = () => {
  return db.query(
    "SELECT DISTINCT year FROM movies WHERE year IS NOT NULL ORDER BY year DESC;"
  );
};

const findByYear = (year) => {
  return db.query("SELECT * FROM movies WHERE year LIKE ?;", [`${year}%`]);
};

const findByYearSortedA = (year) => {
  return db.query(
    "SELECT * FROM movies WHERE year LIKE ? ORDER BY title ASC;",
    [`${year}%`]
  );
};

const findByYearSortedZ = (year) => {
  return db.query(
    "SELECT * FROM movies WHERE year LIKE ? ORDER BY title DESC;",
    [`${year}%`]
  );
};

const findAllCountry = () => {
  return db.query(
    "SELECT id, name FROM country WHERE name IS NOT NULL ORDER BY name ASC;"
  );
};

const findAllCountryIdDesc = () => {
  return db.query("SELECT * FROM country order by id desc;");
};

const findCountryByName = (name) => {
  return db.query("SELECT * FROM country WHERE name = ?", [name]);
};

const findByCountry = (id) => {
  return db.query(
    "SELECT * FROM movies AS m JOIN movie_country AS mc ON m.id = mc.movieId JOIN country AS c ON c.id = mc.countryId WHERE c.id = ?;",
    [id]
  );
};

const findByCountrySortedAlpha = (id) => {
  return db.query(
    "SELECT * FROM movies AS m JOIN movie_country AS mc ON m.id = mc.movieId JOIN country AS c ON c.id = mc.countryId WHERE c.id = ? ORDER BY title ASC;",
    [id]
  );
};

const findByCountrySortedZeta = (id) => {
  return db.query(
    "SELECT * FROM movies AS m JOIN movie_country AS mc ON m.id = mc.movieId JOIN country AS c ON c.id = mc.countryId WHERE c.id = ? ORDER BY title DESC;",
    [id]
  );
};

const findByCountrySortedYearAsc = (id) => {
  return db.query(
    "SELECT * FROM movies AS m JOIN movie_country AS mc ON m.id = mc.movieId JOIN country AS c ON c.id = mc.countryId WHERE c.id = ? ORDER BY year ASC;",
    [id]
  );
};

const findByCountrySortedYearDesc = (id) => {
  return db.query(
    "SELECT * FROM movies AS m JOIN movie_country AS mc ON m.id = mc.movieId JOIN country AS c ON c.id = mc.countryId WHERE c.id = ? ORDER BY year DESC;",
    [id]
  );
};

const findAllDecades = () => {
  return db.query(
    "SELECT DISTINCT FLOOR(year / 10) * 10 AS decade FROM movies WHERE year IS NOT NULL ORDER BY decade DESC;"
  );
};

const findMoviesByDecade = (decade) => {
  return db.query("SELECT * FROM movies WHERE FLOOR(year / 10) * 10 = ?;", [
    decade,
  ]);
};

const findByTvShow = (isTvShow) => {
  let sql = `
    SELECT movies.*, 
      GROUP_CONCAT(DISTINCT genre.name SEPARATOR ', ') AS genres, 
      GROUP_CONCAT(DISTINCT country.name SEPARATOR ', ') AS countries
    FROM movies
    LEFT JOIN movie_genre ON movies.id = movie_genre.movieId
    LEFT JOIN genre ON movie_genre.genreId = genre.id
    LEFT JOIN movie_country ON movies.id = movie_country.movieId
    LEFT JOIN country ON movie_country.countryId = country.id
  `;

  // Si isTvShow est "0" ou "1", ajouter la condition
  if (isTvShow === "0" || isTvShow === "1") {
    sql += ` WHERE movies.isTvShow = ?`;
    sql += " GROUP BY movies.id ORDER BY movies.id DESC;";
    return db.query(sql, [isTvShow]);
  }

  // Sinon, tous les films et séries
  sql += " GROUP BY movies.id ORDER BY movies.id DESC;";
  return db.query(sql, []);
};

const findFilteredMovies = async ({
  search,
  kind,
  country,
  year,
  tvshow,
  orderby,
  direction,
}) => {
  let sql = `
    SELECT m.*
    FROM movies m
    LEFT JOIN movie_genre mg ON mg.movieId = m.id
    LEFT JOIN genre g ON g.id = mg.genreId
    LEFT JOIN movie_country mc ON mc.movieId = m.id
    LEFT JOIN country c ON c.id = mc.countryId
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    sql += " AND m.title LIKE ?";
    params.push(`%${search}%`);
  }

  if (kind) {
    sql += " AND g.name = ?";
    params.push(kind);
  }

  if (country) {
    sql += " AND c.name = ?";
    params.push(country);
  }

  if (year) {
    const start = parseInt(year, 10);
    const end = start + 9;
    sql += " AND m.year BETWEEN ? AND ?";
    params.push(start, end);
  }

  if (tvshow === "0" || tvshow === "1") {
    sql += " AND m.isTvShow = ?";
    params.push(tvshow);
  }

  // 🛡 Orderby whitelist
  const allowedOrder = ["title", "year", "id"];
  const safeOrder = allowedOrder.includes(orderby) ? orderby : "id";
  const safeDirection = direction === "ASC" ? "ASC" : "DESC";

  // Si on trie par titre, ignorer les articles
  if (safeOrder === "title") {
    sql += `
      GROUP BY m.id
      ORDER BY LOWER(
        CASE
          WHEN LOWER(m.title) LIKE 'le %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'la %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'les %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE "l'%" THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE "l’%" THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE 'un %' THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE 'une %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'the %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'a %' THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE 'an %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'el %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'los %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'las %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'una %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'unos %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'unas %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'il %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'lo %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'i %' THEN SUBSTRING(m.title, 3)
          WHEN LOWER(m.title) LIKE 'gli %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'uno %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'der %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'die %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'das %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'ein %' THEN SUBSTRING(m.title, 4)
          WHEN LOWER(m.title) LIKE 'eine %' THEN SUBSTRING(m.title, 5)
          WHEN LOWER(m.title) LIKE 'einen %' THEN SUBSTRING(m.title, 6)
          ELSE m.title
        END
      ) ${safeDirection};
    `;
  } else {
    sql += ` GROUP BY m.id ORDER BY ${safeOrder} ${safeDirection}`;
  }

  const [rows] = await db.query(sql, params);
  return rows;
};

const findByName = async (title) => {
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) as count FROM movies WHERE title = ?",
      [title]
    );
    return rows[0].count > 0; // true si existe, false sinon
  } catch (err) {
    console.error("Erreur dans Movie_ findByName:", err);
    throw err;
  }
};

module.exports = {
  findAll,
  findById,
  findAllSortedNoX,
  findAllYears,
  findAllCountry,
  findAllCountryIdDesc,
  findCountryByName,
  findByCountry,
  findByCountrySortedAlpha,
  findByCountrySortedZeta,
  findByCountrySortedYearAsc,
  findByCountrySortedYearDesc,
  findByYear,
  findByYearSortedA,
  findByYearSortedZ,
  findAllDecades,
  findMoviesByDecade,
  findByTvShow,
  findFilteredMovies,
  findByName,
};
