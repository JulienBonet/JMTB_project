// -----------------/ MOVIE DATA FETCH IN MovieCard.jsx/----------------- //
import axios from "axios";
import countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";
import { translateCountry } from "./countries";

countries.registerLocale(frLocale);

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
    // setImage,
    // setShowImageButton,
  } = deps;

  const [mediaType, movieId] = idTheMovieDb.split("/");
  console.info("movieData in refetch", movieData);

  try {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/${mediaType}/${movieId}?language=fr-FR`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
      },
    };

    const response = await axios(options);
    const moviefetchData = response.data;
    console.info("responseApiTMDB in refetchMovieTMDB", response);
    console.info("moviefetchData in refetchMovieTMDB", moviefetchData);

    // Variables spécifiques TV
    const isTV = mediaType === "tv";

    // Gestion du titre alternatif sans ternaires imbriqués
    let altTitle = "";
    if (isTV) {
      if (
        moviefetchData.original_name &&
        moviefetchData.original_name !== moviefetchData.name
      ) {
        altTitle = moviefetchData.original_name;
      }
    } else if (
      moviefetchData.original_title &&
      moviefetchData.original_title !== moviefetchData.title
    ) {
      altTitle = moviefetchData.original_title;
    }

    // Mise à jour de l’état du film
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
      });
    }

    // Fetch GENRES
    const fetchGenre = async (genreName) => {
      const genreData = await searchGenreInDatabase(genreName);
      if (genreData) {
        return { id: genreData.id, name: genreData.name };
      }
      const newGenreData = await createGenreInDatabase(genreName);
      return { id: newGenreData.id, name: genreName };
    };

    // Fetch genres and add "adulte" genre if the movie is for adults
    const genresToFetch = moviefetchData.genres.map((genre) => genre.name);
    if (moviefetchData.adult) {
      genresToFetch.push("adulte");
    }

    const genresData = await Promise.all(genresToFetch.map(fetchGenre));
    setSelectedKinds(genresData);

    // Fetch STUDIO
    const fetchStudio = async (studio) => {
      const studioData = await searchStudioInDatabase(studio.name);
      if (studioData) {
        return { id: studioData.id, name: studioData.name };
      }
      const newStudioData = await createStudioInDatabase(studio.name);
      return { id: newStudioData.id, name: studio.name };
    };

    const studiosData = await Promise.all(
      moviefetchData.production_companies.map(fetchStudio)
    );
    setSelectedStudios(studiosData);

    // Fetch COUNTRY
    const fetchCountry = async (country) => {
      const countryNameFr = translateCountry(country.iso_3166_1, country.name);

      const countryData = await searchCountryInDatabase(countryNameFr);
      if (countryData) {
        return { id: countryData.id, name: countryData.name };
      }
      const newCountryData = await createCountryInDatabase(countryNameFr);
      return { id: newCountryData.id, name: countryNameFr };
    };

    const countriesData = await Promise.all(
      moviefetchData.production_countries.map(fetchCountry)
    );
    setSelectedCountries(countriesData);

    // CREDITS FETCH (cast & crew)
    const options2 = {
      method: "GET",
      url: `https://api.themoviedb.org/3/${mediaType}/${movieId}/credits?language=fr-FR`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
      },
    };

    const response2 = await axios(options2);
    const crewData = response2.data.crew;
    const castData = response2.data.cast;

    // Utility function to fetch or create entity in database
    const fetchOrCreateEntity = async (entity, searchFunc, createFunc) => {
      let entityData = await searchFunc(entity.name);
      if (!entityData) {
        entityData = await createFunc(entity.name);
      }
      return { id: entityData.id, name: entity.name };
    };

    // Fetch DIRECTORS
    // ---- DIRECTORS / CREATORS ----
    let directorsData = [];

    if (isTV) {
      // Pour les séries : récupérer les créateurs
      if (moviefetchData.created_by && moviefetchData.created_by.length > 0) {
        directorsData = await Promise.all(
          moviefetchData.created_by.map((creator) =>
            fetchOrCreateEntity(
              { name: creator.name },
              searchDirectorInDatabase,
              createDirectorInDatabase
            )
          )
        );
      }
    } else {
      // Pour les films : récupérer les réalisateurs depuis crewData
      directorsData = await Promise.all(
        crewData
          .filter((crewMember) => crewMember.job === "Director")
          .map((director) =>
            fetchOrCreateEntity(
              director,
              searchDirectorInDatabase,
              createDirectorInDatabase
            )
          )
      );
    }

    setSelectedDirectors(directorsData);

    // Fetch SCREENWRITERS
    const screenwritersData = await Promise.all(
      crewData
        .filter(
          (crewMember) =>
            crewMember.job === "Screenplay" ||
            crewMember.job === "Writer" ||
            crewMember.job === "Author"
        )
        .map((screenwriter) =>
          fetchOrCreateEntity(
            screenwriter,
            searchScreenwriterInDatabase,
            createScreenwriterInDatabase
          )
        )
    );
    setSelectedScreenwriters(screenwritersData);

    // Fetch COMPOSITORS
    const compositorsData = await Promise.all(
      crewData
        .filter(
          (crewMember) =>
            crewMember.job === "Original Music Composer" ||
            crewMember.job === "Music"
        )
        .map((compositor) =>
          fetchOrCreateEntity(
            compositor,
            searchCompositorInDatabase,
            createCompositorInDatabase
          )
        )
    );
    setSelectedMusic(compositorsData);

    // Fetch CASTING
    const castingsData = await Promise.all(
      castData
        .sort((a, b) => a.order - b.order) // trier par ordre croissant
        .slice(0, 5) // ne prendre que les 5 premiers
        .map((casting) =>
          fetchOrCreateEntity(
            casting,
            searchCastingInDatabase,
            createCastingInDatabase
          )
        )
    );
    setSelectedCasting(castingsData);

    // Fetch trailer
    const trailerOptions = {
      method: "GET",
      url: `https://api.themoviedb.org/3/${mediaType}/${movieId}/videos?language=fr-FR`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
      },
    };

    const trailerResponse = await axios(trailerOptions);
    const trailerData = trailerResponse.data.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );
    const videoUrl = trailerData
      ? `https://www.youtube.com/watch?v=${trailerData.key}`
      : "";

    setMovieData((prevMovie) => ({
      ...prevMovie,
      trailer: videoUrl,
    }));

    // Fetch keywords (tags)
    const keywordsOptions = {
      method: "GET",
      url: `https://api.themoviedb.org/3/${mediaType}/${movieId}/keywords`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
      },
    };

    const keywordsResponse = await axios(keywordsOptions);

    // TMDB renvoie `keywords` pour les films, et `results` pour les séries
    const keywordsData =
      mediaType === "tv"
        ? keywordsResponse.data.results
        : keywordsResponse.data.keywords;

    // Fetch or create tags in database
    const tagsData = await Promise.all(
      keywordsData.map((keyword) =>
        fetchOrCreateEntity(
          { name: keyword.name },
          searchTagInDatabase,
          createTagInDatabase
        )
      )
    );
    setSelectedTags(tagsData);
  } catch (error) {
    console.error("Erreur refetchMovieTMDB:", error);
  }
};

