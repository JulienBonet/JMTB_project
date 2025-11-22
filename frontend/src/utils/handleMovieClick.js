// -----------------/ MOVIE DATA FETCH IN addNewMovie.jsx/----------------- //
import axios from "axios";
import countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";
import { translateCountry } from "./countries";
import { translateLanguage } from "./languages";

countries.registerLocale(frLocale);

const handleMovieClick = async (movieId, mediaType, deps, backendUrl) => {
  const url = `${backendUrl || import.meta.env.VITE_BACKEND_URL}/api/tmdb/${mediaType}/${movieId}/details`;

  const {
    resetStates,
    setSeasonsInfo,
    setMovie,
    movie,
    tvSeasons,
    searchGenreInDatabase,
    createGenreInDatabase,
    setSelectedKinds,
    searchStudioInDatabase,
    createStudioInDatabase,
    setSelectedStudios,
    searchCountryInDatabase,
    createCountryInDatabase,
    setSelectedCountries,
    searchLanguageInDatabase,
    createLanguageInDatabase,
    setSelectedLanguages,
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
    setCoverPreview,
  } = deps;

  await resetStates(undefined, false);

  try {
    const response = await axios.get(url);

    const {
      movieData = {},
      credits = { cast: [], crew: [] },
      videos = [],
      keywords = [],
    } = response.data;

    const isTV = mediaType === "tv";

    const nbTvSeasons = isTV ? movieData.number_of_seasons || 0 : null;
    const nbTvEpisodes = isTV ? movieData.number_of_episodes || 0 : null;
    const episodeDuration =
      isTV &&
      Array.isArray(movieData.episode_run_time) &&
      movieData.episode_run_time.length > 0
        ? movieData.episode_run_time[0]
        : null;

    const seasonsInfo =
      isTV && Array.isArray(movieData.seasons)
        ? movieData.seasons.map((s) => ({
            season_number: s.season_number,
            episode_count: s.episode_count,
          }))
        : [];
    setSeasonsInfo(seasonsInfo);

    let altTitle = "";

    if (
      isTV &&
      movieData.original_name &&
      movieData.original_name !== movieData.name
    ) {
      altTitle = movieData.original_name;
    } else if (
      !isTV &&
      movieData.original_title &&
      movieData.original_title !== movieData.title
    ) {
      altTitle = movieData.original_title;
    }

    setMovie({
      ...movie,
      title: isTV ? movieData.name || "" : movieData.title || "",
      altTitle,
      year:
        (isTV ? movieData.first_air_date : movieData.release_date)?.substring(
          0,
          4
        ) || "",
      pitch: movieData.tagline || "",
      story: movieData.overview || "",
      idTheMovieDb: `${mediaType}/${movieData.id || movieId}`,
      idIMDB: isTV ? null : movieData.imdb_id || null,
      isTvShow: isTV,
      duration: movieData.runtime || 0,
      nbTvSeasons,
      tvSeasons,
      nbTvEpisodes,
      episodeDuration,
    });

    // Utility to fetch or create entity in DB
    const fetchOrCreateEntity = async (entityName, searchFunc, createFunc) => {
      let data = await searchFunc(entityName);
      if (!data) data = await createFunc(entityName);
      return { id: data.id, name: entityName };
    };

    // -------------------
    // GENRES
    const genreNames = Array.isArray(movieData.genres)
      ? movieData.genres.map((g) => g.name)
      : [];
    if (movieData.adult) genreNames.push("adulte");
    const genresData = await Promise.all(
      genreNames.map((name) =>
        fetchOrCreateEntity(name, searchGenreInDatabase, createGenreInDatabase)
      )
    );
    setSelectedKinds(genresData);

    // -------------------
    // STUDIOS
    const studiosData = await Promise.all(
      (movieData.production_companies || []).map((s) =>
        fetchOrCreateEntity(
          s.name,
          searchStudioInDatabase,
          createStudioInDatabase
        )
      )
    );
    setSelectedStudios(studiosData);

    // -------------------
    // COUNTRIES
    // -------------------

    // const countriesData = await Promise.all(
    //   (movieData.production_countries || []).map((c) =>
    //     fetchOrCreateEntity(
    //       c.name,
    //       searchCountryInDatabase,
    //       createCountryInDatabase
    //     )
    //   )
    // );
    // setSelectedCountries(countriesData);

    const fetchCountry = async (country) => {
      const countryNameFr = translateCountry(country.iso_3166_1, country.name);
      let data = await searchCountryInDatabase(countryNameFr);
      if (!data) data = await createCountryInDatabase(countryNameFr);
      return { id: data.id, name: countryNameFr };
    };

    const countriesData = await Promise.all(
      (movieData.production_countries || []).map(fetchCountry)
    );
    setSelectedCountries(countriesData);

    // -------------------
    // LANGUAGES

    // const languagesData = await Promise.all(
    //   (movieData.spoken_languages || []).map((l) =>
    //     fetchOrCreateEntity(
    //       l.name,
    //       searchLanguageInDatabase,
    //       createLanguageInDatabase
    //     )
    //   )
    // );
    // setSelectedLanguages(languagesData);

    const fetchLanguage = async (language) => {
      const languageNameFr = translateLanguage(
        language.iso_639_1,
        language.name
      );
      let data = await searchLanguageInDatabase(languageNameFr);
      if (!data) data = await createLanguageInDatabase(languageNameFr);
      return { id: data.id, name: languageNameFr };
    };

    const languagesData = await Promise.all(
      (movieData.spoken_languages || []).map(fetchLanguage)
    );
    setSelectedLanguages(languagesData);

    // -------------------
    // DIRECTORS
    let directors = [];
    if (isTV) {
      directors = Array.isArray(movieData.created_by)
        ? movieData.created_by.map((c) => ({ name: c.name }))
        : [];
    } else {
      directors = (credits.crew || [])
        .filter((c) => c.job === "Director")
        .map((d) => ({ name: d.name }));
    }
    const directorsData = await Promise.all(
      directors.map((d) =>
        fetchOrCreateEntity(
          d.name,
          searchDirectorInDatabase,
          createDirectorInDatabase
        )
      )
    );
    setSelectedDirectors(directorsData);

    // -------------------
    // SCREENWRITERS
    const screenwriters = (credits.crew || []).filter((c) =>
      ["Screenplay", "Writer", "Author"].includes(c.job)
    );
    const screenwritersData = await Promise.all(
      screenwriters.map((s) =>
        fetchOrCreateEntity(
          s.name,
          searchScreenwriterInDatabase,
          createScreenwriterInDatabase
        )
      )
    );
    setSelectedScreenwriters(screenwritersData);

    // -------------------
    // COMPOSITORS
    const compositors = (credits.crew || []).filter((c) =>
      ["Original Music Composer", "Music"].includes(c.job)
    );
    const compositorsData = await Promise.all(
      compositors.map((m) =>
        fetchOrCreateEntity(
          m.name,
          searchCompositorInDatabase,
          createCompositorInDatabase
        )
      )
    );
    setSelectedMusic(compositorsData);

    // -------------------
    // CASTING
    const castings = Array.isArray(credits.cast)
      ? credits.cast.slice(0, 5)
      : [];
    const castingsData = await Promise.all(
      castings.map((c) =>
        fetchOrCreateEntity(
          c.name,
          searchCastingInDatabase,
          createCastingInDatabase
        )
      )
    );
    setSelectedCasting(castingsData);

    // -------------------
    // TRAILER
    const trailer = Array.isArray(videos)
      ? videos.find((v) => v.type === "Trailer" && v.site === "YouTube")
      : null;
    setMovie((prev) => ({
      ...prev,
      trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "",
    }));

    // -------------------
    // TAGS / KEYWORDS
    const tagsData = await Promise.all(
      (keywords || []).map((k) =>
        fetchOrCreateEntity(k.name, searchTagInDatabase, createTagInDatabase)
      )
    );
    setSelectedTags(tagsData);

    // -------------------
    // POSTER
    const posterUrl = movieData.poster_path
      ? `https://image.tmdb.org/t/p/original${movieData.poster_path}`
      : null;
    setCoverPreview(posterUrl);
    setMovie((prev) => ({ ...prev, posterUrl }));
  } catch (err) {
    console.error("Error in handleMovieClick:", err);
  }
};

export default handleMovieClick;
