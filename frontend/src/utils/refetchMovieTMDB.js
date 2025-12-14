/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-syntax */
// -----------------/ MOVIE DATA FETCH IN MovieCard.jsx/----------------- //
import axios from "axios";
import countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";
import { translateCountry } from "./countries";

countries.registerLocale(frLocale);
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

const getImageUrl = (publicId) => {
  if (!publicId) return "00_cover_default.jpg";
  return `${CLOUDINARY_BASE_URL}/${publicId}`;
};

// -----------------------------------------------------------
// Fonction qui récupère les données du film depuis le backend
// -----------------------------------------------------------

const fetchMovieViaBackend = async (mediaType, id) => {
  try {
    const url = `${backendUrl}/api/tmdb/${mediaType}/${id}`;
    console.log("🌐 Appel backend TMDB à l'adresse :", url);

    const res = await axios.get(url);

    console.log(
      "🎬 Données reçues du backend :",
      res.data.title || res.data.name
    );

    // Normalisation des données
    const genres = Array.isArray(res.data.genres) ? res.data.genres : [];
    const cast = Array.isArray(res.data.cast) ? res.data.cast : [];
    const crew = Array.isArray(res.data.crew) ? res.data.crew : [];
    const videos = res.data.videos?.results || [];
    const keywords = Array.isArray(res.data.keywords) ? res.data.keywords : [];

    return { ...res.data, genres, cast, crew, videos, keywords };
  } catch (err) {
    console.error("❌ Erreur fetch via backend :", err);
    return null;
  }
};