// ----- REFETCH INDIVIDUELS ------ //

// -------------------------------------
// FONCTIONS REFETCH UTILITAIRES COMMUNE
// -------------------------------------
const getTmdbData = async (idTheMovieDb) => {
  const [mediaType, movieId] = idTheMovieDb.split("/");

  const [movieResponse, creditsResponse] = await Promise.all([
    axios.get(
      `https://api.themoviedb.org/3/${mediaType}/${movieId}?language=fr-FR`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
        },
      }
    ),
    axios.get(
      `https://api.themoviedb.org/3/${mediaType}/${movieId}/credits?language=fr-FR`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
        },
      }
    ),
  ]);

  return {
    mediaType,
    movieId,
    moviefetchData: movieResponse.data,
    crewData: creditsResponse.data.crew,
    castData: creditsResponse.data.cast,
  };
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
// refetchTitle.js
const refetchTitle = async (idTheMovieDb, { movieData, setMovieData }) => {
  const { moviefetchData } = await getTmdbData(idTheMovieDb);
  const mediaType = moviefetchData.first_air_date ? "tv" : "movie";
  setMovieData({
    ...movieData,
    title: mediaType === "tv" ? moviefetchData.name : moviefetchData.title,
  });
};

// refetchAltTitle.js
const refetchAltTitle = async (idTheMovieDb, { movieData, setMovieData }) => {
  const { moviefetchData } = await getTmdbData(idTheMovieDb);
  const mediaType = moviefetchData.first_air_date ? "tv" : "movie";
  let altTitle = "";
  if (
    mediaType === "tv" &&
    moviefetchData.original_name &&
    moviefetchData.original_name !== moviefetchData.name
  ) {
    altTitle = moviefetchData.original_name;
  } else if (
    mediaType === "movie" &&
    moviefetchData.original_title &&
    moviefetchData.original_title !== moviefetchData.title
  ) {
    altTitle = moviefetchData.original_title;
  }
  setMovieData({ ...movieData, altTitle });
};

