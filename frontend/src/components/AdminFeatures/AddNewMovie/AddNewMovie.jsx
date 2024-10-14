/* eslint-disable no-await-in-loop */
/* eslint-disable no-shadow */
/* eslint-disable no-alert */
import { useState, useRef } from "react";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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
  const [movie, setMovie] = useState({
    title: "",
    altTitle: "",
    year: "",
    duration: "",
    pitch: "",
    story: "",
    posterUrl: "",
    trailer: "",
    location: "",
    videoFormat: "",
    videoSupport: "",
    fileSize: "",
    idTheMovieDb: "",
  });

  // -----------------/ SOURCE /----------------- //

  const handleChangeMovieDb = (event) => {
    setMovie((prevMovie) => ({
      ...prevMovie,
      idTheMovieDb: event.target.value,
    }));
  };

  // -----------------/ RESET FORM /----------------- //
  const resetStates = () => {
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
  };

  // -----------------/ MOVIE INFO ENTRANCE MODAL /----------------- //

  const handleOpenModalMIE = () => {
    setOpenModalMIE(true);
  };

  const handleCloseModalMIE = () => {
    setOpenModalMIE(false);
  };

  // -----------------/ MOVIE ENTRANCE SEARCH & INSERT FUNC /----------------- //

  // GENRES SEARCH BY NAME METHOD
  const searchGenreInDatabase = async (genreName) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/genres/${encodeURIComponent(
          genreName
        )}`
      );

      if (response.status === 200 && response.data) {
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
    console.info("Creating genre in database:", genreName);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/genre`,
        { name: genreName }
      );

      if (response.status === 201 && response.data) {
        console.info("genre created:", response.data);
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
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/studio/byname/${encodeURIComponent(studioName)}`;
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
    console.info("Creating studio in database:", studioName);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/studio`,
        { name: studioName }
      );
      console.info("studio created:", response.data);
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
    console.info("Creating country in database:", countryName);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/country`,
        { name: countryName }
      );
      console.info("country created:", response.data);
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
    console.info("Creating language in database:", languageName);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/language`,
        { name: languageName }
      );
      console.info("language created:", response.data);
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
    console.info("Creating director in database:", directorName);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/director`,
        { name: directorName }
      );
      console.info("Director created:", response.data);
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
    console.info("Creating screenwriter in database:", screenwriterName);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/screenwriter`,
        { name: screenwriterName }
      );
      console.info("screenwriter created:", response.data);
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
    console.info("Creating compositor in database:", compositorName);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/compositor`,
        { name: compositorName }
      );
      console.info("compositor created:", response.data);
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
    console.info("Creating casting in database:", castingName);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/casting`,
        { name: castingName }
      );
      console.info("casting created:", response.data);
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
    console.info("Creating tag in database:", TagName);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tag`,
        { name: TagName }
      );
      console.info("tag created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error tag casting:", error);
      throw error;
    }
  };

  // -----------------/ MOVIE DATA FETCH /----------------- //

  const handleMovieClick = async (movieId) => {
    resetStates();
    try {
      const options = {
        method: "GET",
        url: `https://api.themoviedb.org/3/movie/${movieId}?language=fr-FR`,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
        },
      };

      const response = await axios(options);
      const movieData = response.data;

      setMovie({
        ...movie,
        title: movieData.title,
        altTitle:
          movieData.original_title !== movieData.title
            ? movieData.original_title
            : "",
        year: movieData.release_date.substring(0, 4),
        duration: movieData.runtime,
        pitch: movieData.tagline || "",
        story: movieData.overview,
        idTheMovieDb: movieData.id,
      });

      // Fetch GENRES
      const fetchGenre = async (genreName) => {
        const genreData = await searchGenreInDatabase(genreName);
        console.info("genreData:", genreData);
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
        url: `https://api.themoviedb.org/3/movie/${movieId}/credits?language=fr-FR`,
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
      const directorsData = await Promise.all(
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
          .filter((castMember) => castMember.order <= 5)
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
        url: `https://api.themoviedb.org/3/movie/${movieId}/videos?language=fr-FR`,
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

      // Fetch keywords (tags)
      const keywordsOptions = {
        method: "GET",
        url: `https://api.themoviedb.org/3/movie/${movieId}/keywords`,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
        },
      };

      const keywordsResponse = await axios(keywordsOptions);
      const keywordsData = keywordsResponse.data.keywords;

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
      console.info("posterUrl:", posterUrl);
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
      setvideoSupport("FICHIER MULTIMEDIA");
      setMovie((prevMovie) => ({
        ...prevMovie,
        location: event.target.value,
        videoFormat: fileExtension,
        videoSupport: "FICHIER MULTIMEDIA",
        fileSize: `${fileSizeInGigabytes.toFixed(2)} GB`,
      }));
    } else {
      alert("Veuillez sélectionner un fichier vidéo valide.");
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
      // console.info("setSelectedCoverFile in handleCoverChange :", file);
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

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Récupérer toutes les données sélectionnées
    const selectedGenre = selectedKinds.map((kind) => kind);
    const selectedDirectorsName = selectedDirectors.map(
      (director) => director.name
    );
    const selectedCastingName = selectedCasting.map((casting) => casting.name);
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
    };

    console.info("requestBody:", requestBody);

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

      alert("Le film a été ajouté avec succès !");
      resetStates(); // Réinitialiser les états du formulaire
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout du film. Veuillez réessayer.");
    }
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
    p: 4,
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
    p: 4,
    padding: 0,
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
              alignItems="center"
              gap={4}
              p={2}
            >
              <TextField
                name="year"
                value={movie.year}
                onChange={handleInputChange}
                id="filled-basic"
                label="Année"
                variant="outlined"
              />
              <TextField
                name="duration"
                value={movie.duration}
                onChange={handleInputChange}
                id="filled-basic"
                label="Durée"
                variant="outlined"
              />
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
            {/* movie TAG */}
            <div className="adm-l1_item">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "88ch" } }}
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
                color="primary"
              >
                VALIDER
              </Button>
            </Stack>
          </ThemeProvider>
        </section>
      </section>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
            onMovieClick={handleMovieClick}
            handleCloseModalMIE={handleCloseModalMIE}
          />
        </Box>
      </Modal>
    </main>
  );
}

export default AddNewMovie;