const refetchMovieTMDB = async (idTheMovieDb, deps) => {
  const {
    movieData,
    setMovieData,
    searchGenreInDatabase,
    createGenreInDatabase,
    setSelectedKinds,
    searchStudioInDatabase,
    createStudioInDatabase,
    setSelectedStudios,
    searchCountryInDatabase,
    createCountryInDatabase,
    setSelectedCountries,
    searchDirectorInDatabase,
    createDirectorInDatabase,
    setSelectedDirectors,
    searchScreenwriterInDatabase,
    createScreenwriterInDatabase,
    setSelectedScreenwriters,
    searchCompositorInDatabase,
    createCompositorInDatabase,
    setSelectedMusic,
    searchCastingInDatabase,
    createCastingInDatabase,
    setSelectedCasting,
    searchTagInDatabase,
    createTagInDatabase,
    setSelectedTags,
  } = deps;

  const [mediaType, movieId] = idTheMovieDb.split("/");

  const moviefetchData = await fetchMovieViaBackend(mediaType, movieId);
  if (!moviefetchData) return;

  const isTV = mediaType === "tv";

  // Titre alternatif
  let altTitle = "";
  if (
    isTV &&
    moviefetchData.original_name &&
    moviefetchData.original_name !== moviefetchData.name
  ) {
    altTitle = moviefetchData.original_name;
  } else if (
    !isTV &&
    moviefetchData.original_title &&
    moviefetchData.original_title !== moviefetchData.title
  ) {
    altTitle = moviefetchData.original_title;
  }

  if (typeof setMovieData === "function") {
    setMovieData({
      ...movieData,
      title: isTV ? moviefetchData.name : moviefetchData.title,
      altTitle,
      year:
        (isTV
          ? moviefetchData.first_air_date
          : moviefetchData.release_date
        )?.substring(0, 4) || "",
      pitch: moviefetchData.tagline || "",
      story: moviefetchData.overview || "",
      idTheMovieDb: `${mediaType}/${moviefetchData.id}`,
      idIMDB: isTV ? null : moviefetchData.imdb_id,
      isTvShow: isTV ? 1 : 0,
      cast: moviefetchData.cast,
      crew: moviefetchData.crew,
      videos: moviefetchData.videos,
      keywords: moviefetchData.keywords,
    });
  }

  // -----------------/ GENRES /-----------------
  const fetchGenre = async (genreName) => {
    const genreData = await searchGenreInDatabase(genreName);
    if (genreData) return { id: genreData.id, name: genreData.name };
    const newGenreData = await createGenreInDatabase(genreName);
    return { id: newGenreData.id, name: genreName };
  };

  const genresToFetch = moviefetchData.genres.map((g) => g.name);
  if (moviefetchData.adult) genresToFetch.push("adulte");
  const genresData = await Promise.all(genresToFetch.map(fetchGenre));
  setSelectedKinds(genresData);

  // -----------------/ STUDIOS /-----------------
  const fetchStudio = async (studio) => {
    const studioData = await searchStudioInDatabase(studio.name);
    if (studioData) return { id: studioData.id, name: studioData.name };
    const newStudioData = await createStudioInDatabase(studio.name);
    return { id: newStudioData.id, name: studio.name };
  };
  const studiosData = await Promise.all(
    (moviefetchData.production_companies || []).map(fetchStudio)
  );
  setSelectedStudios(studiosData);

  // -----------------/ COUNTRIES /-----------------
  const fetchCountry = async (country) => {
    const countryNameFr = translateCountry(country.iso_3166_1, country.name);
    const countryData = await searchCountryInDatabase(countryNameFr);
    if (countryData) return { id: countryData.id, name: countryData.name };
    const newCountryData = await createCountryInDatabase(countryNameFr);
    return { id: newCountryData.id, name: countryNameFr };
  };
  const countriesData = await Promise.all(
    (moviefetchData.production_countries || []).map(fetchCountry)
  );
  setSelectedCountries(countriesData);

  // -----------------/ CREDITS /-----------------
  const fetchOrCreateEntity = async (entity, searchFunc, createFunc) => {
    let entityData = await searchFunc(entity.name);
    if (!entityData) entityData = await createFunc(entity.name);
    return { id: entityData.id, name: entity.name };
  };

  // DIRECTORS
  let directorsData = [];
  if (isTV && moviefetchData.created_by?.length > 0) {
    directorsData = await Promise.all(
      moviefetchData.created_by.map((creator) =>
        fetchOrCreateEntity(
          { name: creator.name },
          searchDirectorInDatabase,
          createDirectorInDatabase
        )
      )
    );
  } else {
    directorsData = await Promise.all(
      (moviefetchData.crew || [])
        .filter((c) => c.job === "Director")
        .map((d) =>
          fetchOrCreateEntity(
            d,
            searchDirectorInDatabase,
            createDirectorInDatabase
          )
        )
    );
  }
  setSelectedDirectors(directorsData);

  // SCREENWRITERS
  const screenwritersData = await Promise.all(
    (moviefetchData.crew || [])
      .filter((c) => ["Screenplay", "Writer", "Author"].includes(c.job))
      .map((sw) =>
        fetchOrCreateEntity(
          sw,
          searchScreenwriterInDatabase,
          createScreenwriterInDatabase
        )
      )
  );
  setSelectedScreenwriters(screenwritersData);

  // COMPOSITORS
  const compositorsData = await Promise.all(
    (moviefetchData.crew || [])
      .filter((c) => ["Original Music Composer", "Music"].includes(c.job))
      .map((comp) =>
        fetchOrCreateEntity(
          comp,
          searchCompositorInDatabase,
          createCompositorInDatabase
        )
      )
  );
  setSelectedMusic(compositorsData);

  // CASTING
  const castingsData = await Promise.all(
    (moviefetchData.cast || [])
      .sort((a, b) => a.order - b.order)
      .slice(0, 5)
      .map((cast) =>
        fetchOrCreateEntity(
          cast,
          searchCastingInDatabase,
          createCastingInDatabase
        )
      )
  );
  setSelectedCasting(castingsData);

  // -----------------/ TRAILER /-----------------
  const trailerData = moviefetchData.videos.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const videoUrl = trailerData
    ? `https://www.youtube.com/watch?v=${trailerData.key}`
    : "";
  setMovieData((prev) => ({ ...prev, trailer: videoUrl }));

  // -----------------/ TAGS /-----------------
  try {
    const response = await fetch(
      `${backendUrl}/api/tmdb/${mediaType}/${movieId}/keywords`
    );
    const data = await response.json();

    console.log("🏷️ data reçu du backend :", data);

    const keywordsData = Array.isArray(data.keywordsData)
      ? data.keywordsData
      : data.keywordsData?.keywords || [];

    if (!keywordsData.length) {
      setSelectedTags([]);
      console.info("🏷️ Aucun tag trouvé pour ce film");
    } else {
      // Split + nettoyage des tags contenant des virgules
      const cleanedTags = keywordsData
        .flatMap((kw) =>
          kw.name
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        )
        .filter((v, i, a) => a.indexOf(v) === i);

      const tagsData = await Promise.all(
        cleanedTags.map(async (tagName) => {
          const existingTag = await searchTagInDatabase(tagName);
          if (existingTag?.id) return { id: existingTag.id, name: tagName };

          const createdTag = await createTagInDatabase(tagName);
          if (!createdTag?.tagIds?.[0]) {
            const retry = await searchTagInDatabase(tagName);
            if (!retry?.id) return null;
            return { id: retry.id, name: tagName };
          }
          return { id: createdTag.tagIds[0], name: tagName };
        })
      );

      setSelectedTags(tagsData.filter(Boolean));

      console.info(
        `🏷️ Tags rechargés pour ${idTheMovieDb} :`,
        tagsData.filter(Boolean)
      );
    }
  } catch (err) {
    console.error("💥 Erreur refetchTags :", err);
    setSelectedTags([]);
  }
};

