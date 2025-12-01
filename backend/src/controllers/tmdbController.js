/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const fetch = require("node-fetch");

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
   1 FETCH COMPLET MOVIE / CREDITS / VIDEOS / KEYWORDS
-------------------------------------------- */
const fetchMovieById = async (req, res, next) => {
  const { mediaType, id } = req.params;

  try {
    const [movieData, credits, videos, keywords] = await Promise.all([
      fetchTMDB(
        `https://api.themoviedb.org/3/${mediaType}/${id}?language=fr-FR`
      ),
      fetchTMDB(
        `https://api.themoviedb.org/3/${mediaType}/${id}/credits?language=fr-FR`
      ),
      fetchTMDB(
        `https://api.themoviedb.org/3/${mediaType}/${id}/videos?language=fr-FR`
      ),
      fetchTMDB(`https://api.themoviedb.org/3/${mediaType}/${id}/keywords`),
    ]);

    // Logs dev uniquement
    if (process.env.NODE_ENV !== "production") {
      console.info(`🌐 TMDB fetch success: ${mediaType} ${id}`);
    }

    res.status(200).json({ ...movieData, ...credits, videos, keywords });
  } catch (err) {
    console.error(`🔥 TMDB fetchMovieById error: ${err.message}`);
    next(err);
  }
};

/* -------------------------------------------
   2 FETCH PACK COMPLET (autre format)
-------------------------------------------- */
const fetchTmdbData = async (req, res) => {
  const { idTheMovieDb } = req.params;
  const [mediaType, movieId] = idTheMovieDb.split("/");

  try {
    const [movieData, credits, videos, keywords] = await Promise.all([
      fetchTMDB(
        `https://api.themoviedb.org/3/${mediaType}/${movieId}?language=fr-FR`
      ),
      fetchTMDB(
        `https://api.themoviedb.org/3/${mediaType}/${movieId}/credits?language=fr-FR`
      ),
      fetchTMDB(
        `https://api.themoviedb.org/3/${mediaType}/${movieId}/videos?language=fr-FR`
      ),
      fetchTMDB(
        `https://api.themoviedb.org/3/${mediaType}/${movieId}/keywords`
      ),
    ]);

    res.status(200).json({
      mediaType,
      movieId,
      moviefetchData: movieData,
      crewData: credits.crew || [],
      castData: credits.cast || [],
      videosData: videos.results || [],
      keywordsData: keywords.results || keywords.keywords || [],
    });
  } catch (err) {
    console.error(`🔥 TMDB fetchTmdbData error: ${err.message}`);
    res.status(500).json({
      mediaType,
      movieId,
      moviefetchData: {},
      crewData: [],
      castData: [],
      videosData: [],
      keywordsData: [],
    });
  }
};

/* -------------------------------------------
   3 TRAILER
-------------------------------------------- */
const fetchTrailerFromTMDB = async (req, res) => {
  const { mediaType, movieId } = req.params;

  const tmdbUrl = `https://api.themoviedb.org/3/${mediaType}/${movieId}/videos?language=fr-FR`;

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
   4 COVER
-------------------------------------------- */
const fetchCoverFromTMDB = async (req, res) => {
  const { mediaType, movieId } = req.params;

  const tmdbUrl = `https://api.themoviedb.org/3/${mediaType}/${movieId}?language=fr-FR`;

  try {
    const data = await fetchTMDB(tmdbUrl);
    res.status(200).json({ poster_path: data.poster_path || null });
  } catch (err) {
    console.error("Erreur TMDB cover :", err.message);
    res.status(500).json({ poster_path: null });
  }
};

/* -------------------------------------------
   5 NEW — KEYWORDS (pour refetchTags FRONT)
-------------------------------------------- */

// const fetchKeywordsFromTMDB = async (req, res) => {

const fetchKeywordsFromTMDB = async (req, res) => {
  const { mediaType, movieId } = req.params;

  const tmdbUrl = `https://api.themoviedb.org/3/${mediaType}/${movieId}/keywords`;

  try {
    // Appel direct à TMDB
    const response = await fetch(tmdbUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.VITE_APP_TMDB_AUTH_TOKEN}`,
      },
    });

    // Lire le texte brut pour debug avant JSON
    const rawText = await response.text();

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

    res.status(200).json({ keywordsData: keywords });
  } catch (err) {
    console.error("💥 Erreur TMDB keywords :", err.message);
    res.status(500).json({ keywordsData: [] });
  }
};

/* -------------------------------------------
  6 TV SEASON (pour fetchSeasonsInfo)
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

/* -------------------------------------------
   7 SEARCH MOVIE + TV + GENRES (backend)
-------------------------------------------- */
const searchTMDB = async (req, res) => {
  const { query, include_adult = false, page = 1 } = req.query;

  try {
    const [movieRes, tvRes, genresMovie, genresTV] = await Promise.all([
      fetchTMDB(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=${include_adult}&language=fr-FR&page=${page}`
      ),
      fetchTMDB(
        `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&include_adult=${include_adult}&language=fr-FR&page=${page}`
      ),
      fetchTMDB(`https://api.themoviedb.org/3/genre/movie/list?language=fr-FR`),
      fetchTMDB(`https://api.themoviedb.org/3/genre/tv/list?language=fr-FR`),
    ]);

    res.json({ movieRes, tvRes, genresMovie, genresTV });
  } catch (err) {
    console.error(`🔥 TMDB searchTMDB error: ${err.message}`);
    res.status(500).json({
      movieRes: { results: [], total_results: 0, total_pages: 0 },
      tvRes: { results: [], total_results: 0, total_pages: 0 },
      genresMovie: { genres: [] },
      genresTV: { genres: [] },
    });
  }
};
/* -------------------------------------------
  7 SEARCH MOVIE + TV DETAILS (backend)
-------------------------------------------- */
const fetchMovieDetails = async (req, res) => {
  const { mediaType, movieId } = req.params;

  try {
    const [movieData, credits, videos, keywords] = await Promise.all([
      fetchTMDB(
        `https://api.themoviedb.org/3/${mediaType}/${movieId}?language=fr-FR`
      ),
      fetchTMDB(
        `https://api.themoviedb.org/3/${mediaType}/${movieId}/credits?language=fr-FR`
      ),
      fetchTMDB(
        `https://api.themoviedb.org/3/${mediaType}/${movieId}/videos?language=fr-FR`
      ),
      fetchTMDB(
        `https://api.themoviedb.org/3/${mediaType}/${movieId}/keywords`
      ),
    ]);

    res.status(200).json({
      movieData: movieData || {},
      credits: credits || { cast: [], crew: [] },
      videos: videos?.results || [],
      keywords: Array.isArray(keywords?.results)
        ? keywords.results
        : keywords?.keywords || [],
    });
  } catch (err) {
    console.error(`🔥 TMDB fetchMovieDetails error: ${err.message}`);
    res.status(500).json({
      movieData: null,
      credits: null,
      videos: [],
      keywords: [],
    });
  }
};

module.exports = {
  fetchMovieById,
  fetchTmdbData,
  fetchTrailerFromTMDB,
  fetchCoverFromTMDB,
  fetchKeywordsFromTMDB,
  fetchTvSeasons,
  searchTMDB,
  fetchMovieDetails,
};
