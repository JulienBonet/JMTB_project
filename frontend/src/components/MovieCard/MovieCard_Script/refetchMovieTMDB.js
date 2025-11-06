import { useState } from "react";
import axios from "axios";

/**
 * Hook pour récupérer un film depuis TMDB et le transformer
 */
export default function useFetchTMDBMovie() {
  const [movieRefreshData, setMovieRefreshData] = useState(null);

  async function refetchMovieTMDB(idTheMovieDb) {
    const [mediaType, movieId] = idTheMovieDb.split("/");

    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
    };

    const tmdbMovieDetailsUrl = `https://api.themoviedb.org/3/${mediaType}/${movieId}`;
    const tmdbMovieCreditsUrl = `https://api.themoviedb.org/3/${mediaType}/${movieId}/credits`;
    const tmdbMovieKeywordsUrl = `https://api.themoviedb.org/3/${mediaType}/${movieId}/keywords`;

    try {
      // on fait les trois appels en parallèle
      const [detailsRes, creditsRes, keywordsRes] = await Promise.all([
        axios.get(tmdbMovieDetailsUrl, {
          headers,
          params: { language: "fr-FR" },
        }),
        axios.get(tmdbMovieCreditsUrl, {
          headers,
          params: { language: "fr-FR" },
        }),
        axios.get(tmdbMovieKeywordsUrl, { headers }),
      ]);

      const details = detailsRes.data;
      const credits = creditsRes.data;
      const keywords = keywordsRes.data.keywords.map((k) => k.name);

      // filtrage cast et crew
      const cast = credits.cast?.slice(0, 5).map((a) => a.name) || [];
      const crew = credits.crew || [];
      const directors = crew
        .filter((c) => c.job === "Director")
        .map((d) => d.name);
      const writers = crew.filter((c) => c.job === "Writer").map((w) => w.name);
      const musicians = crew
        .filter((c) => c.job === "Musician")
        .map((m) => m.name);

      // construction de l'objet final
      const transformed = {
        adult: details.adult,
        genres: details.genres?.map((g) => g.name) || [],
        origin_country: details.origin_country,
        original_title: details.original_title,
        title: details.title,
        poster_path: details.poster_path,
        release_year: details.release_date
          ? details.release_date.slice(0, 4)
          : "",
        runtime: details.runtime,
        production_companies:
          details.production_companies?.map((p) => p.name) || [],
        cast,
        directors,
        writers,
        musicians,
        keywords,
      };

      // mise à jour du state du hook
      setMovieRefreshData(transformed);

      console.info("🎬 Données filtrées TMDB :", transformed);
      return transformed;
    } catch (err) {
      console.error("Erreur TMDB :", err.response?.data || err);
      throw err;
    }
  }

  return { movieRefreshData, refetchMovieTMDB };
}