// refetchYear.js
const refetchYear = async (idTheMovieDb, { movieData, setMovieData }) => {
  const { moviefetchData } = await getTmdbData(idTheMovieDb);
  const mediaType = moviefetchData.first_air_date ? "tv" : "movie";
  setMovieData({
    ...movieData,
    year:
      (mediaType === "tv"
        ? moviefetchData.first_air_date
        : moviefetchData.release_date
      )?.substring(0, 4) || "",
  });
};

// refetchDuration.js
const refetchDuration = async (idTheMovieDb, { movieData, setMovieData }) => {
  const { moviefetchData } = await getTmdbData(idTheMovieDb);
  const mediaType = moviefetchData.first_air_date ? "tv" : "movie";
  setMovieData({
    ...movieData,
    duration:
      mediaType === "tv"
        ? moviefetchData.episode_run_time?.[0] || 0
        : moviefetchData.runtime || 0,
  });
};

// refetchStory.js
const refetchStory = async (idTheMovieDb, { movieData, setMovieData }) => {
  const { moviefetchData } = await getTmdbData(idTheMovieDb);
  setMovieData({ ...movieData, story: moviefetchData.overview || "" });
};

// ------------------
// FETCH GENRES
// ------------------
const refetchGenres = async (
  idTheMovieDb,
  { searchGenreInDatabase, createGenreInDatabase, setSelectedKinds }
) => {
  const { moviefetchData } = await getTmdbData(idTheMovieDb);

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
  const { moviefetchData } = await getTmdbData(idTheMovieDb);

  const fetchCountry = async (country) => {
    const countryNameFr = translateCountry(country.iso_3166_1, country.name);
    const countryData = await searchCountryInDatabase(countryNameFr);
    if (countryData) return { id: countryData.id, name: countryData.name };
    const newCountryData = await createCountryInDatabase(countryNameFr);
    return { id: newCountryData.id, name: countryNameFr };
  };

  const countriesData = await Promise.all(
    moviefetchData.production_countries.map(fetchCountry)
  );
  setSelectedCountries(countriesData);
  console.info("🌍 Pays rechargés :", countriesData);
};

// ------------------
// FETCH DIRECTORS
// ------------------
const refetchDirectors = async (
  idTheMovieDb,
  { searchDirectorInDatabase, createDirectorInDatabase, setSelectedDirectors }
) => {
  try {
    const { mediaType, moviefetchData, crewData } =
      await getTmdbData(idTheMovieDb);

    const isTV = mediaType === "tv";
    let directorsData = [];

    if (isTV && moviefetchData.created_by?.length > 0) {
      directorsData = await Promise.all(
        moviefetchData.created_by.map((creator) =>
          fetchOrCreateEntity(
            creator,
            searchDirectorInDatabase,
            createDirectorInDatabase
          )
        )
      );
    } else {
      directorsData = await Promise.all(
        crewData
          .filter((crewMember) => crewMember.job === "Director")
          .map((director) =>
            fetchOrCreateEntity(
              director,
              searchDirectorInDatabase,
              createDirectorInDatabase
            )
          )
      );
    }

    setSelectedDirectors(directorsData);
    console.info("🎬 Réalisateurs rechargés :", directorsData);
  } catch (error) {
    console.error("Erreur lors du refetch des réalisateurs :", error);
  }
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
  const { crewData } = await getTmdbData(idTheMovieDb);

  const screenwritersData = await Promise.all(
    crewData
      .filter(
        (crewMember) =>
          crewMember.job === "Screenplay" ||
          crewMember.job === "Writer" ||
          crewMember.job === "Author"
      )
      .map((screenwriter) =>
        fetchOrCreateEntity(
          screenwriter,
          searchScreenwriterInDatabase,
          createScreenwriterInDatabase
        )
      )
  );

  setSelectedScreenwriters(screenwritersData);
  console.info("🖋️ Scénaristes rechargés :", screenwritersData);
};