// ----- REFETCH INDIVIDUELS ------ //

// -------------------------------------
// FONCTIONS REFETCH UTILITAIRES COMMUNE
// -------------------------------------

const getTmdbData = async (idTheMovieDb) => {
  try {
    const res = await fetch(`${backendUrl}/api/tmdb/${idTheMovieDb}`);
    if (!res.ok) throw new Error("Erreur fetch backend TMDB");

    const data = await res.json();
    console.log("💾 Données TMDB récupérées :", data);
    return data;
  } catch (err) {
    console.error("Erreur fetch TMDB backend :", err);
    return null;
  }
};

const fetchOrCreateEntity = async (entity, searchFunc, createFunc) => {
  if (!entity?.name) {
    console.warn("⚠️ fetchOrCreateEntity appelé sans nom valide :", entity);
    return null;
  }

  const cleanName = entity.name.trim();

  let entityData = await searchFunc(cleanName);

  if (!entityData) {
    const created = await createFunc(cleanName);
    console.info("🆕 Entité créée :", created);

    // Si la création ne renvoie pas d'id, on refait un search
    if (!created?.id) {
      entityData = await searchFunc(cleanName);
    } else {
      entityData = created;
    }
  }

  return { id: entityData.id, name: cleanName };
};

// ------------------
// FETCH infos
// ------------------
// refetchTitle (! XX provoque la creation d'un nouveau film XX !)
// const refetchTitle = async (idTheMovieDb, { movieData, setMovieData }) => {
//   const { moviefetchData } = await getTmdbData(idTheMovieDb);
//   const mediaType = moviefetchData.first_air_date ? "tv" : "movie";
//   setMovieData({
//     ...movieData,
//     title: mediaType === "tv" ? moviefetchData.name : moviefetchData.title,
//   });
// };

// refetchAltTitle
const refetchAltTitle = async (idTheMovieDb, { movieData, setMovieData }) => {
  const data = await getTmdbData(idTheMovieDb);
  if (!data) return;

  const mediaType = data.first_air_date ? "tv" : "movie";
  let altTitle = "";

  if (
    mediaType === "tv" &&
    data.original_name &&
    data.original_name !== data.name
  ) {
    altTitle = data.original_name;
  } else if (
    mediaType === "movie" &&
    data.original_title &&
    data.original_title !== data.title
  ) {
    altTitle = data.original_title;
  }

  setMovieData({ ...movieData, altTitle });
};

// refetchYear
const refetchYear = async (idTheMovieDb, { movieData, setMovieData }) => {
  const data = await getTmdbData(idTheMovieDb);
  if (!data) return;

  const mediaType = data.first_air_date ? "tv" : "movie";
  const year =
    (mediaType === "tv" ? data.first_air_date : data.release_date)?.substring(
      0,
      4
    ) || "";

  setMovieData({ ...movieData, year });
};

// refetchDuration
const refetchDuration = async (idTheMovieDb, { movieData, setMovieData }) => {
  const data = await getTmdbData(idTheMovieDb);
  if (!data) return;

  const mediaType = data.first_air_date ? "tv" : "movie";
  const duration =
    mediaType === "tv" ? data.episode_run_time?.[0] || 0 : data.runtime || 0;

  setMovieData({ ...movieData, duration });
};

// refetchStory
const refetchStory = async (idTheMovieDb, { movieData, setMovieData }) => {
  const data = await getTmdbData(idTheMovieDb);
  setMovieData({ ...movieData, story: data?.overview || "" });
};

// ------------------
// FETCH GENRES
// ------------------

const refetchGenres = async (
  idTheMovieDb,
  { searchGenreInDatabase, createGenreInDatabase, setSelectedKinds }
) => {
  const moviefetchData = await getTmdbData(idTheMovieDb); // ← pas de destructuring

  if (!moviefetchData || !moviefetchData.genres) {
    console.warn("⚠️ Pas de genres dans les données TMDB", moviefetchData);
    setSelectedKinds([]);
    return;
  }

  const fetchGenre = async (genreName) => {
    const genreData = await searchGenreInDatabase(genreName);
    if (genreData) return { id: genreData.id, name: genreData.name };
    const newGenreData = await createGenreInDatabase(genreName);
    return { id: newGenreData.id, name: genreName };
  };

  const genresToFetch = moviefetchData.genres.map((g) => g.name);
  if (moviefetchData.adult) genresToFetch.push("adulte");

  const genresData = await Promise.all(genresToFetch.map(fetchGenre));
  setSelectedKinds(genresData);
  console.info("🎨 Genres rechargés :", genresData);
};

