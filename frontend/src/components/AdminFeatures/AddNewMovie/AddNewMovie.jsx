/* eslint-disable no-await-in-loop */
/* eslint-disable no-shadow */
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Container, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
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
import CloseIcon from "@mui/icons-material/Close";
import TransferList from "./MovieItemList";
import MovieInfosEntrance from "./MovieInfosEntrance";
import handleMovieClick from "../../../utils/handleMovieClick";
import {
  searchGenreInDatabase,
  createGenreInDatabase,
  createStudioInDatabase,
  searchStudioInDatabase,
  searchCountryInDatabase,
  createCountryInDatabase,
  searchLanguageInDatabase,
  createLanguageInDatabase,
  searchDirectorInDatabase,
  createDirectorInDatabase,
  searchScreenwriterInDatabase,
  createScreenwriterInDatabase,
  searchCompositorInDatabase,
  createCompositorInDatabase,
  searchCastingInDatabase,
  createCastingInDatabase,
  searchTagInDatabase,
  createTagInDatabase,
} from "../../../utils/movieEntranceSearchInsert";
import purgeOrphanRecords from "../../../utils/purgeOrphanRecords";
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
  useEffect(() => {
    console.info("data", data);
    console.info("movie", movie);
    console.info("isTvShow", movie.isTvShow);
  }, [data, movie.isTvShow]);

  //-----------------------------------------------
  // GESTION FOCUS
  //-----------------------------------------------

  //-----------------------------------------------
  // GESTION DES FIELDS SAISONS - EPISODES - DUREE
  //-----------------------------------------------

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
      setMovie((prev) => ({ ...prev, duration: "" }));
      return;
    }

    if (nbTvEpisodes > 0) {
      const total = nbTvEpisodes * movie.episodeDuration;
      setMovie((prev) => ({ ...prev, duration: total }));
    } else {
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
          name="tvSeasons"
          label="Saisons sélectionnées"
          value={tvSeasons || ""}
          onChange={(e) => {
            const { value } = e.target;
            setTvSeasons(value);
            setMovie((prev) => ({ ...prev, tvSeasons: value }));
          }}
          sx={{ flexGrow: 1 }}
        />
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
          sx={{ flexGrow: 1 }}
        />
        <TextField
          name="episodeDuration"
          type="number"
          label="Durée d’un épisode (min)"
          value={movie.episodeDuration || ""}
          onChange={(e) => {
            const value = Number(e.target.value);
            setMovie((prev) => {
              const newMovie = { ...prev, episodeDuration: value };
              if (nbTvEpisodes > 0) {
                newMovie.duration = nbTvEpisodes * value;
              }
              return newMovie;
            });
          }}
          InputProps={{ readOnly: isReadOnly }}
          sx={{ flexGrow: 1 }}
        />

        <TextField
          name="duration"
          label="Durée totale (minutes)"
          value={movie.duration || ""}
          InputProps={{ readOnly: true }}
          sx={{ flexGrow: 1 }}
        />
      </>
    );

    // --- Mode API ---
    if (seasonsInfo.length > 0) {
      return (
        <>
          <FormControl sx={{ flexGrow: 1 }}>
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
          sx={{ flexGrow: 1 }}
        />
        {renderEpisodeAndDurationFields()}
      </>
    );
  };

  //-----------------------------------------------
  // ANNULATION - RETOUR VERS ADMIN MOVIE LIST
  //-----------------------------------------------

  const navigate = useNavigate();

  const handleReturn = async () => {
    navigate("/admin_feat");
    // 🧹 Appeler la purge
    try {
      await purgeOrphanRecords(); // ✅ on attend que la purge se termine
      console.info("Purge exécutée avec succès après le reset.");
    } catch (error) {
      console.error("Erreur lors de la purge :", error);
    }
  };

  //-----------------------------------------------
  // SOURCE
  //-----------------------------------------------

  const handleChangeMovieDb = (event) => {
    setMovie((prevMovie) => ({
      ...prevMovie,
      idTheMovieDb: event.target.value,
    }));
  };

  //-----------------------------------------------
  // RESET FORM
  //-----------------------------------------------
  const resetStates = async (isTvShow = false, withPurge = true) => {
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

    // Réinitialiser les états du front
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

    // 🧹 Appeler la purge
    // 🧹 Purge conditionnelle
    if (withPurge) {
      try {
        await purgeOrphanRecords();
        console.info("Purge exécutée avec succès après le reset.");
      } catch (error) {
        console.error("Erreur lors de la purge :", error);
      }
    }
  };

  //-----------------------------------------------
  // MOVIE INFO ENTRANCE MODAL
  //-----------------------------------------------
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

  //-----------------------------------------------
  // ITEMS MODAL FETCH
  //-----------------------------------------------

  // --- FETCH DATA GENERIQUE ---
  const fetchData = async (route) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/${route}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const datas = await response.json();
      setData(datas);
    } catch (error) {
      console.error(`Error fetching ${route}:`, error);
    }
  };

  // --- HANDLER OUVERTURE MODAL ---
  const handleOpenModal = (type) => {
    setDataType(type);
    setOpenModal(true);
    fetchData(type);
  };

  // --- HANDLER FERMETURE MODAL ---
  const handleCloseModal = () => {
    setDataType("");
    setOpenModal(false);
    setData([]);
  };

  // --- GENERER LES NOMS
  const getSelectedNames = (items) => items.map((item) => item.name).join(", ");

  //-----------------------------------------------
  // INPUT FILE
  //-----------------------------------------------

  const fileInputRef = useRef(null); // Référence pour le fichier vidéo

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const cleanedPath = movie.path
      ? movie.path.replace(/^[A-Za-z]:[\\/]+/, "").replace(/[\\/]+$/, "")
      : "";
    const fullPath = cleanedPath ? `${cleanedPath}\\${file.name}` : file.name;

    const fileSizeGB = file.size / (1024 * 1024 * 1024);
    const fileSizeDisplay =
      fileSizeGB < 1
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${fileSizeGB.toFixed(2)} GB`;

    const ext = file.name.split(".").pop().toLowerCase();
    const validFormats = ["avi", "mkv", "mp4"];

    if (!validFormats.includes(ext)) {
      toast.warn("Veuillez sélectionner un fichier vidéo valide.");
      return;
    }

    setFormat(ext);
    setvideoSupport("Fichier multimédia");
    setFileSize(fileSizeDisplay); // valeur affichée locale

    setMovie((prev) => ({
      ...prev,
      location: fullPath,
      fileSize: fileSizeDisplay, // valeur dans l'objet movie
      videoFormat: ext,
      videoSupport: "Fichier multimédia",
    }));

    toast.success(`fichier "${fullPath}" chargé, ${fileSizeDisplay})`);
  };

  const handleFolderChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Filtrer uniquement les fichiers vidéo
    const videoExtensions = ["avi", "mkv", "mp4"];
    const videoFiles = files.filter((f) =>
      videoExtensions.includes(f.name.split(".").pop().toLowerCase())
    );

    if (videoFiles.length === 0) {
      toast.warn("Aucun fichier vidéo trouvé dans ce dossier.");
      return;
    }

    // Calcul du poids total
    const totalBytes = videoFiles.reduce((acc, file) => acc + file.size, 0);
    const totalGB = totalBytes / (1024 * 1024 * 1024);
    const totalSizeDisplay =
      totalGB < 1
        ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
        : `${totalGB.toFixed(2)} GB`;

    // Détermination du chemin commun de base
    const firstPath = videoFiles[0].webkitRelativePath; // ex: "MaSerie/S01/Episode1.mkv"
    const rootPath = firstPath.split("/")[0]; // => "MaSerie"

    console.info("firstPath", firstPath);
    console.info("rootPath", rootPath);

    // Mise à jour du state
    setFileSize(totalSizeDisplay);
    setMovie((prev) => ({
      ...prev,
      path: rootPath,
      location: rootPath, // chemin relatif principal
      videoSupport: "Fichier multimédia",
      fileSize: totalSizeDisplay,
    }));

    toast.success(
      `Dossier "${rootPath}" chargé (${videoFiles.length} vidéos, ${totalSizeDisplay})`
    );
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

  //-----------------------------------------------
  // INPUT COVER
  //-----------------------------------------------

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

  //-----------------------------------------------
  // POST NEW MOVIE
  //-----------------------------------------------

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
        handleReturn(); // Retour vers MovieItemList
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de l'ajout du film. 😱 Veuillez réessayer. ");
      } finally {
        setIsSubmitting(false); // Masque le Backdrop une fois terminé
      }
    } // end else
  }; // end handleFormSubmit

  //-----------------------------------------------
  // BUTTON STYLE
  //-----------------------------------------------

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

  //-----------------------------------------------
  // MODALS STYLE
  //-----------------------------------------------
  const transferListStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 0,
    pb: 4,
    px: 0,
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

  //-----------------------------------------------
  // RETURN
  //-----------------------------------------------
  return (
    <main>
      <section className="Adm_form_box">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={handleReturn}>
            <CloseIcon />
          </IconButton>
        </div>
        <section className="Adm_l0">
          <h1 className="AdM_main_title">ADD NEW MOVIE</h1>
          <div className="AdM_main_title_bar" />
          <section className="Adm_l1">
            <div className="Adm_l1a">
              {/* Control Admin Buttons */}
              <div className="SourceResearchItems">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleOpenModalMIE()}
                  sx={{ flexGrow: 0.5 }}
                >
                  RECHERCHE
                </Button>
                <div className="SourceResearchItems_2">
                  {/* isTvShow Switch */}
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
                  {/* resest feild button */}
                  <IconButton
                    onClick={() => resetStates()}
                    sx={{
                      color: "#ff9900",
                      "&:hover": {
                        color: "#00d9c0",
                        backgroundColor: "rgba(255, 170, 0, 0.1)",
                      },
                      border: "solid 1px grey",
                      alignSelf: "flex-end",
                    }}
                  >
                    <RestartAltIcon />
                  </IconButton>
                </div>
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
                  sx={{ flexGrow: 1 }}
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
                sx={{ flexGrow: 1 }}
                noValidate
                autoComplete="off"
                display="flex"
                flexDirection="column"
                gap={2}
                p={2}
              >
                <div
                  className={
                    movie.isTvShow
                      ? "year_duration_Btn_AddNewtvShow"
                      : "year_duration_Btn_AddNewMovie"
                  }
                >
                  {/* movie year */}
                  <TextField
                    name="year"
                    value={movie.year}
                    onChange={handleInputChange}
                    label="Année"
                    variant="outlined"
                    sx={{ flexGrow: 1 }}
                  />
                  {/* movie duration */}
                  {!movie?.isTvShow && (
                    <TextField
                      name="duration"
                      value={movie.duration}
                      onChange={handleInputChange}
                      label="Durée"
                      variant="outlined"
                      sx={{ flexGrow: 1 }}
                    />
                  )}
                  {/* Tv saison - epidsode - duration rendu la fonction renderTvSeasonEpisodeDurationFields */}
                  {movie?.isTvShow && renderTvSeasonEpisodeDurationFields()}
                </div>
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
              {/* movie idTheMovieDb */}
              <Box
                component="form"
                sx={{ width: "30%" }}
                noValidate
                autoComplete="off"
                display="flex"
                gap={2}
                p={2}
              >
                <TextField
                  id="filled-basic"
                  label="Id MovieDb"
                  variant="outlined"
                  placeholder="movie/12345 ou tv/12345"
                  sx={{ flexGrow: 1 }}
                  value={movie.idTheMovieDb}
                  onChange={handleChangeMovieDb}
                />
              </Box>
              {/* movie KINDS */}
              <div className="adm-l1_item">
                <Box
                  component="form"
                  sx={{ flexGrow: 1 }}
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
                    value={getSelectedNames(selectedKinds)}
                    InputProps={{ readOnly: true }}
                    fullWidth
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
                  sx={{ flexGrow: 1 }}
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                  gap={4}
                  p={2}
                >
                  {movie.isTvShow ? (
                    <TextField
                      id="outlined-read-only-input"
                      label="Créateur(s)"
                      value={getSelectedNames(selectedDirectors)}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  ) : (
                    <TextField
                      id="outlined-read-only-input"
                      label="Réalisateur(s)"
                      value={getSelectedNames(selectedDirectors)}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  )}
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
                  sx={{ flexGrow: 1 }}
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
                    value={getSelectedNames(selectedScreenwriters)}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
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
                  sx={{ flexGrow: 1 }}
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
                    value={getSelectedNames(selectedMusic)}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
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
                  sx={{ flexGrow: 1 }}
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
                    value={getSelectedNames(selectedCasting)}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
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
                  sx={{ flexGrow: 1 }}
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
                    value={getSelectedNames(selectedStudios)}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
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
                  sx={{ flexGrow: 1 }}
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
                    value={getSelectedNames(selectedCountries)}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
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
                  sx={{ flexGrow: 1 }}
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
                    value={getSelectedNames(selectedLanguages)}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
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
                  sx={{ flexGrow: 1 }}
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
                    value={getSelectedNames(selectedTags)}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                </Box>
                <AddCircleOutlineIcon
                  className="Btn_Add_itemsPopUp"
                  onClick={() => handleOpenModal("tags/sorted_id")}
                />
              </div>
            </div>
          </section>
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
                      <InputLabel>format</InputLabel>
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
                    />
                  </Box>
                </div>
                {/* movie LOCAL PATH */}
                {movie.isTvShow ? (
                  <>
                    {/* Sélection d’un dossier complet */}
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      p={1}
                      sx={{ flexGrow: 1 }}
                    >
                      <TextField
                        label="Dossier sélectionné"
                        variant="outlined"
                        value={movie.path || ""}
                        InputProps={{ readOnly: true }}
                        fullWidth
                      />

                      {/* Input caché pour sélectionner un dossier */}
                      <input
                        type="file"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        webkitdirectory="true"
                        multiple
                        onChange={handleFolderChange}
                      />

                      <Button
                        variant="outlined"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Sélectionner un dossier
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box
                    component="form"
                    sx={{ flexgrow: 1 }}
                    noValidate
                    autoComplete="off"
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    p={1}
                  >
                    {/* Champ pour le chemin du dossier */}
                    <TextField
                      label="Chemin du dossier"
                      variant="outlined"
                      value={movie.path || ""}
                      onChange={(e) => {
                        const userPathInput = e.target.value;
                        const cleanedPath = userPathInput
                          .replace(/^[A-Za-z]:[\\/]+/, "")
                          .replace(/[\\/]+$/, "");

                        setMovie((prev) => ({
                          ...prev,
                          path: userPathInput,
                          location: selectedFile
                            ? `${cleanedPath}\\${selectedFile.name}`
                            : "",
                        }));
                      }}
                      fullWidth
                    />
                    {/* Sélection d’un fichier unique */}{" "}
                    <TextField
                      label="Fichier sélectionné"
                      variant="outlined"
                      value={selectedFile ? selectedFile.name : ""}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                    <Button
                      variant="outlined"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.click();
                        } else {
                          console.warn(
                            "fileInputRef is not attached to any input element"
                          );
                        }
                      }}
                    >
                      Sélectionner un fichier vidéo
                    </Button>
                    {/* Input caché pour le vrai fichier */}
                    <input
                      type="file"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </Box>
                )}

                <FormControl sx={{ m: 1 }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    version:
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
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
      {/* transfert Lists */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={transferListStyle}>
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
            {openModal && dataType && (
              <TransferList
                dataType={dataType}
                items={data || []}
                selectedKinds={selectedKinds}
                onSelectedKindsUpdate={setSelectedKinds}
                selectedDirectors={selectedDirectors}
                onSelectedDirectorsUpdate={setSelectedDirectors}
                selectedScreenwriters={selectedScreenwriters}
                onSelectedScreenwritersUpdate={setSelectedScreenwriters}
                selectedMusic={selectedMusic}
                onSelectedMusicUpdate={setSelectedMusic}
                selectedCasting={selectedCasting}
                onSelectedCastingUpdate={setSelectedCasting}
                selectedStudios={selectedStudios}
                onSelectedStudiosUpdate={setSelectedStudios}
                selectedCountries={selectedCountries}
                onSelectedCountriesUpdate={setSelectedCountries}
                selectedLanguages={selectedLanguages}
                onSelectedLanguagesUpdate={setSelectedLanguages}
                selectedTags={selectedTags}
                onSelectedTagsUpdate={setSelectedTags}
              />
            )}
          </Container>
        </Box>
      </Modal>
      {/* MIE modal */}
      <Modal
        open={openModalMIE}
        onClose={handleCloseModalMIE}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleMIEmodal}>
          <MovieInfosEntrance
            title={movie.title}
            onMovieClick={(id, type) =>
              handleMovieClick(id, type, {
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
              })
            }
            handleCloseModalMIE={handleCloseModalMIE}
          />
        </Box>
      </Modal>
    </main>
  );
}

export default AddNewMovie;
