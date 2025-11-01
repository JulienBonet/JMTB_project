/* eslint-disable no-await-in-loop */
/* eslint-disable no-shadow */
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Container, IconButton, Tooltip } from "@mui/material";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import Switch from "@mui/material/Switch";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TransferList from "./MovieItemList";
import MovieInfosEntrance from "./MovieInfosEntrance";
import "./addNewMovie.css";

function AddNewMovie() {
  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/images`;

  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState("");
  const [videoSupport, setvideoSupport] = useState("");
  const [format, setFormat] = useState("");
  const [fileSize, setFileSize] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState("");
  const [coverPreview, setCoverPreview] = useState(
    `${backendUrl}/00_cover_default.jpg`
  );
  const [openModal, setOpenModal] = useState(false);
  const [openModalMIE, setOpenModalMIE] = useState(false);
  const [selectedKinds, setSelectedKinds] = useState([]);
  const [selectedDirectors, setSelectedDirectors] = useState([]);
  const [selectedScreenwriters, setSelectedScreenwriters] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState([]);
  const [selectedCasting, setSelectedCasting] = useState([]);
  const [selectedStudios, setSelectedStudios] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [uploadLocal, setUploadLocal] = useState(false);
  const [version, setVersion] = useState("none");
  const [tvSeasons, setTvSeasons] = useState("");
  const [seasonsInfo, setSeasonsInfo] = useState([]);
  const [selectedSeasons, setSelectedSeasons] = useState([]); // saison choisie
  const [nbTvEpisodes, setNbTvEpisodes] = useState(0);
  const [totalDuration, setTotalDuration] = useState("");
  const [movie, setMovie] = useState({
    title: "",
    altTitle: "",
    year: "",
    duration: "",
    pitch: "",
    story: "",
    comment: "",
    posterUrl: "",
    trailer: "",
    location: "",
    videoFormat: "",
    videoSupport: "",
    fileSize: "",
    idTheMovieDb: "",
    idIMDB: "",
    isTvShow: false,
    nbTvSeasons: "",
    tvSeasons: "",
    nbTvEpisodes: "",
    episodeDuration: "",
  });
  console.info("data", data);
  console.info("movie", movie);

  // -----------------/ GESTION DES FIELDS SAISONS - EPISODES - DUREE /----------------- //

  // -- TVSHOW Mettre à jour le nombre d'épisodes en fonction des saisons sélectionnées
  useEffect(() => {
    if (!movie.isTvShow) return; // ne rien faire si ce n'est pas une série TV

    if (!Array.isArray(selectedSeasons) || selectedSeasons.length === 0) {
      setNbTvEpisodes(0);
      setMovie((prev) => ({ ...prev, nbTvEpisodes: 0 }));
      return;
    }

    const totalEpisodes = selectedSeasons.reduce((sum, seasonNumber) => {
      const season = seasonsInfo.find((s) => s.season_number === seasonNumber);
      return sum + (season ? season.episode_count : 0);
    }, 0);

    setNbTvEpisodes(totalEpisodes);
    setMovie((prev) => ({ ...prev, nbTvEpisodes: totalEpisodes }));
  }, [selectedSeasons, seasonsInfo, movie.isTvShow]);

  // -- TVSHOW Mettre à jour la durée totale
  useEffect(() => {
    if (!movie.isTvShow) return; // ne rien faire pour les films

    if (!movie.episodeDuration || movie.episodeDuration === 0) {
      setTotalDuration("");
      setMovie((prev) => ({ ...prev, duration: "" }));
      return;
    }

    if (nbTvEpisodes > 0) {
      const total = nbTvEpisodes * movie.episodeDuration;
      setTotalDuration(total);
      setMovie((prev) => ({ ...prev, duration: total }));
    } else {
      setTotalDuration("");
      setMovie((prev) => ({ ...prev, duration: "" }));
    }
  }, [nbTvEpisodes, movie.episodeDuration, movie.isTvShow]);

  // -- TVSHOW Mettre à jour la plage de saisons sélectionnées
  useEffect(() => {
    if (!movie.isTvShow) return; // ne rien faire pour les films

    if (!Array.isArray(selectedSeasons) || selectedSeasons.length === 0) {
      setTvSeasons("");
      setMovie((prev) => ({ ...prev, tvSeasons: "" }));
      return;
    }

    // Trie les saisons sélectionnées
    const sortedSeasons = [...selectedSeasons].sort((a, b) => a - b);

    let displayValue = "";

    // Si elles sont consécutives → format "1-3"
    const isConsecutive = sortedSeasons.every(
      (num, i, arr) => i === 0 || num === arr[i - 1] + 1
    );

    if (isConsecutive) {
      displayValue =
        sortedSeasons.length === 1
          ? `${sortedSeasons[0]}`
          : `${sortedSeasons[0]}-${sortedSeasons[sortedSeasons.length - 1]}`;
    } else {
      // Saisons non consécutives → "1, 3, 5"
      displayValue = sortedSeasons.join(", ");
    }

    setTvSeasons(displayValue);
    setMovie((prev) => ({ ...prev, tvSeasons: displayValue }));
  }, [selectedSeasons, movie.isTvShow]);

  // -- Rendus Front des Fields Saisons / episodes / durée
  const renderTvSeasonEpisodeDurationFields = () => {
    const renderEpisodeAndDurationFields = (
      isReadOnly = false // on garde cette option si on veut bloquer certains champs plus tard
    ) => (
      <>
        <TextField
          name="nbTvEpisodes"
          label="Nombre d’épisodes"
          type="number"
          value={nbTvEpisodes || ""}
          onChange={(e) => {
            const value = Number(e.target.value);
            setNbTvEpisodes(value);
            setMovie((prev) => ({ ...prev, nbTvEpisodes: value }));
          }}
          InputProps={{ readOnly: isReadOnly }}
          sx={{ width: "25ch" }}
        />
        <TextField
          name="episodeDuration"
          type="number"
          label="Durée d’un épisode (min)"
          value={movie.episodeDuration || ""}
          onChange={(e) =>
            setMovie((prev) => ({
              ...prev,
              episodeDuration: Number(e.target.value),
            }))
          }
          InputProps={{ readOnly: isReadOnly }}
          sx={{ width: "25ch" }}
        />
        <TextField
          name="duration"
          label="Durée totale (minutes)"
          value={
            nbTvEpisodes && movie.episodeDuration
              ? nbTvEpisodes * movie.episodeDuration
              : ""
          }
          InputProps={{ readOnly: true }}
          sx={{ width: "25ch" }}
        />
      </>
    );

    // --- Mode API ---
    if (seasonsInfo.length > 0) {
      return (
        <>
          <FormControl sx={{ width: "25ch" }}>
            <InputLabel id="season-select-label">Saisons</InputLabel>
            <Select
              labelId="season-select-label"
              multiple
              value={Array.isArray(selectedSeasons) ? selectedSeasons : []}
              onChange={(e) => {
                let { value } = e.target;
                if (!Array.isArray(value)) value = [value];
                value = value.map((v) => Number(v));
                setSelectedSeasons(value);

                const totalEpisodes = value.reduce((sum, seasonNumber) => {
                  const season = seasonsInfo.find(
                    (s) => s.season_number === seasonNumber
                  );
                  return sum + (season ? season.episode_count : 0);
                }, 0);

                setMovie((prev) => ({ ...prev, nbTvEpisodes: totalEpisodes }));
              }}
              input={<OutlinedInput label="Saisons" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {Array.from({ length: movie.nbTvSeasons || 0 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  <Checkbox
                    checked={
                      Array.isArray(selectedSeasons) &&
                      selectedSeasons.includes(i + 1)
                    }
                  />
                  <ListItemText primary={`Saison ${i + 1}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {renderEpisodeAndDurationFields()}
        </>
      );
    }

    // --- Mode manuel ---
    return (
      <>
        <TextField
          name="tvSeasons"
          label="Saisons sélectionnées"
          value={tvSeasons || ""}
          onChange={(e) => {
            const { value } = e.target;
            setTvSeasons(value);
            setMovie((prev) => ({ ...prev, tvSeasons: value }));
          }}
          sx={{ width: "25ch" }}
        />
        {renderEpisodeAndDurationFields()}
      </>
    );
  };

  // -----------------/ ANNULATION - RETOUR VERS ADMIN MOVIE LIST /----------------- //

  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/admin_feat");
  };

  // -----------------/ SOURCE /----------------- //

  const handleChangeMovieDb = (event) => {
    setMovie((prevMovie) => ({
      ...prevMovie,
      idTheMovieDb: event.target.value,
    }));
  };

  // -----------------/ RESET FORM /----------------- //
  const resetStates = (isTvShow = false) => {
    // Vider le formulaire
    setMovie({
      title: "",
      altTitle: "",
      year: "",
      duration: "",
      pitch: "",
      story: "",
      posterUrl: "",
      trailer: "",
      location: null,
      videoFormat: "",
      videoSupport: "",
      fileSize: null,
      idTheMovieDb: "",
      idIMDB: "",
      isTvShow,
      nbTvSeasons: "",
      tvSeasons: "",
      nbTvEpisodes: "",
      episodeDuration: "",
    });
    // Réinitialiser valeur par défaut
    setFormat("");
    setvideoSupport("");
    setFileSize(null);
    setSelectedFile(null);
    setSelectedKinds([]);
    setSelectedDirectors([]);
    setSelectedCasting([]);
    setSelectedScreenwriters([]);
    setSelectedMusic([]);
    setSelectedStudios([]);
    setSelectedCountries([]);
    setSelectedLanguages([]);
    setSelectedTags([]);
    setCoverPreview(`${backendUrl}/00_cover_default.jpg`);
    setSelectedCoverFile("");
    setUploadLocal(false);
    setSeasonsInfo([]);
    setSelectedSeasons([]);
    setTvSeasons("");
    setNbTvEpisodes("");
    setVersion("none");
  };

  // -----------------/ MOVIE INFO ENTRANCE MODAL /----------------- //

  const handleOpenModalMIE = () => {
    if (movie.title) {
      setOpenModalMIE(true);
    } else {
      toast.warn("Saisir un titre à rechercher");
    }
  };

  const handleCloseModalMIE = () => {
    setOpenModalMIE(false);
  };

  // -----------------/ MOVIE ENTRANCE SEARCH & INSERT FUNC /----------------- //

  // GENRES SEARCH BY NAME METHOD
  const searchGenreInDatabase = async (genreName) => {
    console.info(
      "get in searchGenreInDatabase: ",
      `${import.meta.env.VITE_BACKEND_URL}/api/kind/${encodeURIComponent(
        genreName
      )}`
    );
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/kind/${encodeURIComponent(
          genreName
        )}`
      );

      if (response.status === 200 && response.data) {
        console.info("genre cherché:", response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      throw new Error(
        `Error searching for genre in database: ${error.message}`
      );
    }
  };

  // GENRES NEW INSERT METHOD
  const createGenreInDatabase = async (genreName) => {
    console.info(
      "post in createGenreInDatabase: ",
      `${import.meta.env.VITE_BACKEND_URL}/api/kind`
    );
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/kind`,
        { name: genreName }
      );

      console.info("genre crée:", response.data);

      if (response.status === 201 && response.data) {
        return response.data;
      }
      throw new Error("Failed to create genre in database");
    } catch (error) {
      throw new Error(`Error creating genre in database: ${error.message}`);
    }
  };

  // STUDIO SEARCH BY NAME METHOD
  const searchStudioInDatabase = async (studioName) => {
    try {
      // Remplacer les slashes par des tirets
      const regexStudioName = studioName.replace(/\//g, "-");
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/studio/byname/${encodeURIComponent(regexStudioName)}`;
      const response = await axios.get(url);

      if (response.status === 200 && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      throw new Error(
        `Error searching for studio in database: ${error.message}`
      );
    }
  };

  // STUDIO NEW INSERT METHOD
  const createStudioInDatabase = async (studioName) => {
    try {
      // Remplacer les slashes par des tirets
      const regexStudioName = studioName.replace(/\//g, "-");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/studio`,
        { name: regexStudioName }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating studio:", error);
      throw error;
    }
  };

  // COUNTRY SEARCH BY NAME METHOD
  const searchCountryInDatabase = async (countryName) => {
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/country/byname/${encodeURIComponent(countryName)}`;
      const response = await axios.get(url);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      throw new Error(
        `Error searching for country in database: ${error.message}`
      );
    }
  };

  // COUNTRY NEW INSERT METHOD
  const createCountryInDatabase = async (countryName) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/country`,
        { name: countryName }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating country:", error);
      throw error;
    }
  };

  // LANGUAGE SEARCH BY NAME METHOD
  const searchLanguageInDatabase = async (languageName) => {
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/language/byname/${encodeURIComponent(languageName)}`;
      const response = await axios.get(url);

      if (response.status === 200 && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      throw new Error(
        `Error searching for language in database: ${error.message}`
      );
    }
  };

  // LANGUAGE NEW INSERT METHOD
  const createLanguageInDatabase = async (languageName) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/language`,
        { name: languageName }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating language:", error);
      throw error;
    }
  };

  // DIRECTOR SEARCH BY NAME METHOD
  const searchDirectorInDatabase = async (directorsNames) => {
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/director/byname/${encodeURIComponent(directorsNames)}`;

      const response = await axios.get(url);

      if (response.status === 200 && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      throw new Error(
        `Error searching for director in database: ${error.message}`
      );
    }
  };

  // DIRECTORS NEW INSERT METHOD
  const createDirectorInDatabase = async (directorName) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/director`,
        { name: directorName }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating director:", error);
      throw error;
    }
  };

  // SCREENWRITER SEARCH BY NAME METHOD
  const searchScreenwriterInDatabase = async (screenwritersNames) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/screenwriter/byname/${encodeURIComponent(screenwritersNames)}`
      );

      if (response.status === 200 && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      throw new Error(
        `Error searching for screenwriter in database: ${error.message}`
      );
    }
  };

  // SCREENWRITER NEW INSERT METHOD
  const createScreenwriterInDatabase = async (screenwriterName) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/screenwriter`,
        { name: screenwriterName }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating screenwriter:", error);
      throw error;
    }
  };

  // COMPOSITOR SEARCH BY NAME METHOD
  const searchCompositorInDatabase = async (compositorsNames) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/music/byname/${encodeURIComponent(compositorsNames)}`
      );

      if (response.status === 200 && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      throw new Error(
        `Error searching for compositor in database: ${error.message}`
      );
    }
  };

  // COMPOSITOR NEW INSERT METHOD
  const createCompositorInDatabase = async (compositorName) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/compositor`,
        { name: compositorName }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating compositor:", error);
      throw error;
    }
  };

  // CASTING SEARCH BY NAME METHOD
  const searchCastingInDatabase = async (castingsNames) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/casting/byname/${encodeURIComponent(castingsNames)}`
      );

      if (response.status === 200 && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      throw new Error(
        `Error searching for compositor in database: ${error.message}`
      );
    }
  };

  // CASTINGG NEW INSERT METHOD
  const createCastingInDatabase = async (castingName) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/casting`,
        { name: castingName }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating casting:", error);
      throw error;
    }
  };

  // TAG SEARCH BY NAME METHOD
  const searchTagInDatabase = async (tagsNames) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/tag/byname/${encodeURIComponent(tagsNames)}`
      );

      if (response.status === 200 && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      throw new Error(`Error searching for tag in database: ${error.message}`);
    }
  };

  // TAG NEW INSERT METHOD
  const createTagInDatabase = async (TagName) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tag`,
        { name: TagName }
      );
      return response.data;
    } catch (error) {
      console.error("Error tag casting:", error);
      throw error;
    }
  };

  // -----------------/ MOVIE DATA FETCH /----------------- //

  const handleMovieClick = async (movieId, mediaType) => {
    resetStates();

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
      const movieData = response.data;
      console.info("response", response);
      console.info("movieData", movieData);

      // Variables spécifiques TV
      const isTV = mediaType === "tv";
      const nbTvSeasons = isTV ? movieData.number_of_seasons : null;
      const nbTvEpisodes = isTV ? movieData.number_of_episodes : null;
      const episodeDuration =
        isTV && movieData.episode_run_time?.length > 0
          ? movieData.episode_run_time[0]
          : null;

      // Si c'est une série, on récupère la liste des saisons
      const seasonsInfo = isTV
        ? movieData.seasons.map((s) => ({
            season_number: s.season_number,
            episode_count: s.episode_count,
          }))
        : [];

      setSeasonsInfo(seasonsInfo);
      console.info("seasonsInfo", seasonsInfo);

      // Gestion du titre alternatif sans ternaires imbriqués
      let altTitle = "";
      if (isTV) {
        if (
          movieData.original_name &&
          movieData.original_name !== movieData.name
        ) {
          altTitle = movieData.original_name;
        }
      } else if (
        movieData.original_title &&
        movieData.original_title !== movieData.title
      ) {
        altTitle = movieData.original_title;
      }

      // Mise à jour de l’état du film
      setMovie({
        ...movie,
        title: isTV ? movieData.name : movieData.title,
        altTitle,
        year:
          (isTV ? movieData.first_air_date : movieData.release_date)?.substring(
            0,
            4
          ) || "",
        pitch: movieData.tagline || "",
        story: movieData.overview || "",
        idTheMovieDb: `${mediaType}/${movieData.id}`,
        idIMDB: isTV ? null : movieData.imdb_id,
        isTvShow: isTV,
        duration: movieData.runtime,
        nbTvSeasons,
        tvSeasons,
        nbTvEpisodes,
        episodeDuration,
      });

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
      const genresToFetch = movieData.genres.map((genre) => genre.name);
      if (movieData.adult) {
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
        movieData.production_companies.map(fetchStudio)
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
        movieData.production_countries.map(fetchCountry)
      );
      setSelectedCountries(countriesData);

      // Fetch LANGUAGE
      const fetchLanguage = async (language) => {
        const languageData = await searchLanguageInDatabase(
          language.english_name
        );
        if (languageData) {
          return { id: languageData.id, name: languageData.name };
        }
        const newLanguageData = await createLanguageInDatabase(
          language.english_name
        );
        return { id: newLanguageData.id, name: language.english_name };
      };

      const languagesData = await Promise.all(
        movieData.spoken_languages.map(fetchLanguage)
      );
      setSelectedLanguages(languagesData);

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
        if (movieData.created_by && movieData.created_by.length > 0) {
          directorsData = await Promise.all(
            movieData.created_by.map((creator) =>
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
      console.info("castingsData", castingsData);

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

      setMovie((prevMovie) => ({
        ...prevMovie,
        trailer: videoUrl,
      }));

      console.info("videoUrl", videoUrl);

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

      console.info("keywordsData:", keywordsData);

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
      const posterUrl = movieData.poster_path
        ? `https://image.tmdb.org/t/p/original${movieData.poster_path}`
        : null;
      setCoverPreview(posterUrl);
      setMovie((prevMovie) => ({
        ...prevMovie,
        posterUrl,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // -----------------/ ITEMS MODAL FETCH /----------------- //

  const fetchData = (route) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${route}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((datas) => {
        setData(datas);
      })
      .catch((error) => {
        console.error(`Error fetching ${route}:`, error);
      });
  };

  const handleOpenModal = (type) => {
    setDataType(type);
    setOpenModal(true);
    fetchData(type);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setDataType("");
    setData([]);
  };

  const handleSelectedKindsUpdate = (updatedSelectedKinds) => {
    setSelectedKinds(updatedSelectedKinds);
  };

  const handleSelectedDirectorsUpdate = (updatedSelectedDirectors) => {
    setSelectedDirectors(updatedSelectedDirectors);
  };

  const handleSelectedScreenwritersUpdate = (updatedSelectedScreenwriters) => {
    setSelectedScreenwriters(updatedSelectedScreenwriters);
  };

  const handleSelectedMusicUpdate = (updatedSelectedMusic) => {
    setSelectedMusic(updatedSelectedMusic);
  };

  const handleSelectedStudiosUpdate = (updatedSelectedStudios) => {
    setSelectedStudios(updatedSelectedStudios);
  };

  const handleSelectedCastingUpdate = (updatedSelectedCasting) => {
    setSelectedCasting(updatedSelectedCasting);
  };

  const handleSelectedCountriesUpdate = (updatedSelectedCountries) => {
    setSelectedCountries(updatedSelectedCountries);
  };

  const handleSelectedLanguagesUpdate = (updatedSelectedLanguages) => {
    setSelectedLanguages(updatedSelectedLanguages);
  };

  const handleSelectedTagsUpdate = (updatedSelectedTags) => {
    setSelectedTags(updatedSelectedTags);
  };

  // extract names from objects
  const getSelectedKindsNames = (selectedKinds) => {
    return selectedKinds.map((kind) => kind.name).join(", ");
  };

  const getSelectedDirectorsNames = (selectedDirectors) => {
    return selectedDirectors.map((director) => director.name).join(", ");
  };

  const getSelectedScreenwritersNames = (selectedScreenwriters) => {
    return selectedScreenwriters
      .map((screenwriter) => screenwriter.name)
      .join(", ");
  };

  const getSelectedMusicNames = (selectedMusic) => {
    return selectedMusic.map((compositor) => compositor.name).join(", ");
  };

  const getSelectedCastingNames = (selectedCasting) => {
    return selectedCasting.map((casting) => casting.name).join(", ");
  };

  const getSelectedStudiosNames = (selectedStudios) => {
    return selectedStudios.map((studio) => studio.name).join(", ");
  };

  const getSelectedCountriesNames = (selectedCountries) => {
    return selectedCountries.map((country) => country.name).join(", ");
  };

  const getSelectedLanguagesNames = (selectedLanguages) => {
    return selectedLanguages.map((language) => language.name).join(", ");
  };

  const getSelectedTagsNames = (selectedTags) => {
    return selectedTags.map((tag) => tag.name).join(", ");
  };

  // -----------------/ INPUT FILE /----------------- //
  const fileInputRef = useRef(null); // Référence pour le fichier vidéo

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const videoFormats = ["avi", "mkv", "mp4"];

    if (videoFormats.includes(fileExtension)) {
      setSelectedFile(file);
      const fileSizeInBytes = file.size;
      const fileSizeInGigabytes = fileSizeInBytes / (1024 * 1024 * 1024);
      setFileSize(fileSizeInGigabytes.toFixed(2));
      setFormat(fileExtension);
      setvideoSupport("Fichier multimédia");
      setMovie((prevMovie) => ({
        ...prevMovie,
        location: event.target.value,
        videoFormat: fileExtension,
        videoSupport: "Fichier multimédia",
        fileSize: `${fileSizeInGigabytes.toFixed(2)} GB`,
      }));
    } else {
      toast.warn("Veuillez sélectionner un fichier vidéo valide.");
    }
  };

  const supportsHandleChange = (event) => {
    setvideoSupport(event.target.value);
    setMovie((prevMovie) => ({
      ...prevMovie,
      videoSupport: event.target.value,
    }));
  };

  const formatsHandleChange = (event) => {
    setFormat(event.target.value);
    setMovie((prevMovie) => ({
      ...prevMovie,
      videoFormat: event.target.value,
    }));
  };

  const handleFormatSupportChange = (event) => {
    setMovie({ ...movie, videoSupport: event.target.value });
    supportsHandleChange(event);
  };

  // -----------------/ INPUT COVER /----------------- //

  const fileCoverRef = useRef(null); // Référence pour le fichier image

  const handleCoverChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result); // Affiche l'aperçu de l'image sélectionnée
      };
      reader.readAsDataURL(file);
      setSelectedCoverFile(file); // Stocke le fichier sélectionné
      setUploadLocal(true); // Passe en mode upload local
    }
  }; // end handleCoverChange

  const handleFileUpload = async () => {
    let coverFilename = "00_cover_default.jpg"; // Image par défaut

    // Cas 1: Upload manuel d'une image
    if (uploadLocal && selectedCoverFile) {
      const formData = new FormData();
      formData.append("cover", selectedCoverFile);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/upload-local-cover`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCoverPreview(`${backendUrl}/${data.coverFilename}`);
          coverFilename = data.coverFilename; // Fichier uploadé
        }
      } catch (error) {
        console.error("Error uploading local file:", error);
      }
    }
    // Cas 2: Récupération via une API
    else if (!uploadLocal && movie.posterUrl) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/upload-cover`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ posterUrl: movie.posterUrl }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCoverPreview(`${backendUrl}/${data.coverFilename}`);
          coverFilename = data.coverFilename; // Image récupérée via l'API
        }
      } catch (error) {
        console.error("Error uploading cover via API:", error);
      }
    }

    return coverFilename;
  };

  // -----------------/ POST NEW MOVIE /----------------- //

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "idIMDb") {
      setMovie((prevMovie) => ({ ...prevMovie, [name]: parseInt(value, 10) }));
    } else if (name === "location") {
      setMovie((prevMovie) => ({
        ...prevMovie,
        [name]: event.target.files[0],
      }));
    } else {
      setMovie((prevMovie) => ({ ...prevMovie, [name]: value }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (event) => {
    if (!videoSupport) {
      toast.warn("Merci de saisir un support");
    } else {
      event.preventDefault();

      setIsSubmitting(true); // Affiche le Backdrop

      const vostfr = version === "VOSTFR" ? 1 : 0;
      const multi = version === "MULTI" ? 1 : 0;

      // Récupérer toutes les données sélectionnées
      const selectedGenre = selectedKinds.map((kind) => kind);
      const selectedDirectorsName = selectedDirectors.map(
        (director) => director.name
      );
      const selectedCastingName = selectedCasting.map(
        (casting) => casting.name
      );
      const selectedScreenwritersName = selectedScreenwriters.map(
        (screenwriter) => screenwriter.name
      );
      const selectedMusicName = selectedMusic.map((music) => music.name);
      const selectedStudiosName = selectedStudios.map((studio) => studio.name);
      const selectedCountriesName = selectedCountries.map(
        (country) => country.name
      );
      const selectedLanguagesName = selectedLanguages.map(
        (language) => language.name
      );

      const selectedTagsName = selectedTags.map((tag) => tag.name);

      // Créer le corps de la requête
      const requestBody = {
        ...movie,
        genres: selectedGenre,
        directors: selectedDirectorsName,
        castings: selectedCastingName,
        screenwriters: selectedScreenwritersName,
        compositors: selectedMusicName,
        studios: selectedStudiosName,
        countries: selectedCountriesName,
        languages: selectedLanguagesName,
        tags: selectedTagsName,
        vostfr,
        multi,
      };
      // console.info("requestBody:", requestBody);

      // Effectuer l'upload de l'image (que ce soit via API ou localement)
      const coverFilename = await handleFileUpload(); // Attendre le résultat de l'upload

      // Ajouter le nom du fichier de couverture au corps de la requête
      requestBody.cover = coverFilename || "00_cover_default.jpg"; // Utiliser une valeur par défaut si pas d'upload

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/movie`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // log verificication datas
        const data = await response.json();
        console.info("data:", data);
        toast.success("Le film a été ajouté avec succès !");
        // resetStates(); // Réinitialiser les états du formulaire
        handleReturn(); // Retour vers MovieItemList
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de l'ajout du film. 😱 Veuillez réessayer. ");
      } finally {
        setIsSubmitting(false); // Masque le Backdrop une fois terminé
      }
    } // end else
  }; // end handleFormSubmit

  // -----------------/ BUTTON STYLE /----------------- //
  const theme = createTheme({
    palette: {
      primary: {
        main: "#1e1612",
      },
      secondary: {
        main: "#00d9c0",
      },
      validBtn: {
        main: "#076834",
      },
      abortBtn: {
        main: "#ad1f2b",
      },
    },
  });

  // -----------------/ MODAL STYLE /----------------- //
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 0, // Padding top
    pb: 4, // Padding bottom
    px: 0, // Padding left and right, si besoin
  };

  const styleMIEmodal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 0,
  };

  // -----------------------------/ RETURN /----------------------------- //
  return (
    <main>
      <section className="Adm_form_box">
        <section className="Adm_l1">
          <div className="Adm_l1a">
            <h1 className="AdM_main_title">ADD NEW MOVIE</h1>
            {/* movie idTheMovieDb */}
            <div className="SourceResearchItems">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "15ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="filled-basic"
                  label="Id MovieDb"
                  variant="outlined"
                  value={movie.idTheMovieDb}
                  onChange={handleChangeMovieDb}
                />
              </Box>
              <Stack spacing={2} direction="row">
                <FormControlLabel
                  control={
                    <Switch
                      checked={movie.isTvShow}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        resetStates(isChecked);
                      }}
                    />
                  }
                  label="Série TV"
                />
                <IconButton
                  color="warning"
                  onClick={() => resetStates()}
                  sx={{ alignSelf: "flex-end" }} // pour le placer joliment à droite si tu veux
                >
                  <RestartAltIcon />
                </IconButton>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleOpenModalMIE()}
                >
                  RECHERCHE
                </Button>
              </Stack>
            </div>
            {/* movie TITLE */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "150ch" } }}
              noValidate
              autoComplete="off"
              display="flex"
              alignItems="center"
              gap={4}
              p={2}
            >
              <TextField
                name="title"
                value={movie.title}
                onChange={handleInputChange}
                id="filled-basic"
                label="Titre du film"
                variant="outlined"
              />
            </Box>
            {/* movie alt TITLE */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "100ch" } }}
              noValidate
              autoComplete="off"
              display="flex"
              alignItems="center"
              gap={4}
              p={2}
            >
              <TextField
                name="altTitle"
                value={movie.altTitle}
                onChange={handleInputChange}
                id="filled-basic"
                label="Titre alternatif"
                variant="outlined"
              />
            </Box>
            {/* movie YEAR - DURATION */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "25ch" } }}
              noValidate
              autoComplete="off"
              display="flex"
              flexDirection="column"
              gap={2}
              p={2}
            >
              <TextField
                name="year"
                value={movie.year}
                onChange={handleInputChange}
                label="Année"
                variant="outlined"
              />
              {/* rendus des fields saisons - episodes - durée gérée en amont du Return par la fonction renderTvSeasonEpisodeDurationFields */}
              {movie.isTvShow ? (
                renderTvSeasonEpisodeDurationFields()
              ) : (
                <TextField
                  name="duration"
                  value={movie.duration}
                  onChange={handleInputChange}
                  label="Durée"
                  variant="outlined"
                />
              )}
            </Box>
            {/* movie PITCH */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "100ch" } }}
              noValidate
              autoComplete="off"
              display="flex"
              alignItems="center"
              gap={4}
              p={2}
            >
              <TextField
                name="pitch"
                value={movie.pitch}
                onChange={handleInputChange}
                id="filled-basic"
                label="pitch"
                variant="outlined"
              />
            </Box>
            {/* movie STORY */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "100ch" } }}
              noValidate
              autoComplete="off"
              display="flex"
              alignItems="center"
              gap={4}
              p={2}
            >
              <TextField
                name="story"
                value={movie.story}
                onChange={handleInputChange}
                id="outlined-multiline-static"
                label="story"
                multiline
                rows={4}
              />
            </Box>
            {/* movie TRAILER */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "100ch" } }}
              noValidate
              autoComplete="off"
              display="flex"
              alignItems="center"
              gap={4}
              p={2}
            >
              <TextField
                name="trailer"
                value={movie.trailer}
                onChange={handleInputChange}
                id="filled-basic"
                label="trailer"
                variant="outlined"
              />
            </Box>
            {/* movie COMMENTAIRE */}
            <Box
              component="form"
              sx={{ "& > :not(style)": { width: "100ch" } }}
              noValidate
              autoComplete="off"
              display="flex"
              alignItems="center"
              gap={4}
              p={2}
              onSubmit={handleFormSubmit}
            >
              <TextField
                name="comment"
                value={movie.comment} // Assurez-vous que ça soit `movie.comment`
                onChange={handleInputChange} // Utiliser la même fonction pour gérer les changements
                id="outlined-multiline-static"
                label="Commentaire"
                multiline
                rows={4}
              />
            </Box>
          </div>

          <div className="Adm_l1b">
            {/* movie KINDS */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Genre(s)"
                  value={getSelectedKindsNames(selectedKinds)}
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("kinds")}
              />
            </div>
            {/* movie DIRECTOR */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Réalisateur(s)"
                  value={getSelectedDirectorsNames(selectedDirectors)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("directors")}
              />
            </div>
            {/* movie SCREENWRITERS */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Scénariste(s)"
                  value={getSelectedScreenwritersNames(selectedScreenwriters)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("screenwriters")}
              />
            </div>
            {/* movie COMPOSITOR */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Compositeur(s)"
                  value={getSelectedMusicNames(selectedMusic)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("music")}
              />
            </div>
            {/* movie CASTING */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Casting"
                  value={getSelectedCastingNames(selectedCasting)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("casting")}
              />
            </div>
            {/* movie STUDIO */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Studio"
                  value={getSelectedStudiosNames(selectedStudios)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("studio")}
              />
            </div>
            {/* movie COUNTRY */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Pays"
                  value={getSelectedCountriesNames(selectedCountries)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("country")}
              />
            </div>
            {/* movie LANGUAGES */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Langues"
                  value={getSelectedLanguagesNames(selectedLanguages)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("languages/sorted_id")}
              />
            </div>
            {/* movie TAG */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "75ch" } }}
                noValidate
                autoComplete="off"
                display="flex"
                alignItems="center"
                gap={4}
                p={2}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Tags"
                  value={getSelectedTagsNames(selectedTags)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <AddCircleOutlineIcon
                className="Btn_Add_itemsPopUp"
                onClick={() => handleOpenModal("tags/sorted_id")}
              />
            </div>
          </div>
        </section>
        <div className="dashed_secondary_bar" />

        <section className="Adm_l2">
          {/* movie FILE */}
          <div className="Adm_l2a">
            {/* movie SUPPORT */}
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-select-small-label">Support</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={videoSupport}
                label="Support"
                onChange={handleFormatSupportChange}
              >
                <MenuItem value="">
                  <em>choisir un support</em>
                </MenuItem>
                <MenuItem value="DVD original">DVD</MenuItem>
                <MenuItem value="DVD R/RW">DVD R/RW</MenuItem>
                <MenuItem value="Fichier multimédia">
                  FICHIER MULTIMEDIA
                </MenuItem>
              </Select>
            </FormControl>
            {videoSupport === "Fichier multimédia" && (
              <>
                <div>
                  {/* movie VIDEOFORMAT */}
                  <Box
                    component="form"
                    sx={{ "& > :not(style)": { width: "25ch" } }}
                    noValidate
                    autoComplete="off"
                    display="flex"
                    alignItems="center"
                    gap={4}
                  >
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-select-small-label">
                        format
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={format}
                        label="format"
                        onChange={formatsHandleChange}
                      >
                        <MenuItem value="">
                          <em>choisir un format</em>
                        </MenuItem>
                        <MenuItem value="avi">avi</MenuItem>
                        <MenuItem value="mkv">mkv</MenuItem>
                        <MenuItem value="mp4">mp4</MenuItem>
                      </Select>
                    </FormControl>
                    {/* movie FILESIZE */}
                    <TextField
                      label="File Size"
                      id="outlined-start-adornment"
                      sx={{ m: 1, width: "25ch" }}
                      value={fileSize || ""}
                      onChange={(event) => setFileSize(event.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">Go</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </div>

                {/* movie LOCAL FILE */}
                <Box
                  component="form"
                  sx={{ "& > :not(style)": { width: "75ch" } }}
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                  gap={4}
                  p={1}
                >
                  <TextField
                    id="filled-basic"
                    label="fichier Local"
                    variant="outlined"
                    value={selectedFile ? selectedFile.name : ""}
                  />
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <button
                    type="button"
                    className="input_file_btn"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Sélectionner un fichier vidéo
                  </button>
                </Box>

                <FormControl sx={{ m: 1 }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    version:
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={version} // Assurez-vous que la valeur sélectionnée soit affichée correctement
                    onChange={(e) => setVersion(e.target.value)} // Met à jour l'état
                  >
                    <FormControlLabel
                      value="none"
                      control={<Radio />}
                      label="none"
                    />
                    <FormControlLabel
                      value="VOSTFR"
                      control={<Radio />}
                      label="VOSTFR"
                    />
                    <FormControlLabel
                      value="MULTI"
                      control={<Radio />}
                      label="MULTI"
                    />
                  </RadioGroup>
                </FormControl>
              </>
            )}
          </div>
          {/* movie COVER */}
          <div className="Adm_l2b">
            <img
              className="preview_cover"
              src={coverPreview}
              alt="Couverture"
            />
            <input
              type="file"
              name="cover"
              style={{ display: "none" }}
              onChange={handleCoverChange}
              ref={fileCoverRef}
              accept="image/*"
            />
            <button type="button" onClick={() => fileCoverRef.current.click()}>
              Sélectionner une image
            </button>
          </div>
        </section>

        <div className="dashed_secondary_bar" />
        <section className="Adm_l3">
          {/* VALIDATION */}
          <ThemeProvider theme={theme}>
            <Stack spacing={2} direction="row">
              <Button
                onClick={handleFormSubmit}
                size="large"
                variant="outlined"
                color="validBtn"
              >
                VALIDER
              </Button>
              <Button
                onClick={handleReturn}
                size="large"
                variant="outlined"
                color="abortBtn"
              >
                ANNULER
              </Button>
            </Stack>
          </ThemeProvider>

          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open={isSubmitting} // Affiche le Backdrop pendant la soumission
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </section>
      </section>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div
            onClick={handleCloseModal}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                handleCloseModal();
              }
            }}
            role="button"
            tabIndex={0}
            className="modal_closed_btn_MovieItemList"
          >
            &#91; Fermer &#93;
          </div>

          <Container>
            <TransferList
              dataType={dataType}
              items={data}
              selectedKinds={selectedKinds}
              onSelectedKindsUpdate={handleSelectedKindsUpdate}
              selectedDirectors={selectedDirectors}
              onSelectedDirectorsUpdate={handleSelectedDirectorsUpdate}
              selectedScreenwriters={selectedScreenwriters}
              onSelectedScreenwritersUpdate={handleSelectedScreenwritersUpdate}
              selectedMusic={selectedMusic}
              onSelectedMusicUpdate={handleSelectedMusicUpdate}
              selectedCasting={selectedCasting}
              onSelectedCastingUpdate={handleSelectedCastingUpdate}
              selectedStudios={selectedStudios}
              onSelectedStudiosUpdate={handleSelectedStudiosUpdate}
              selectedCountries={selectedCountries}
              onSelectedCountriesUpdate={handleSelectedCountriesUpdate}
              selectedLanguages={selectedLanguages}
              onSelectedLanguagesUpdate={handleSelectedLanguagesUpdate}
              selectedTags={selectedTags}
              onSelectedTagsUpdate={handleSelectedTagsUpdate}
            />
          </Container>
        </Box>
      </Modal>
      <Modal
        open={openModalMIE}
        onClose={handleCloseModalMIE}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleMIEmodal}>
          <MovieInfosEntrance
            title={movie.title}
            onMovieClick={(id, type) => handleMovieClick(id, type)}
            handleCloseModalMIE={handleCloseModalMIE}
          />
        </Box>
      </Modal>
    </main>
  );
}

export default AddNewMovie;
