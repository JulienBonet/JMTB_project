/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
const fetch = require("node-fetch"); // ou global fetch si Node >= 18

// Helper générique pour un fetch TMDB
const fetchTMDB = async (url) => {
  const r = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.VITE_APP_TMDB_AUTH_TOKEN}`,
      Accept: "application/json",
    },
  });
  if (!r.ok) throw new Error(`TMDB fetch failed: ${r.status}`);
  return r.json();
};

/* -------------------------------------------
   1️⃣  FETCH COMPLET MOVIE / CREDITS / VIDEOS / KEYWORDS
-------------------------------------------- */
const fetchMovieById = async (req, res, next) => {
  const { mediaType, id } = req.params;

  try {
    const movieData = await fetchTMDB(
      `https://api.themoviedb.org/3/${mediaType}/${id}?language=fr-FR`
    );
    const credits = await fetchTMDB(
      `https://api.themoviedb.org/3/${mediaType}/${id}/credits?language=fr-FR`
    );
    const videos = await fetchTMDB(
      `https://api.themoviedb.org/3/${mediaType}/${id}/videos?language=fr-FR`
    );
    const keywords = await fetchTMDB(
      `https://api.themoviedb.org/3/${mediaType}/${id}/keywords`
    );

    console.log("💾 TMDB complete fetch :", {
      movieData,
      credits,
      videos,
      keywords,
    });

    res.status(200).json({ ...movieData, ...credits, videos, keywords });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

/* -------------------------------------------
   2️⃣  FETCH PACK COMPLET (autre format)
-------------------------------------------- */
const fetchTmdbData = async (req, res) => {
  const { idTheMovieDb } = req.params;
  const [mediaType, movieId] = idTheMovieDb.split("/");

  try {
    const movieData = await fetchTMDB(
      `https://api.themoviedb.org/3/${mediaType}/${movieId}?language=fr-FR`
    );
    const credits = await fetchTMDB(
      `https://api.themoviedb.org/3/${mediaType}/${movieId}/credits?language=fr-FR`
    );
    const videos = await fetchTMDB(
      `https://api.themoviedb.org/3/${mediaType}/${movieId}/videos?language=fr-FR`
    );
    const keywords = await fetchTMDB(
      `https://api.themoviedb.org/3/${mediaType}/${movieId}/keywords`
    );

    console.log("🔹 TMDB pack fetched.");

    res.status(200).json({
      mediaType,
      movieId,
      moviefetchData: movieData,
      crewData: credits.crew || [],
      castData: credits.cast || [],
      videosData: videos.results || [],
      keywordsData: keywords.keywords || [],
    });
  } catch (err) {
    console.error("Erreur TMDB :", err.message);
    res.status(500).json({ error: "Impossible de récupérer les données TMDB" });
  }
};

/* -------------------------------------------
   3️⃣ TRAILER
-------------------------------------------- */
const fetchTrailerFromTMDB = async (req, res) => {
  const { mediaType, movieId } = req.params;

  const tmdbUrl = `https://api.themoviedb.org/3/${mediaType}/${movieId}/videos?language=fr-FR`;
  console.log("🌐 Appel TMDB trailer à l'URL :", tmdbUrl);

  try {
    const data = await fetchTMDB(tmdbUrl);

    const trailerData = data.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    res.status(200).json({ trailer: trailerData || null });
  } catch (err) {
    console.error("Erreur TMDB trailer :", err.message);
    res.status(500).json({ error: "Impossible de récupérer le trailer TMDB" });
  }
};

/* -------------------------------------------
   4️⃣ COVER
-------------------------------------------- */
const fetchCoverFromTMDB = async (req, res) => {
  const { mediaType, movieId } = req.params;

  const tmdbUrl = `https://api.themoviedb.org/3/${mediaType}/${movieId}?language=fr-FR`;
  console.log("🌐 Appel TMDB cover :", tmdbUrl);

  try {
    const data = await fetchTMDB(tmdbUrl);
    res.status(200).json({ poster_path: data.poster_path || null });
  } catch (err) {
    console.error("Erreur TMDB cover :", err.message);
    res.status(500).json({ poster_path: null });
  }
};