// ------------------
// FETCH COUNTRIES
// ------------------

const refetchCountries = async (
  idTheMovieDb,
  { searchCountryInDatabase, createCountryInDatabase, setSelectedCountries }
) => {
  const data = await getTmdbData(idTheMovieDb);
  if (!data?.production_countries) {
    setSelectedCountries([]);
    return;
  }

  const countriesData = await Promise.all(
    data.production_countries.map(async (country) => {
      const countryNameFr = translateCountry(country.iso_3166_1, country.name);
      const countryData = await searchCountryInDatabase(countryNameFr);
      if (countryData) return { id: countryData.id, name: countryData.name };
      const newCountryData = await createCountryInDatabase(countryNameFr);
      return { id: newCountryData.id, name: countryNameFr };
    })
  );

  setSelectedCountries(countriesData);
};
// ------------------
// FETCH DIRECTORS
// ------------------

const refetchDirectors = async (
  idTheMovieDb,
  { searchDirectorInDatabase, createDirectorInDatabase, setSelectedDirectors }
) => {
  const data = await getTmdbData(idTheMovieDb);
  const directors = (data.crew || []).filter((c) => c.job === "Director");

  const directorsData = await Promise.all(
    directors.map((director) =>
      fetchOrCreateEntity(
        director,
        searchDirectorInDatabase,
        createDirectorInDatabase
      )
    )
  );

  setSelectedDirectors(directorsData);
};

// ------------------
// FETCH SCREENWRITER
// ------------------

const refetchScreenwriters = async (
  idTheMovieDb,
  {
    searchScreenwriterInDatabase,
    createScreenwriterInDatabase,
    setSelectedScreenwriters,
  }
) => {
  const data = await getTmdbData(idTheMovieDb);
  const screenwriters = (data.crew || []).filter((c) =>
    ["Screenplay", "Writer", "Author"].includes(c.job)
  );

  const screenwritersData = await Promise.all(
    screenwriters.map((sw) =>
      fetchOrCreateEntity(
        sw,
        searchScreenwriterInDatabase,
        createScreenwriterInDatabase
      )
    )
  );

  setSelectedScreenwriters(screenwritersData);
};

// ------------------
// FETCH COMPOSITORS
// ------------------

const refetchCompositors = async (
  idTheMovieDb,
  { searchCompositorInDatabase, createCompositorInDatabase, setSelectedMusic }
) => {
  const data = await getTmdbData(idTheMovieDb);
  const compositors = (data.crew || []).filter((c) =>
    ["Original Music Composer", "Music"].includes(c.job)
  );

  const compositorsData = await Promise.all(
    compositors.map((c) =>
      fetchOrCreateEntity(
        c,
        searchCompositorInDatabase,
        createCompositorInDatabase
      )
    )
  );

  setSelectedMusic(compositorsData);
};

// ------------------
// FETCH STUDIO
// ------------------

const refetchStudios = async (
  idTheMovieDb,
  { searchStudioInDatabase, createStudioInDatabase, setSelectedStudios }
) => {
  const data = await getTmdbData(idTheMovieDb);
  if (!data?.production_companies) {
    setSelectedStudios([]);
    return;
  }

  const studiosData = await Promise.all(
    data.production_companies.map((studio) =>
      fetchOrCreateEntity(
        studio,
        searchStudioInDatabase,
        createStudioInDatabase
      )
    )
  );

  setSelectedStudios(studiosData);
};

// ------------------
// FETCH CASTING
// ------------------;

const refetchCasting = async (
  idTheMovieDb,
  { searchCastingInDatabase, createCastingInDatabase, setSelectedCasting }
) => {
  const data = await getTmdbData(idTheMovieDb);
  if (!data?.cast) {
    setSelectedCasting([]);
    return;
  }

  const castingsData = await Promise.all(
    data.cast
      .sort((a, b) => a.order - b.order)
      .slice(0, 5)
      .map((c) =>
        fetchOrCreateEntity(c, searchCastingInDatabase, createCastingInDatabase)
      )
  );

  setSelectedCasting(castingsData);
};

// ------------------
// FETCH TAGS
// ------------------

