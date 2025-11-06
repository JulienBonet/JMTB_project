// -----------------/ MOVIE DATA FETCH IN addNewMovie.jsx/----------------- //
import axios from "axios";

const refetchMovieTMDB = async (idTheMovieDb, deps) => {
  const {
    // setSeasonsInfo,
    // setMovie,
    // movie,
    // tvSeasons,
    // newDataMovie,
    // setNewDataMovie,
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
    // searchLanguageInDatabase,
    // createLanguageInDatabase,
    // setSelectedLanguages,
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
    // setCoverPreview,
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
    // const nbTvSeasons = isTV ? moviefetchData.number_of_seasons : null;
    // const nbTvEpisodes = isTV ? moviefetchData.number_of_episodes : null;
    const episodeDuration =
      isTV && moviefetchData.episode_run_time?.length > 0
        ? moviefetchData.episode_run_time[0]
        : null;

    // Si c'est une série, on récupère la liste des saisons
    // const seasonsInfo = isTV
    //   ? moviefetchData.seasons.map((s) => ({
    //       season_number: s.season_number,
    //       episode_count: s.episode_count,
    //     }))
    //   : [];

    // setSeasonsInfo(seasonsInfo);
    // console.info("seasonsInfo", seasonsInfo);

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
        isTvShow: isTV,
        duration: moviefetchData.runtime,
        // nbTvSeasons,
        // tvSeasons,
        // nbTvEpisodes,
        episodeDuration,
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
      const countryData = await searchCountryInDatabase(country.name);
      if (countryData) {
        return { id: countryData.id, name: countryData.name };
      }
      const newCountryData = await createCountryInDatabase(country.name);
      return { id: newCountryData.id, name: country.name };
    };

    const countriesData = await Promise.all(
      moviefetchData.production_countries.map(fetchCountry)
    );
    setSelectedCountries(countriesData);

    // Fetch LANGUAGE
    // const fetchLanguage = async (language) => {
    //   const languageData = await searchLanguageInDatabase(
    //     language.english_name
    //   );
    //   if (languageData) {
    //     return { id: languageData.id, name: languageData.name };
    //   }
    //   const newLanguageData = await createLanguageInDatabase(
    //     language.english_name
    //   );
    //   return { id: newLanguageData.id, name: language.english_name };
    // };

    // const languagesData = await Promise.all(
    //   moviefetchDataa.spoken_languages.map(fetchLanguage)
    // );
    // setSelectedLanguages(languagesData);

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
    console.info("castingsData in refetchMovieTMDB", castingsData);

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

    console.info("videoUrl in refetchMovieTMDB", videoUrl);

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

    console.info("keywordsData in refetchMovieTMDB:", keywordsData);

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

    // fetch movie cover
    // const posterUrl = moviefetchData.poster_path
    //   ? `https://image.tmdb.org/t/p/original${moviefetchData.poster_path}`
    //   : null;
    // setCoverPreview(posterUrl);
    // setNewDataMovie((prevMovie) => ({
    //   ...prevMovie,
    //   posterUrl,
    // }));
  } catch (error) {
    console.error("Error:", error);
  }
};

export default refetchMovieTMDB;