/* -------------------------------------------
   5️⃣ NEW — KEYWORDS (pour refetchTags FRONT)
-------------------------------------------- */

// const fetchKeywordsFromTMDB = async (req, res) => {
//   const { mediaType, movieId } = req.params;

//   const tmdbUrl = `https://api.themoviedb.org/3/${mediaType}/${movieId}/keywords`;
//   console.log("🌐 Appel TMDB keywords :", tmdbUrl);

//   try {
//     // Appel direct à TMDB
//     const response = await fetch(tmdbUrl, {
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${process.env.VITE_APP_TMDB_AUTH_TOKEN}`,
//       },
//     });

//     console.log("📡 Status TMDB =", response.status);
//     console.log("📡 Headers TMDB =", Object.fromEntries(response.headers));

//     // Lire le texte brut pour debug avant JSON
//     const rawText = await response.text();
//     console.log("📡 RAW BODY TMDB =", rawText);

//     let data;
//     try {
//       data = JSON.parse(rawText);
//     } catch (jsonErr) {
//       console.error("💥 Erreur parsing JSON TMDB :", jsonErr.message);
//       return res.status(500).json({ keywordsData: [] });
//     }

//     // Récupération des keywords selon le type (movie / tv)
//     const keywords = Array.isArray(data.keywords)
//       ? data.keywords
//       : Array.isArray(data.results)
//         ? data.results
//         : [];

//     console.log("🏷️ Keywords extraits :", keywords);

//     res.status(200).json({ keywordsData: keywords });
//   } catch (err) {
//     console.error("💥 Erreur TMDB keywords :", err.message);
//     res.status(500).json({ keywordsData: [] });
//   }
// };

const fetchKeywordsFromTMDB = async (req, res) => {
  const { mediaType, movieId } = req.params;

  const tmdbUrl = `https://api.themoviedb.org/3/${mediaType}/${movieId}/keywords`;
  console.log("🌐 Appel TMDB keywords :", tmdbUrl);

  try {
    // Appel direct à TMDB
    const response = await fetch(tmdbUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.VITE_APP_TMDB_AUTH_TOKEN}`,
      },
    });

    console.log("📡 Status TMDB =", response.status);
    console.log("📡 Headers TMDB =", Object.fromEntries(response.headers));

    // Lire le texte brut pour debug avant JSON
    const rawText = await response.text();
    console.log("📡 RAW BODY TMDB =", rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (jsonErr) {
      console.error("💥 Erreur parsing JSON TMDB :", jsonErr.message);
      return res.status(500).json({ keywordsData: [] });
    }

    // Récupération des keywords selon le type (movie / tv)
    let keywords = [];
    if (Array.isArray(data.keywords)) {
      keywords = data.keywords;
    } else if (Array.isArray(data.results)) {
      keywords = data.results;
    }

    console.log("🏷️ Keywords extraits :", keywords);

    res.status(200).json({ keywordsData: keywords });
  } catch (err) {
    console.error("💥 Erreur TMDB keywords :", err.message);
    res.status(500).json({ keywordsData: [] });
  }
};

/* -------------------------------------------
   5️⃣ TV SEASON (pour fetchSeasonsInfo)
-------------------------------------------- */
const fetchTvSeasons = async (req, res) => {
  const { movieId } = req.params;

  const tmdbUrl = `https://api.themoviedb.org/3/tv/${movieId}?language=fr-FR`;

  try {
    const response = await fetch(tmdbUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.VITE_APP_TMDB_AUTH_TOKEN}`,
      },
    });

    if (!response.ok) throw new Error(`TMDB status ${response.status}`);

    const data = await response.json();
    const seasons = (data.seasons || [])
      .filter((s) => s.season_number > 0)
      .map((s) => ({
        season_number: s.season_number,
        episode_count: s.episode_count,
      }));

    res.status(200).json({ seasons });
  } catch (err) {
    console.error("💥 Erreur fetch TV seasons :", err.message);
    res.status(500).json({ seasons: [] });
  }
};

module.exports = {
  fetchMovieById,
  fetchTmdbData,
  fetchTrailerFromTMDB,
  fetchCoverFromTMDB,
  fetchKeywordsFromTMDB,
  fetchTvSeasons,
};