const refetchTags = async (
  idTheMovieDb,
  { searchTagInDatabase, createTagInDatabase, setSelectedTags }
) => {
  try {
    const [mediaType, movieId] = idTheMovieDb.split("/");

    // 1️⃣ Appel au BACKEND pour récupérer les keywords TMDB
    const response = await fetch(
      `${backendUrl}/api/tmdb/${mediaType}/${movieId}/keywords`
    );
    const data = await response.json();

    // vérifier ce que l'on a vraiment
    console.log("data:", data);

    // le tableau réel
    const keywordsData = Array.isArray(data.keywordsData)
      ? data.keywordsData
      : data.keywordsData.keywords || [];

    if (!keywordsData || keywordsData.length === 0) {
      setSelectedTags([]);
      console.info("🏷️ Aucun tag trouvé pour ce film");
      return;
    }

    // 2️⃣ Split + nettoyage des tags contenant des virgules
    const cleanedTags = keywordsData
      .flatMap((kw) =>
        kw.name
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      )
      .filter((v, i, a) => a.indexOf(v) === i); // supprimer doublons

    // 3️⃣ Créer ou récupérer chaque tag dans ta base de données
    const tagsData = await Promise.all(
      cleanedTags.map(async (tagName) => {
        const existingTag = await searchTagInDatabase(tagName);
        if (existingTag?.id) return { id: existingTag.id, name: tagName };

        const createdTag = await createTagInDatabase(tagName);

        if (!createdTag?.tagIds || !createdTag.tagIds[0]) {
          const retry = await searchTagInDatabase(tagName);
          if (!retry?.id) return null;
          return { id: retry.id, name: tagName };
        }

        return { id: createdTag.tagIds[0], name: tagName };
      })
    );

    // 4️⃣ Nettoyer
    setSelectedTags(tagsData.filter(Boolean));

    console.info(
      `🏷️ Tags rechargés pour ${idTheMovieDb} :`,
      tagsData.filter(Boolean)
    );
  } catch (error) {
    console.error("Erreur refetchTags :", error);
    setSelectedTags([]);
  }
};

const refetchTrailer = async (
  idTheMovieDb,
  { setMovieData, setTrailerMessage }
) => {
  try {
    const [mediaType, movieId] = idTheMovieDb.split("/");

    const res = await fetch(
      `${backendUrl}/api/tmdb/${mediaType}/${movieId}/trailer`
    );

    if (!res.ok) throw new Error("Erreur fetch backend TMDB trailer");

    const { trailer } = await res.json();

    if (!trailer) {
      setTrailerMessage("⚠️ Aucun trailer disponible sur TMDB");
      setMovieData((prev) => ({ ...prev, trailer: null }));
      return;
    }

    const videoUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
    setMovieData((prev) => ({ ...prev, trailer: videoUrl }));
    setTrailerMessage("Trailer rechargé !");
  } catch (error) {
    console.error("Erreur refetchTrailer :", error);
    setTrailerMessage("Erreur lors de la récupération du trailer");
  }
};

// ------------------
// FETCH COVER
// ------------------

const refetchMovieCoverFromTMDB = async (
  idTheMovieDb,
  { movieId, setImage, setShowImageButton }
) => {
  const [mediaType, movieIdTMDB] = idTheMovieDb.split("/");

  try {
    // fetch poster_path depuis TMDB
    const response = await axios.get(
      `${backendUrl}/api/tmdb/${mediaType}/${movieIdTMDB}/cover`
    );

    const moviefetchData = response.data;

    if (!moviefetchData.poster_path) return;

    const posterUrl = `https://image.tmdb.org/t/p/original${moviefetchData.poster_path}`;

    // envoyer au backend avec ID interne
    const backendResponse = await fetch(
      `${backendUrl}/api/movie/${movieId}/image-from-url`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: posterUrl }),
      }
    );

    const data = await backendResponse.json();
    if (!data.movie) {
      console.error("Film non trouvé ou backend ne renvoie pas de movie");
      return;
    }

    setImage(getImageUrl(data.movie.cover));
    setShowImageButton(false);
    console.info("✅ Image mise à jour :", data.movie.cover);
  } catch (error) {
    console.error("Erreur lors de la récupération de la cover TMDB :", error);
  }
};

export {
  refetchMovieTMDB,
  // refetchTitle,
  refetchAltTitle,
  refetchYear,
  refetchDuration,
  refetchStory,
  refetchGenres,
  refetchCountries,
  refetchDirectors,
  refetchScreenwriters,
  refetchCompositors,
  refetchStudios,
  refetchCasting,
  refetchTags,
  refetchTrailer,
  refetchMovieCoverFromTMDB,
};