// ------------------
// FETCH COMPOSITORS
// ------------------
const refetchCompositors = async (
  idTheMovieDb,
  { searchCompositorInDatabase, createCompositorInDatabase, setSelectedMusic }
) => {
  const { crewData } = await getTmdbData(idTheMovieDb);

  const compositorsData = await Promise.all(
    crewData
      .filter(
        (crewMember) =>
          crewMember.job === "Original Music Composer" ||
          crewMember.job === "Music"
      )
      .map((compositor) =>
        fetchOrCreateEntity(
          compositor,
          searchCompositorInDatabase,
          createCompositorInDatabase
        )
      )
  );

  setSelectedMusic(compositorsData);
  console.info("🎶 Compositeurs rechargés :", compositorsData);
};

// ------------------
// FETCH STUDIO
// ------------------
const refetchStudios = async (
  idTheMovieDb,
  { searchStudioInDatabase, createStudioInDatabase, setSelectedStudios }
) => {
  const { moviefetchData } = await getTmdbData(idTheMovieDb);

  const studiosData = await Promise.all(
    moviefetchData.production_companies.map((studio) =>
      fetchOrCreateEntity(
        studio,
        searchStudioInDatabase,
        createStudioInDatabase
      )
    )
  );

  setSelectedStudios(studiosData);
  console.info("🏭 Studios rechargés :", studiosData);
};

// ------------------
// FETCH CASTING
// ------------------
const refetchCasting = async (
  idTheMovieDb,
  { searchCastingInDatabase, createCastingInDatabase, setSelectedCasting }
) => {
  const { castData } = await getTmdbData(idTheMovieDb);

  const castingsData = await Promise.all(
    castData
      .sort((a, b) => a.order - b.order)
      .slice(0, 5)
      .map((casting) =>
        fetchOrCreateEntity(
          casting,
          searchCastingInDatabase,
          createCastingInDatabase
        )
      )
  );

  setSelectedCasting(castingsData);
  console.info("🎭 Casting rechargé :", castingsData);
};

// ------------------
// FETCH TAGS
// ------------------
const refetchTags = async (
  idTheMovieDb,
  { searchTagInDatabase, createTagInDatabase, setSelectedTags }
) => {
  const [mediaType, movieId] = idTheMovieDb.split("/");

  const keywordsResponse = await axios.get(
    `https://api.themoviedb.org/3/${mediaType}/${movieId}/keywords`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
      },
    }
  );

  const keywordsData =
    mediaType === "tv"
      ? keywordsResponse.data.results
      : keywordsResponse.data.keywords;

  const tagsData = await Promise.all(
    keywordsData.map((keyword) =>
      fetchOrCreateEntity(keyword, searchTagInDatabase, createTagInDatabase)
    )
  );

  setSelectedTags(tagsData);
  console.info("🏷️ Tags rechargés :", tagsData);
};

// ------------------
// FETCH TRAILER
// ------------------

const refetchTrailer = async (
  idTheMovieDb,
  { setMovieData, setTrailerMessage }
) => {
  try {
    const [mediaType, movieId] = idTheMovieDb.split("/");

    const response = await axios.get(
      `https://api.themoviedb.org/3/${mediaType}/${movieId}/videos?language=fr-FR`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
        },
      }
    );

    const trailerData = response.data.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    if (!trailerData) {
      setTrailerMessage("⚠️ Aucun trailer disponible sur TMDB");
      setMovieData((prev) => ({ ...prev, trailer: null }));
      return;
    }

    const videoUrl = `https://www.youtube.com/watch?v=${trailerData.key}`;
    setMovieData((prev) => ({ ...prev, trailer: videoUrl }));
    setTrailerMessage("Trailer rechargé !");
  } catch (error) {
    console.error("Erreur lors du refetch du trailer :", error);
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
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  try {
    // fetch poster_path depuis TMDB
    const response = await axios.get(
      `https://api.themoviedb.org/3/${mediaType}/${movieIdTMDB}?language=fr-FR`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
        },
      }
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

    setImage(`${backendUrl}/images/${data.movie.cover}`);
    setShowImageButton(false);
    console.info("✅ Image mise à jour :", data.movie.cover);
  } catch (error) {
    console.error("Erreur lors de la récupération de la cover TMDB :", error);
  }
};

export {
  refetchMovieTMDB,
  refetchTitle,
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
