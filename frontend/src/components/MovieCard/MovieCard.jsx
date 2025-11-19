/* eslint-disable react/no-unknown-property */
/* eslint-disable no-alert */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./movieCard.css";
import "./movieCardMediaQueries.css";
import "./movieCard_videoPlayer_MediaQueries.css";
import ReactPlayer from "react-player";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import Alert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import ModeIcon from "@mui/icons-material/Mode";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import UndoIcon from "@mui/icons-material/Undo";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CachedIcon from "@mui/icons-material/Cached";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import TransferList from "../AdminFeatures/AddNewMovie/MovieItemList";
import {
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
} from "../../utils/refetchMovieTMDB";
import purgeOrphanRecords from "../../utils/purgeOrphanRecords";
import {
  searchGenreInDatabase,
  createGenreInDatabase,
  createStudioInDatabase,
  searchStudioInDatabase,
  searchCountryInDatabase,
  createCountryInDatabase,
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
} from "../../utils/movieEntranceSearchInsert";

function MovieCard({
  movie,
  origin,
  homepage,
  closeModal,
  onUpdateMovie,
  onDeleteMovie,
}) {
  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;
  const [isModify, setIsModify] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const [selectedKinds, setSelectedKinds] = useState([]);
  const [selectedDirectors, setSelectedDirectors] = useState([]);
  const [selectedCasting, setSelectedCasting] = useState([]);
  const [selectedScreenwriters, setSelectedScreenwriters] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState([]);
  const [selectedStudios, setSelectedStudios] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [version, setVersion] = useState(
    movie.vostfr ? "VOSTFR" : movie.multi ? "MULTI" : "none"
  );
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFocus, setSelectedFocus] = useState([]);
  const [trailerMessage, setTrailerMessage] = useState("");

  // Datas dans le front
  const [movieData, setMovieData] = useState({
    id: movie.id || "",
    title: movie.title || "",
    altTitle: movie.altTitle || "",
    year: movie.year || "",
    duration: movie.duration || "",
    videoSupport:
      movie.videoSupport === "Fichier multimédia"
        ? "FICHIER MULTIMEDIA"
        : movie.videoSupport || "",
    multi: movie.multi || 0,
    vostfr: movie.vostfr || 0,
    story: movie.story || "",
    location: movie.location || "",
    fileSize: movie.fileSize || "",
    comment: movie.comment || "",
    isTvShow: movie.isTvShow || "",
    tvSeasons: movie.tvSeasons || "",
    nbTvEpisodes: movie.nbTvEpisodes || "",
    episodeDuration: movie.episodeDuration || "",
    idTheMovieDb: movie.idTheMovieDb || "",
  });

  useEffect(() => {
    console.info("movie in MovieCard", movie);
  }, [movie]);

  useEffect(() => {
    console.info("movieData1 in MovieCard", movieData);
  }, [movieData]);

  console.info("selectedTags", selectedTags);

  const {
    genres,
    countries,
    directors,
    screenwriters,
    music,
    studios,
    casting,
    tags,
    focus,
  } = movieData;

  const { idTheMovieDb } = movie;
  const isTvShow = movieData.isTvShow === 1;
  const tvSeason = movieData.tvSeasons;
  const safeValue = (val) => val ?? "";

  //-----------------------------------------------
  // UX FIELDS
  //-----------------------------------------------

  const textFieldSx = {
    width: "80%",
    "& .MuiInputLabel-root": {
      color: "white",
    },
    "& .MuiInputBase-input": {
      color: "white",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "orange",
      },
      "&.Mui-focused fieldset": {
        borderColor: "cyan",
      },
    },
  };

  //-----------------------------------------------
  // FETCH MOVIE DATAS from backend
  //-----------------------------------------------
  const fetchMovieData = () => {
    if (origin === "country") {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/movies/${movie.movieId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setMovieData(data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/movies/${movieData.id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setMovieData(data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  };

  useEffect(() => {
    fetchMovieData();
  }, [movie.id, movieData.id]);

  useEffect(() => {
    setMovieData(movie);
  }, [movie]);

  //-----------------------------------------------
  // TRAILER
  //-----------------------------------------------

  const [isTrailerVisible, setIsTrailerVisible] = useState(false);
  const [isTrailerLoading, setIsTrailerLoading] = useState(false);

  const toggleTrailerVideo = () => {
    setIsTrailerVisible(!isTrailerVisible);
    setIsTrailerLoading(true); // Active le chargement lors de l'ouverture du trailer
  };

  const handleTrailerReady = () => {
    setIsTrailerLoading(false); // Cache le loader quand la vidéo est prête
  };

  //-----------------------------------------------
  // MODIFY MODE - modifier champs TextField
  //-----------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "idTheMovieDb" && value && !/^(movie|tv)\/\d*$/.test(value)) {
      return; // ignore les caractères invalides pendant la saisie
    }

    setMovieData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //-----------------------------------------------
  // MODIFY MODE - modifier  VOSTFR MULTI
  //-----------------------------------------------

  const handleVersionChange = (event) => {
    const selectedVersion = event.target.value;
    setVersion(selectedVersion);

    // Met à jour movieData en fonction de la version sélectionnée
    setMovieData((prevData) => ({
      ...prevData,
      vostfr: selectedVersion === "VOSTFR" ? 1 : 0,
      multi: selectedVersion === "MULTI" ? 1 : 0,
    }));
  };

  //-----------------------------------------------
  // MODIFY MODE - MODIFICATION DE L'AFFICHE
  //-----------------------------------------------

  const [image, setImage] = useState(`${backendUrl}/images/${movie.cover}`);
  const [showUploadButton, setShowUploadButton] = useState(true);
  const [showImageButton, setShowImageButton] = useState(true);
  const fileCoverRef = useRef(null);

  useEffect(() => {
    if (isModify) {
      // Lorsque le mode modification est activé, réinitialiser l'affichage du bouton d'upload
      if (image === `${backendUrl}/images/${movie.cover}`) {
        setShowUploadButton(true); // Si l'image n'a pas été changée, montrer l'icône d'upload
      } else {
        setShowUploadButton(false); // Si l'image a été modifiée, montrer l'icône de reset
      }
      // console.info("image", image);
    }
  }, [isModify, image, movie.cover, backendUrl]);

  // Handle Cover Upload
  const handleCoverUpload = (event) => {
    const file = event.target.files[0];
    const newImageUrl = URL.createObjectURL(file);
    console.info("newImageUrl", newImageUrl);
    setImage(newImageUrl);
    setShowUploadButton(false); // Après le choix d'une image, afficher le bouton de reset
  };

  const handleUploadClick = () => {
    fileCoverRef.current.click();
  };

  const handleResetImage = () => {
    setImage(`${backendUrl}/images/${movie.cover}`); // Remettre l'image d'origine
    setShowUploadButton(true); // Remettre l'icône d'upload
  };

  // Update Affiche
  const handleUpdateImage = async () => {
    const fileInput = fileCoverRef.current;
    const file = fileInput.files[0];

    if (file) {
      const imageData = new FormData();
      imageData.append("cover", file);

      const imageResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/${origin}/${movie.id}/image`,
        {
          method: "PUT",
          body: imageData,
        }
      );

      if (imageResponse.ok) {
        const { movie: updatedMovie } = await imageResponse.json();
        setImage(`${backendUrl}/images/${updatedMovie.cover}`); // Utiliser la nouvelle URL de l'image
        console.info("Image successfully updated", updatedMovie.cover);
      } else {
        console.error("Error updating item image");
      }
    }
  };

  //-----------------------------------------------
  // GESTION DES FIELDS SAISONS - EPISODES - DUREE
  //-----------------------------------------------

  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [seasonsInfo, setSeasonsInfo] = useState([]);
  const [tvSeasons, setTvSeasons] = useState(movieData.tvSeasons || "");
  const [nbTvEpisodes, setNbTvEpisodes] = useState(movieData.nbTvEpisodes || 0);

  // Parse tvSeasons de movieData dès le mode modify
  useEffect(() => {
    if (!isModify || !isTvShow) return;

    // On attend que movieData.tvSeasons soit défini (et non vide)
    if (!movieData.tvSeasons) return;

    const parsed = movieData.tvSeasons
      .split(",") // ex: "1-3,5"
      .map((block) => block.trim())
      .flatMap((block) => {
        if (block.includes("-")) {
          const [start, end] = block.split("-").map(Number);
          return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }
        return [Number(block)];
      });

    setSelectedSeasons(parsed);
  }, [isModify, isTvShow, movieData.tvSeasons]);

  // Récupération des infos season episodes TMDB
  useEffect(() => {
    if (isModify && isTvShow && idTheMovieDb) {
      setSeasonsInfo([]); // nettoie avant fetch

      const fetchSeasonsInfo = async () => {
        try {
          const [mediaType, movieId] = idTheMovieDb.split("/");

          const options = {
            method: "GET",
            url: `https://api.themoviedb.org/3/${mediaType}/${movieId}?language=fr-FR`,
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
            },
          };

          const res = await axios.request(options);

          if (res.data && res.data.seasons) {
            setSeasonsInfo(
              res.data.seasons
                .filter((s) => s.season_number > 0)
                .map((s) => ({
                  season_number: s.season_number,
                  episode_count: s.episode_count,
                }))
            );
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des saisons TMDB :",
            error.response?.status,
            error.response?.data || error
          );
        }
      };

      fetchSeasonsInfo();
    }
  }, [isModify, isTvShow, idTheMovieDb]);

  // Mise à jour du nombre total d’épisodes
  useEffect(() => {
    if (!isTvShow) return;

    if (!Array.isArray(selectedSeasons) || selectedSeasons.length === 0) {
      setNbTvEpisodes(0);
      setMovieData((prev) => ({ ...prev, nbTvEpisodes: 0 }));
      return;
    }

    const totalEpisodes = selectedSeasons.reduce((sum, seasonNumber) => {
      const season = seasonsInfo.find((s) => s.season_number === seasonNumber);
      return sum + (season ? season.episode_count : 0);
    }, 0);

    setNbTvEpisodes(totalEpisodes);
    setMovieData((prev) => ({ ...prev, nbTvEpisodes: totalEpisodes }));
  }, [selectedSeasons, seasonsInfo, isTvShow]);

  // Mise à jour de la durée totale
  useEffect(() => {
    if (!isTvShow) return;

    if (!movieData.episodeDuration || movieData.episodeDuration === 0) {
      setMovieData((prev) => ({ ...prev, duration: "" }));
      return;
    }

    if (nbTvEpisodes > 0) {
      const total = nbTvEpisodes * movieData.episodeDuration;
      setMovieData((prev) => ({ ...prev, duration: total }));
    } else {
      setMovieData((prev) => ({ ...prev, duration: "" }));
    }
  }, [nbTvEpisodes, movieData.episodeDuration, isTvShow]);

  // Mise à jour automatique de tvSeasons selon les saisons sélectionnées
  useEffect(() => {
    if (!isTvShow) return;

    if (!Array.isArray(selectedSeasons) || selectedSeasons.length === 0) {
      setTvSeasons("");
      setMovieData((prev) => ({ ...prev, tvSeasons: "" }));
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
    setMovieData((prev) => ({ ...prev, tvSeasons: displayValue }));
  }, [selectedSeasons, isTvShow]);

  // fonction de rendu des items TV seasons - episodes - duration
  const renderTvShowFields = () => {
    const renderEpisodeDurationFields = () => (
      <>
        <TextField
          name="tvSeasons"
          label="Saisons sélectionnées"
          value={tvSeasons}
          onChange={(e) => {
            const { value } = e.target;
            setTvSeasons(value);
            setMovieData((prev) => ({ ...prev, tvSeasons: value }));
          }}
          sx={textFieldSx}
        />
        <TextField
          name="nbTvEpisodes"
          label="Nombre d’épisodes"
          type="number"
          value={nbTvEpisodes || ""}
          onChange={(e) => {
            const value = Number(e.target.value);
            setNbTvEpisodes(value);
            setMovieData((prev) => ({ ...prev, nbTvEpisodes: value }));
          }}
          sx={textFieldSx}
        />
        <TextField
          name="episodeDuration"
          label="Durée d’un épisode (min)"
          type="number"
          value={movieData.episodeDuration || ""}
          onChange={(e) => {
            const value = Number(e.target.value);
            setMovieData((prev) => {
              const updated = { ...prev, episodeDuration: value };
              if (nbTvEpisodes > 0) {
                updated.duration = nbTvEpisodes * value;
              }
              return updated;
            });
          }}
          sx={textFieldSx}
        />
        <TextField
          name="duration"
          label="Durée totale (minutes)"
          value={movieData.duration || ""}
          InputProps={{ readOnly: true }}
          sx={textFieldSx}
        />
      </>
    );

    if (seasonsInfo.length > 0) {
      return (
        <>
          <div className="divider" />
          <FormControl sx={textFieldSx}>
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
              }}
              input={<OutlinedInput label="Saisons" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {seasonsInfo.map((season) => (
                <MenuItem
                  key={season.season_number}
                  value={season.season_number}
                >
                  <Checkbox
                    checked={
                      Array.isArray(selectedSeasons) &&
                      selectedSeasons.includes(season.season_number)
                    }
                  />
                  <ListItemText
                    primary={`Saison ${season.season_number} (${season.episode_count} épisodes)`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {renderEpisodeDurationFields()}
        </>
      );
    }

    return renderEpisodeDurationFields();
  };

  //-----------------------------------------------
  // INPUT FILE
  //-----------------------------------------------
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!movieData) return;

    const support = movieData.videoSupport?.toLowerCase() || "";

    // 🎬 Cas 1 : Fichier unique (film ou équivalent)
    if (
      !movieData.isTvShow &&
      support.includes("fichier multimédia") &&
      movieData.location &&
      !movieData.path
    ) {
      // On déduit le chemin et le nom de fichier à partir du chemin complet
      const segments = movieData.location.split("\\");
      const filename = segments.pop();
      const folderPath = segments.join("\\");

      setMovieData((prev) => ({
        ...prev,
        path: folderPath || prev.path || "",
        location: filename || prev.location || "",
      }));
    }

    // 📺 Cas 2 : Série TV (dossier complet)
    if (
      movieData.isTvShow &&
      support.includes("fichier multimédia") &&
      !movieData.path
    ) {
      // Si le path n’est pas défini, on essaie de le déduire du nom de la série
      const folderName =
        movieData.title?.replace(/[^\w\s]/g, "").trim() ||
        "Série non identifiée";

      setMovieData((prev) => ({
        ...prev,
        path: prev.path || folderName,
        location: prev.location || folderName,
      }));
    }
  }, [movieData?.id]);

  // 🎬 Gestion fichier unique (film)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const extension = file.name.split(".").pop().toLowerCase();
    const validFormats = ["avi", "mkv", "mp4"];

    if (!validFormats.includes(extension)) {
      toast.warn(
        "Veuillez sélectionner un fichier vidéo valide (avi, mkv, mp4)."
      );
      return;
    }

    const sizeGB = file.size / (1024 * 1024 * 1024);

    setMovieData((prev) => ({
      ...prev,
      location: file.name,
      path: "",
      videoFormat: extension,
      videoSupport: "Fichier multimédia",
      fileSize: `${sizeGB.toFixed(2)} GB`,
    }));

    toast.success(`Fichier "${file.name}" chargé (${sizeGB.toFixed(2)} GB)`);
  };

  // 📁 Gestion dossier complet (série)
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
    const firstPath = videoFiles[0].webkitRelativePath;
    const rootPath = firstPath.split("/")[0];

    // ✅ Mise à jour partielle et sûre
    setMovieData((prev) => ({
      ...prev,
      path: rootPath,
      location: rootPath, // chemin relatif principal
      videoSupport: "Fichier multimédia",
      fileSize: totalSizeDisplay,
      isTvShow: true, // au cas où ce ne serait pas déjà vrai
    }));

    toast.success(
      `📁 Dossier "${rootPath}" chargé (${videoFiles.length} vidéos, ${totalSizeDisplay})`
    );
  };

  const handleFormatSupportChange = (event) => {
    const newSupport = event.target.value;

    setMovieData((prevData) => {
      // Si le support sélectionné est "DVD original" ou "DVD R/RW"
      if (newSupport === "DVD original" || newSupport === "DVD R/RW") {
        return {
          ...prevData,
          videoSupport: newSupport,
          location: "", // Réinitialise location
          videoFormat: "", // Réinitialise videoFormat
          fileSize: "", // Réinitialise fileSize
          vostfr: 0,
          multi: 0,
        };
      }
      // Sinon, on met juste à jour videoSupport
      return {
        ...prevData,
        videoSupport: newSupport,
      };
    });
  };

  //-----------------------------------------------
  // TRANSFERT LIST
  //-----------------------------------------------
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState("");

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

  // FONCTION GÉNÉRIQUE FETCH DE LISTE
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

  // MODAL HANDLERS
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

  // FONCTION GÉNÉRIQUE FETCH PAR NOM
  const fetchByNames = async (namesString, endpoint, setter) => {
    if (!namesString) return;
    try {
      const namesArray = namesString.split(", ").map(async (name) => {
        try {
          const response = await fetch(
            `${backendUrl}/api/${endpoint}/byname/${name}`
          );
          if (!response.ok) {
            console.warn(
              `Error fetching ${endpoint} ${name}: ${response.statusText}`
            );
            return null;
          }
          return await response.json();
        } catch (err) {
          console.warn(`Error fetching ${endpoint} ${name}:`, err);
          return null;
        }
      });

      const result = (await Promise.all(namesArray)).filter(Boolean);
      setter(result);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };

  // FONCTION GÉNÉRIQUE POUR NOMS
  const getSelectedNames = (list) => list.map((item) => item.name).join(", ");

  // UTILITAIRE POUR CRÉER UN HOOK DE FETCH AUTOMATIQUE
  const useAutoFetch = (value, endpoint, setter) => {
    useEffect(() => {
      fetchByNames(value, endpoint, setter);
    }, [value]);
  };

  // UTILISATION POUR CHAQUE TYPE
  useAutoFetch(genres, "kind", setSelectedKinds);
  useAutoFetch(directors, "director", setSelectedDirectors);
  useAutoFetch(casting, "casting", setSelectedCasting);
  useAutoFetch(screenwriters, "screenwriter", setSelectedScreenwriters);
  useAutoFetch(music, "music", setSelectedMusic);
  useAutoFetch(studios, "studio", setSelectedStudios);
  useAutoFetch(countries, "country", setSelectedCountries);
  useAutoFetch(tags, "tags", setSelectedTags);
  useAutoFetch(focus, "focus", setSelectedFocus);

  // HANDLERS POUR CHAQUE TYPE
  const handleSelectedKindsUpdate = setSelectedKinds;
  const handleSelectedDirectorsUpdate = setSelectedDirectors;
  const handleSelectedCastingUpdate = setSelectedCasting;
  const handleSelectedScreenwritersUpdate = setSelectedScreenwriters;
  const handleSelectedMusicUpdate = setSelectedMusic;
  const handleSelectedStudiosUpdate = setSelectedStudios;
  const handleSelectedCountriesUpdate = setSelectedCountries;
  const handleSelectedTagsUpdate = setSelectedTags;
  const handleSelectedFocusUpdate = setSelectedFocus;

  //-----------------------------------------------
  // UPDATE MODE
  //-----------------------------------------------

  const isModifyMode = () => {
    setIsModify(true);
  };

  const closeModifyMode = () => {
    purgeOrphanRecords(); // purger les données orphelines (souci avec l'affiche qui disparait)

    setIsModify(false);
  };

  const handleUndo = () => {
    fetchMovieData(); // recharge les infos du film
    setImage(`${backendUrl}/images/${movie.cover}`);

    // re-fetch des listes sélectionnées via la fonction générique
    fetchByNames(genres, "kind", setSelectedKinds);
    fetchByNames(directors, "director", setSelectedDirectors);
    fetchByNames(casting, "casting", setSelectedCasting);
    fetchByNames(screenwriters, "screenwriter", setSelectedScreenwriters);
    fetchByNames(music, "music", setSelectedMusic);
    fetchByNames(studios, "studio", setSelectedStudios);
    fetchByNames(countries, "country", setSelectedCountries);
    fetchByNames(tags, "tags", setSelectedTags);
    fetchByNames(focus, "focus", setSelectedFocus);

    closeModifyMode();
  };

  //-----------------------------------------------
  // UPDATE MOVIE
  //-----------------------------------------------
  const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOpenUpdateConfirm = () => setIsConfirmUpdateOpen(true);
  const handleCloseUpdateConfirm = () => setIsConfirmUpdateOpen(false);

  const handleUpdateMovie = async () => {
    setIsConfirmUpdateOpen(false);

    setIsUpdating(true); // Affiche le Backdrop

    try {
      // Mettre à jour l'image (s'il y a un fichier sélectionné)
      if (fileCoverRef.current.files[0]) {
        await handleUpdateImage(); // Attendre que l'image soit mise à jour avant de poursuivre
        // console.info("Image successfully updated");
      }

      // Mettre à jour les autres informations du film
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/movie/${movieData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: movieData.title,
            altTitle: movieData.altTitle,
            year: movieData.year,
            duration: movieData.duration || null,
            trailer: movieData.trailer,
            story: movieData.story,
            location: movieData.location,
            videoFormat: movieData.videoFormat,
            videoSupport: movieData.videoSupport,
            fileSize: movieData.fileSize,
            vostfr: movieData.vostfr,
            multi: movieData.multi,
            comment: movieData.comment,
            genres: selectedKinds.map((genre) => genre.id),
            directors: selectedDirectors.map((director) => director.id),
            castings: selectedCasting.map((cast) => cast.id),
            screenwriters: selectedScreenwriters.map(
              (screenwriter) => screenwriter.id
            ),
            musics: selectedMusic.map((compositor) => compositor.id),
            studios: selectedStudios.map((studio) => studio.id),
            countries: selectedCountries.map((country) => country.id),
            tags: selectedTags.map((tag) => tag.id),
            focus: selectedFocus.map((f) => f.id),
            isTvShow: movieData.isTvShow,
            tvSeasons: movieData.tvSeasons || null,
            nbTvEpisodes: movieData.nbTvEpisodes || null,
            episodeDuration: movieData.episodeDuration || null,
            idTheMovieDb: movieData.idTheMovieDb,
          }),
        }
      );

      if (response.ok) {
        toast.success("Film mis à jour avec succès");
        console.info("Film mis à jour avec succès");
        const updatedMovie = await response.json();
        const newMovie = Array.isArray(updatedMovie)
          ? updatedMovie[0]
          : updatedMovie;
        console.info("updatedMovie", updatedMovie);
        setMovieData(newMovie);
        onUpdateMovie(newMovie);
        closeModifyMode();
        // closeModal();
        if (typeof closeModal === "function") closeModal();
      } else {
        console.error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du film et de l'image",
        error
      );
    } finally {
      setIsUpdating(false); // Masque le Backdrop une fois terminé
    }
  };

  // DELETE MOVIE

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [movieIdToDelete, setMovieIdToDelete] = useState(null);

  const handleOpenDeleteConfirm = (id) => {
    setMovieIdToDelete(id); // Stocke l'ID du film à supprimer
    setIsConfirmDeleteOpen(true); // Ouvre le dialogue
  };

  const handleCloseDeleteConfirm = () => {
    setIsConfirmDeleteOpen(false);
    setMovieIdToDelete(null); // Réinitialise l'ID du film
  };

  const handleDeleteMovie = async () => {
    if (!movieIdToDelete) return; // Vérifie si un ID est bien défini

    console.info("Tentative de suppression du film avec ID:", movieIdToDelete);
    setIsConfirmDeleteOpen(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/movie/${movieData.id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        toast.info("Film supprimé avec succès");
        console.info("Film supprimé avec succès");
        onDeleteMovie(movieData.id); // Appeler la fonction de rappel
        closeModal();
      } else {
        toast.error("Erreur lors de la suppression du film");
        console.error(
          "Erreur lors de la suppression du film",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Erreur durant la suppression:", error);
    }
  };

  //-----------------------------------------------
  // RETURN
  //-----------------------------------------------

  return (
    <article className="MovieCard">
      <div className="MovieCard_container">
        <section className="MC_line1">
          {/* COVER BLOCK */}
          <div className="MovieCard_Cover_Position">
            <img
              className="MovieCard_cover"
              src={image}
              alt={`Cover ${movieData.title}`}
            />
            {isModify && (
              <>
                <input
                  type="file"
                  name="cover"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  ref={fileCoverRef}
                  style={{ display: "none" }}
                />

                {/* Cover Boutons Upload / Reset */}
                {showImageButton && (
                  <div className="movie_cover_modify_buttons_wrapper">
                    <div className="movie_cover_modify_button">
                      {showUploadButton ? (
                        // cover upload btn
                        <Button
                          variant="outlined"
                          sx={{
                            color: "var(--color-03)",
                            borderColor: "var(--color-03)",
                            transition: "all 0.2s ease-in-out",
                            borderRadius: "10px",
                            "&:hover": {
                              borderColor: "var(--color-06)",
                              color: "var(--color-06)",
                              transform: "scale(1.02)",
                            },
                          }}
                          onClick={handleUploadClick}
                        >
                          <FileUploadIcon />
                        </Button>
                      ) : (
                        // cover reset btn
                        <Button
                          variant="outlined"
                          sx={{
                            color: "var(--color-01)",
                            borderColor: "var(--color-01)",
                            transition: "all 0.2s ease-in-out",
                            borderRadius: "10px",
                            "&:hover": {
                              borderColor: "var(--color-06)",
                              color: "var(--color-06)",
                              transform: "scale(1.02)",
                            },
                          }}
                          onClick={handleResetImage}
                        >
                          <CachedIcon />
                        </Button>
                      )}
                    </div>

                    {idTheMovieDb && (
                      // cover TMDB Sync btn
                      <div className="movie_cover_modify_button">
                        <Button
                          variant="outlined"
                          sx={{
                            color: "var(--color-02)",
                            borderColor: "var(--color-02)",
                            transition: "all 0.2s ease-in-out",
                            borderRadius: "10px",
                            "&:hover": {
                              borderColor: "var(--color-06)",
                              color: "var(--color-06)",
                              transform: "scale(1.02)",
                            },
                          }}
                          onClick={() => {
                            const confirmReplace = window.confirm(
                              "Êtes-vous sûr de vouloir remplacer définitivement l'image ?"
                            );
                            if (confirmReplace) {
                              refetchMovieCoverFromTMDB(idTheMovieDb, {
                                movieId: movieData.id,
                                setImage,
                                setShowImageButton,
                              });
                            }
                          }}
                        >
                          <CloudSyncIcon />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                <div className="divider divider_movie_cover_modify_button" />
              </>
            )}
          </div>
          {/* END COVER BLOCK */}

          {/* INFO BLOCK 1 */}
          {isModify ? (
            // BLOCK 1 MODIFY MODE
            <div className="infos_bloc_1_modify">
              {/* Line ICO type + general Refresh button (modify) */}
              <div className="movieCard_Type_Line">
                {/* ICO movie or tvShow type (modify) */}
                {!isTvShow ? (
                  <MovieOutlinedIcon
                    sx={{ color: "white", mr: 1 }}
                    fontSize="large"
                  />
                ) : (
                  <TvOutlinedIcon sx={{ color: "white" }} fontSize="large" />
                )}
                {/* ENd ICO movie or tvShow type (modify) */}

                {/* Bouton TMDB synchro général (modify) */}
                {idTheMovieDb && (
                  <Button
                    variant="outlined"
                    sx={{
                      color: "var(--color-02)",
                      borderColor: "var(--color-02)",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        borderColor: "var(--color-03)",
                        color: "var(--color-03)",
                        transform: "scale(1.02)",
                      },
                    }}
                    onClick={() => {
                      const confirmReload = window.confirm(
                        "⚠️ Êtes-vous sûr de vouloir recharger les informations du film ?\nLes données actuelles seront remplacées."
                      );
                      if (confirmReload) {
                        refetchMovieTMDB(idTheMovieDb, {
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
                          setImage,
                          setShowUploadButton,
                          setShowImageButton,
                        });
                      }
                    }}
                  >
                    <CloudSyncIcon sx={{ mr: 1 }} /> Recharger les infos
                  </Button>
                )}
                {/* END Bouton TMDB synchro général (modify) */}
              </div>
              {/* ENd Line ICO type + general Refresh button (modify) */}
              <div className="divider divider_movie_cover_modify_button2" />
              {/* Title (modify) */}
              <div className="box_item_form">
                <TextField
                  label="Title"
                  name="title"
                  value={safeValue(movieData.title)}
                  onChange={(e) => handleChange(e)}
                  // InputProps={{ readOnly: true }}
                  fullWidth
                  sx={textFieldSx}
                />
              </div>
              {/* END Title (modify) */}
              <div className="divider" />
              {/* focus (modify) */}
              <div className="box_item_form">
                <Box
                  component="form"
                  sx={textFieldSx}
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                >
                  <TextField
                    id="outlined-read-only-input"
                    label="Focus"
                    value={getSelectedNames(selectedFocus)}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Box>
                <AddCircleOutlineIcon
                  className="Btn_Add_itemsPopUp_MovieCard"
                  onClick={() => handleOpenModal("focus")}
                />
              </div>
              <div className="divider" />
              {/* END focus (modify) */}
              {/* Alt Title (modify) */}
              <div className="box_item_form">
                <TextField
                  label="Alt Title"
                  name="altTitle"
                  value={safeValue(movieData.altTitle)}
                  onChange={(e) => handleChange(e)}
                  fullWidth
                  sx={textFieldSx}
                />
                {idTheMovieDb && (
                  <CloudSyncIcon
                    className="Btn_Refresh_items_MovieCard"
                    onClick={() =>
                      refetchAltTitle(idTheMovieDb, { movieData, setMovieData })
                    }
                  />
                )}
              </div>
              {/* END Alt Title (modify) */}
              {/* Genre(s) (modify) */}
              <div className="box_item_form">
                <Box
                  component="form"
                  sx={textFieldSx}
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
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
                  className="Btn_Add_itemsPopUp_MovieCard"
                  onClick={() => handleOpenModal("kinds")}
                />
                {idTheMovieDb && (
                  <CloudSyncIcon
                    className="Btn_Refresh_items_MovieCard"
                    onClick={() =>
                      refetchGenres(idTheMovieDb, {
                        searchGenreInDatabase,
                        createGenreInDatabase,
                        setSelectedKinds,
                      })
                    }
                  />
                )}
              </div>
              {/* END Genre(s) (modify) */}
              {/* Year (modify) */}
              <div className="box_item_form">
                <TextField
                  label="Year"
                  name="year"
                  value={safeValue(movieData.year)}
                  onChange={(e) => handleChange(e)}
                  fullWidth
                  type="number"
                  sx={textFieldSx}
                />
                {idTheMovieDb && (
                  <CloudSyncIcon
                    className="Btn_Refresh_items_MovieCard"
                    onClick={() =>
                      refetchYear(idTheMovieDb, { movieData, setMovieData })
                    }
                  />
                )}
              </div>
              {/* END Year (modify) */}
              {/* TV saison - episode /+/ duration (modify) */}
              {isTvShow ? (
                renderTvShowFields()
              ) : (
                <div className="box_item_form">
                  <TextField
                    label="Durée (minutes)"
                    name="duration"
                    value={safeValue(movieData.duration)}
                    onChange={(e) =>
                      setMovieData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    fullWidth
                    type="number"
                    sx={textFieldSx}
                  />
                  {idTheMovieDb && (
                    <CloudSyncIcon
                      className="Btn_Refresh_items_MovieCard"
                      onClick={() =>
                        refetchDuration(idTheMovieDb, {
                          movieData,
                          setMovieData,
                        })
                      }
                    />
                  )}
                </div>
                // END BLOCK 1 MODIFY MODE
              )}
              {/* EDN TV saison - episode /+/ duration */}
            </div>
          ) : (
            // BLOCK 1 LISTEN MODE
            <div className="infos_bloc_1">
              <p className="MovieCard_title">
                {movieData.title}{" "}
                {isTvShow && tvSeason && (
                  <span className="tvSeasonsBadge">/Saison {tvSeason}</span>
                )}
              </p>
              <div className="divider" />
              {/* trailer */}
              {isTrailerVisible ? (
                <>
                  <Backdrop
                    sx={{
                      color: "#fff",
                      zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={isTrailerLoading}
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                  <div className="MovieCard_trailer">
                    <ReactPlayer
                      url={movieData.trailer}
                      className="video_player"
                      controls
                      onReady={handleTrailerReady} // Appelé quand la vidéo est prête
                      onStart={() => setIsTrailerLoading(false)}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* altTitle */}
                  {movieData.altTitle && (
                    <p className="MovieCard_info">
                      {movieData.altTitle} (Titre original)
                    </p>
                  )}
                  {/* end altTitle */}
                  {/* Genre */}
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Genre:</span> {genres}
                  </p>
                  {/* end Genre */}
                  {/* Année */}
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Année:</span>{" "}
                    {movieData.year || ""}
                  </p>
                  {/* end Année */}
                  {/* Pays */}
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Pays:</span> {countries}
                  </p>
                  {/* end Pays */}
                  {/* TV saisons */}
                  {isTvShow &&
                    movieData.tvSeasons &&
                    movieData.tvSeasons.trim() !== "" && (
                      <p className="MovieCard_info">
                        <span className="paraph_bolder">saisons:</span>{" "}
                        {movieData.tvSeasons || ""}
                      </p>
                    )}
                  {/* end TV saisons */}
                  {/* TV episodes */}
                  {isTvShow &&
                    movieData.nbTvEpisodes &&
                    movieData.nbTvEpisodes > 0 && (
                      <p className="MovieCard_info">
                        <span className="paraph_bolder">Nb d'épisodes:</span>{" "}
                        {movieData.nbTvEpisodes || ""}
                      </p>
                    )}
                  {/* end TV episodes */}
                  {/* TV Durée d'épisode */}
                  {isTvShow &&
                    movieData.episodeDuration &&
                    movieData.episodeDuration > 0 && (
                      <p className="MovieCard_info">
                        <span className="paraph_bolder">Durée d'épisode:</span>{" "}
                        {movieData.episodeDuration || ""} mn
                      </p>
                    )}
                  {/* end TV Durée d'épisode */}
                  {/* Durée */}
                  {!isTvShow && (
                    <p className="MovieCard_info">
                      <span className="paraph_bolder">Durée:</span>{" "}
                      {movieData.duration || ""}mn
                    </p>
                  )}
                  {/* end Durée */}
                  <div className="divider_dashed" />
                  {/* Réalisateur / créateur */}
                  {directors && (
                    <p className="MovieCard_info">
                      <span className="paraph_bolder paraph_color_2">
                        {isTvShow ? "Créateur:" : "Réalisateur:"}
                      </span>{" "}
                      {directors}
                    </p>
                  )}
                  {/* end Réalisateur / créateur */}
                  {/* Scénariste */}
                  {screenwriters && (
                    <p className="MovieCard_info">
                      <span className="paraph_bolder paraph_color_2">
                        Scénariste:
                      </span>{" "}
                      {screenwriters}
                    </p>
                  )}
                  {/* end Scénariste */}
                  {/* Compositeur */}
                  {music && (
                    <p className="MovieCard_info">
                      <span className="paraph_bolder paraph_color_2">
                        Musique:
                      </span>{" "}
                      {music}
                    </p>
                  )}
                  {/* end Compositeur */}
                  {/* Studio */}
                  {studios && (
                    <p className="MovieCard_info">
                      <span className="paraph_bolder paraph_color_2">
                        Studio:
                      </span>{" "}
                      {studios}
                    </p>
                  )}
                  {/* end Studio */}
                  {/* casting */}
                  {casting && (
                    <p className="MovieCard_info MovieCard_casting paraph_height">
                      <span className="paraph_bolder paraph_color_2">
                        Casting:
                      </span>{" "}
                      {casting}
                    </p>
                  )}
                  {/* end casting */}
                  <div className="divider" />
                </>
                // END BLOCK 1 LISTEN MODE
              )}
            </div>
          )}
        </section>
        {/* END INFO BLOCK 1 */}

        {/* INFO BLOCK 2 */}
        <section>
          {isModify ? (
            // BLOCK 2 MODIFY MODE
            <div className="MC_line2_modify">
              <div className="divider" />
              {/* Pays (modify) */}
              <div className="box_item_form">
                <Box
                  component="form"
                  sx={textFieldSx}
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                >
                  <TextField
                    id="outlined-read-only-input"
                    label="Pays"
                    value={getSelectedNames(selectedCountries)}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Box>
                <AddCircleOutlineIcon
                  className="Btn_Add_itemsPopUp_MovieCard"
                  onClick={() => handleOpenModal("country")}
                />
                {idTheMovieDb && (
                  <CloudSyncIcon
                    className="Btn_Refresh_items_MovieCard"
                    onClick={() =>
                      refetchCountries(idTheMovieDb, {
                        searchCountryInDatabase,
                        createCountryInDatabase,
                        setSelectedCountries,
                      })
                    }
                  />
                )}
              </div>
              {/* end Pays (modify) */}
              <div className="divider" />
              {/* Réalisateur (modify) */}
              <div className="box_item_form">
                <Box
                  component="form"
                  sx={textFieldSx}
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                >
                  <TextField
                    id="outlined-read-only-input"
                    label={isTvShow ? "Créateur:" : "Réalisateur:"}
                    value={getSelectedNames(selectedDirectors)}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Box>
                <AddCircleOutlineIcon
                  className="Btn_Add_itemsPopUp_MovieCard"
                  onClick={() => handleOpenModal("directors")}
                />
                {idTheMovieDb && (
                  <CloudSyncIcon
                    className="Btn_Refresh_items_MovieCard"
                    onClick={() =>
                      refetchDirectors(idTheMovieDb, {
                        searchDirectorInDatabase,
                        createDirectorInDatabase,
                        setSelectedDirectors,
                      })
                    }
                  />
                )}
              </div>
              {/* end Réalisateur (modify) */}
              {/* Scénariste (modfiy) */}
              {!isTvShow && (
                <div className="box_item_form">
                  <Box
                    component="form"
                    sx={textFieldSx}
                    noValidate
                    autoComplete="off"
                    display="flex"
                    alignItems="center"
                  >
                    <TextField
                      id="outlined-read-only-input"
                      label="Scénariste(s)"
                      value={getSelectedNames(selectedScreenwriters)}
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </Box>
                  <AddCircleOutlineIcon
                    className="Btn_Add_itemsPopUp_MovieCard"
                    onClick={() => handleOpenModal("screenwriters")}
                  />
                  {idTheMovieDb && (
                    <CloudSyncIcon
                      className="Btn_Refresh_items_MovieCard"
                      onClick={() =>
                        refetchScreenwriters(idTheMovieDb, {
                          searchScreenwriterInDatabase,
                          createScreenwriterInDatabase,
                          setSelectedScreenwriters,
                        })
                      }
                    />
                  )}
                </div>
              )}
              {/* end Scénariste (modfiy) */}
              {/* Compositeur (modfiy) */}
              <div className="box_item_form">
                <Box
                  component="form"
                  sx={textFieldSx}
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                >
                  <TextField
                    id="outlined-read-only-input"
                    label="Compositeur(s)"
                    value={getSelectedNames(selectedMusic)}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Box>
                <AddCircleOutlineIcon
                  className="Btn_Add_itemsPopUp_MovieCard"
                  onClick={() => handleOpenModal("music")}
                />
                {idTheMovieDb && (
                  <CloudSyncIcon
                    className="Btn_Refresh_items_MovieCard"
                    onClick={() =>
                      refetchCompositors(idTheMovieDb, {
                        searchCompositorInDatabase,
                        createCompositorInDatabase,
                        setSelectedMusic,
                      })
                    }
                  />
                )}
              </div>
              {/* end Compositeur (modfiy) */}
              {/* Studio (modfiy) */}
              <div className="box_item_form">
                <Box
                  component="form"
                  sx={textFieldSx}
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                >
                  <TextField
                    id="outlined-read-only-input"
                    label="Studio(s)"
                    value={getSelectedNames(selectedStudios)}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Box>
                <AddCircleOutlineIcon
                  className="Btn_Add_itemsPopUp_MovieCard"
                  onClick={() => handleOpenModal("studio")}
                />
                {idTheMovieDb && (
                  <CloudSyncIcon
                    className="Btn_Refresh_items_MovieCard"
                    onClick={() =>
                      refetchStudios(idTheMovieDb, {
                        searchStudioInDatabase,
                        createStudioInDatabase,
                        setSelectedStudios,
                      })
                    }
                  />
                )}
              </div>
              {/* end Studio (modfiy) */}
              {/* Casting (modfiy) */}
              <div className="box_item_form">
                <Box
                  component="form"
                  sx={textFieldSx}
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                >
                  <TextField
                    id="outlined-read-only-input"
                    label="Casting"
                    value={getSelectedNames(selectedCasting)}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Box>
                <AddCircleOutlineIcon
                  className="Btn_Add_itemsPopUp_MovieCard"
                  onClick={() => handleOpenModal("casting")}
                />
                {idTheMovieDb && (
                  <CloudSyncIcon
                    className="Btn_Refresh_items_MovieCard"
                    onClick={() =>
                      refetchCasting(idTheMovieDb, {
                        searchCastingInDatabase,
                        createCastingInDatabase,
                        setSelectedCasting,
                      })
                    }
                  />
                )}
              </div>
              {/* end Casting (modfiy) */}
              {/* Tags (modfiy) */}
              <div className="box_item_form">
                <Box
                  component="form"
                  sx={textFieldSx}
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                >
                  <TextField
                    id="outlined-read-only-input"
                    label="Tag"
                    value={getSelectedNames(selectedTags)}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Box>
                <AddCircleOutlineIcon
                  className="Btn_Add_itemsPopUp_MovieCard"
                  onClick={() => handleOpenModal("tags")}
                />
                {idTheMovieDb && (
                  <CloudSyncIcon
                    className="Btn_Refresh_items_MovieCard"
                    onClick={() =>
                      refetchTags(idTheMovieDb, {
                        searchTagInDatabase,
                        createTagInDatabase,
                        setSelectedTags,
                      })
                    }
                  />
                )}
              </div>
              {/* end Tags (modfiy) */}
              <div className="divider" />
              {/* Résumé (modfiy) */}
              <div className="box_item_form">
                <TextField
                  label="Résumé"
                  name="story"
                  value={safeValue(movieData.story)}
                  onChange={(e) => handleChange(e)}
                  multiline
                  fullWidth
                  sx={textFieldSx}
                />
                {idTheMovieDb && (
                  <CloudSyncIcon
                    className="Btn_Refresh_items_MovieCard"
                    onClick={() =>
                      refetchStory(idTheMovieDb, {
                        movieData,
                        setMovieData,
                      })
                    }
                  />
                )}
              </div>
              {/* end Résumé (modfiy) */}
              <div className="divider" />
              {/* Support (modfiy) */}
              <FormControl sx={textFieldSx}>
                <InputLabel>Support</InputLabel>
                <Select
                  id="demo-select-small"
                  name="videoSupport"
                  value={safeValue(movieData.videoSupport)}
                  label="Support"
                  onChange={handleFormatSupportChange}
                >
                  <MenuItem value="DVD original">DVD original</MenuItem>
                  <MenuItem value="DVD R/RW">DVD R/RW</MenuItem>
                  <MenuItem value="Fichier multimédia">
                    Fichier multimédia
                  </MenuItem>
                </Select>
              </FormControl>
              {movieData.videoSupport === "Fichier multimédia" && (
                <>
                  {movie.isTvShow ? (
                    // ----- CAS SÉRIE (dossier complet)
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      p={1}
                      sx={textFieldSx}
                    >
                      <TextField
                        label="Dossier sélectionné"
                        variant="outlined"
                        value={safeValue(movieData.path)}
                        InputProps={{ readOnly: true }}
                        fullWidth
                      />

                      {/* Input caché (sélection dossier) */}
                      <input
                        type="file"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        multiple
                        onChange={handleFolderChange}
                        webkitdirectory=""
                      />

                      <Button
                        variant="outlined"
                        sx={{
                          color: "var(--color-03)",
                          borderColor: "var(--color-03)",
                          "&:hover": {
                            color: "var(--color-06)",
                            borderColor: "var(--color-06)",
                          },
                        }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Sélectionner un dossier
                      </Button>
                    </Box>
                  ) : (
                    // ----- CAS FILM (fichier unique)
                    <Box
                      component="form"
                      sx={textFieldSx}
                      noValidate
                      autoComplete="off"
                      display="flex"
                      flexDirection="column"
                      gap={2}
                      p={1}
                    >
                      <TextField
                        label="Chemin du dossier"
                        variant="outlined"
                        value={safeValue(movieData.path)}
                        onChange={(e) => {
                          const inputPath = e.target.value;
                          const cleaned = inputPath
                            .replace(/^[A-Za-z]:[\\/]+/, "")
                            .replace(/[\\/]+$/, "");
                          setMovieData((prev) => ({
                            ...prev,
                            path: inputPath,
                            location: selectedFile
                              ? `${cleaned}\\${selectedFile.name}`
                              : "",
                          }));
                        }}
                        fullWidth
                      />

                      <TextField
                        label="Fichier sélectionné"
                        variant="outlined"
                        value={selectedFile ? selectedFile.name : ""}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />

                      <Button
                        variant="outlined"
                        sx={{
                          color: "var(--color-03)",
                          borderColor: "var(--color-03)",
                          "&:hover": {
                            color: "var(--color-06)",
                            borderColor: "var(--color-06)",
                          },
                        }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Sélectionner un fichier vidéo
                      </Button>

                      {/* Input caché (fichier unique) */}
                      <input
                        type="file"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </Box>
                  )}

                  {/* Champ commun : taille du fichier */}
                  <TextField
                    label="Taille du fichier"
                    name="fileSize"
                    value={safeValue(movieData.fileSize)}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                    type="text" // ✅ texte, car inclut unité
                    sx={textFieldSx}
                  />

                  <FormControl
                    sx={{
                      m: 1,
                      color: "white",
                    }}
                  >
                    <FormLabel
                      // id="demo-row-radio-buttons-group-label"
                      sx={{
                        color: "white",
                        "&.Mui-focused": { color: "white" },
                      }}
                    >
                      version:
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={version}
                      onChange={handleVersionChange}
                    >
                      <FormControlLabel
                        value="none"
                        control={<Radio sx={{ color: "white" }} />}
                        label="none"
                        sx={{
                          color: "white",
                          "& .MuiRadio-root.Mui-checked": {
                            color: "var(--color-03)",
                          },
                        }}
                      />
                      <FormControlLabel
                        value="VOSTFR"
                        control={<Radio sx={{ color: "white" }} />}
                        label="VOSTFR"
                        sx={{
                          color: "white",
                          "& .MuiRadio-root.Mui-checked": {
                            color: "var(--color-03)",
                          },
                        }}
                      />
                      <FormControlLabel
                        value="MULTI"
                        control={<Radio sx={{ color: "white" }} />}
                        label="MULTI"
                        sx={{
                          color: "white",
                          "& .MuiRadio-root.Mui-checked": {
                            color: "var(--color-03)",
                          },
                        }}
                      />
                    </RadioGroup>
                  </FormControl>
                </>
              )}
              {/* end Support (modfiy) */}
              <div className="divider" />
              {/* trailer (modfiy) */}
              <div className="box_item_form">
                <TextField
                  label="trailer"
                  name="trailer"
                  value={safeValue(movieData.trailer)}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldSx}
                />

                {idTheMovieDb && (
                  <CloudSyncIcon
                    className="Btn_Refresh_items_MovieCard"
                    onClick={() =>
                      refetchTrailer(idTheMovieDb, {
                        setMovieData,
                        setTrailerMessage,
                      })
                    }
                  />
                )}
              </div>
              {trailerMessage && (
                <Alert severity="info" sx={{ mt: 1, width: "50%" }}>
                  {trailerMessage}
                </Alert>
              )}
              {/* end trailer (modfiy) */}
              <div className="divider" />
              {/* Commentaire (modfiy) */}
              <TextField
                label="Commentaire"
                name="comment"
                value={safeValue(movieData.comment)}
                onChange={(e) => handleChange(e)}
                multiline
                fullWidth
                sx={textFieldSx}
              />
              {/* end Commentaire (modfiy) */}
              <div className="divider" />
              {/* IMDB ID (modfiy) */}
              {movieData.idTheMovieDb ? (
                <div>
                  <TextField
                    label="id IMDB"
                    name="idTheMovieDb"
                    value={movieData.idTheMovieDb}
                    onChange={handleChange}
                    placeholder="Ex: tt0111161"
                    fullWidth
                    sx={textFieldSx}
                    disabled={!allowEdit}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "white",
                          "&.Mui-checked": {
                            color: "var(--color-03)",
                          },
                        }}
                        checked={allowEdit}
                        onChange={(e) => setAllowEdit(e.target.checked)}
                      />
                    }
                    label="Autoriser la saisie manuelle de l'ID IMDb"
                    sx={{ color: "white" }}
                  />
                </div>
              ) : (
                <TextField
                  label="id IMDB"
                  name="idTheMovieDb"
                  placeholder="movie/9255 or tv/90228"
                  value={movieData.idTheMovieDb}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldSx}
                />
              )}
              {/* IMDB ID (modfiy) */}
              {/* // END BLOCK 2 MODIFY MODE */}
            </div>
          ) : (
            // BLOCK 2 LISTEN MODE
            <div className="MC_line2">
              {isTrailerVisible ? (
                <div className="MovieCard_trailer" />
              ) : (
                <>
                  {/* Résumé */}
                  <p className="MovieCard_info paraph_bolder">Résumé:</p>
                  <p className="MovieCard_info MovieCard_story  paraph_height">
                    {movieData.story}
                  </p>
                  {/* end Résumé */}
                  <div className="divider_dashed" />
                  {/* focus */}
                  {movieData.focus && (
                    <>
                      <p className="MovieCard_info">
                        <span className="paraph_bolder">focus:</span> {focus}
                      </p>
                      <div className="divider_dashed" />
                    </>
                  )}
                  {/* end focus */}

                  {/* Support */}
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Support:</span>{" "}
                    {movieData.videoSupport}
                  </p>
                  {/* end Support */}
                  {/* Version VOSTFR - MULTI */}
                  {movieData.vostfr ? (
                    <p className="MovieCard_info paraph_height">
                      <span className="paraph_bolder">Version:</span> VOSTFR
                    </p>
                  ) : null}
                  {movieData.multi ? (
                    <p className="MovieCard_info paraph_height">
                      <span className="paraph_bolder">Version:</span>{" "}
                      Multi-langues
                    </p>
                  ) : null}
                  {/* end Version VOSTFR - MULTI */}
                  {/* Support */}
                  {(movieData.videoSupport === "Fichier multimédia" ||
                    movieData.videoSupport === "FICHIER MULTIMEDIA") && (
                    <>
                      {movieData.location && (
                        <p className="MovieCard_info paraph_height">
                          <span className="paraph_bolder">Emplacement:</span>{" "}
                          {movieData.location}
                        </p>
                      )}
                      {movieData.fileSize && (
                        <p className="MovieCard_info">
                          <span className="paraph_bolder">Size:</span>{" "}
                          {movieData.fileSize}
                        </p>
                      )}
                    </>
                  )}
                  {/* end Support */}
                  {/* Commentaire */}
                  {movieData.comment && (
                    <>
                      <div className="divider_dashed" />
                      <p className="MovieCard_info">
                        <span className="paraph_bolder">Commentaire:</span>{" "}
                        {movieData.comment}
                      </p>
                    </>
                  )}
                  {/* end Commentaire */}
                </>
              )}

              {movieData.trailer && (
                <div className="MovieCard_trailer">
                  <div className="divider_dashed divider_trailer" />
                  <div
                    className="Toggle_video_player"
                    role="button"
                    tabIndex={0}
                    onClick={toggleTrailerVideo}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        toggleTrailerVideo();
                      }
                    }}
                  >
                    <p className="MovieCard_info Toggle_video_btn">
                      {isTrailerVisible
                        ? "VOIR FICHE DU FILM"
                        : "VOIR BANDE ANNONCE"}
                    </p>
                  </div>
                </div>
                // BLOCK 2 LISTEN MODE
              )}
            </div>
          )}
          {/* END INFO BLOCK 2 */}
        </section>

        {/* EDITING BUTTON */}
        {!homepage && (
          <section className="Movie_editing_btn-container">
            <section className="Item_Movie_Editing_Buttons">
              {isModify ? (
                <>
                  <UndoIcon
                    className="item_movie_undo_ico"
                    onClick={() => handleUndo()}
                  />
                  <DoneOutlineIcon
                    className="item_movie_done_ico"
                    onClick={handleOpenUpdateConfirm}
                  />
                </>
              ) : (
                <>
                  <ModeIcon
                    className="item_movie_mode_ico"
                    onClick={() => isModifyMode()}
                  />
                  <DeleteIcon
                    className="item_movie_delete_ico"
                    onClick={() => handleOpenDeleteConfirm(movieData.id)}
                  />
                </>
              )}

              <Dialog
                open={isConfirmUpdateOpen}
                onClose={handleCloseUpdateConfirm}
              >
                <DialogTitle>Confirmer la mise à jour</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Es-tu sûr de vouloir mettre à jour ce film ?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseUpdateConfirm} color="primary">
                    Annuler
                  </Button>
                  <Button onClick={handleUpdateMovie} color="primary" autoFocus>
                    Confirmer
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={isConfirmDeleteOpen}
                onClose={handleCloseDeleteConfirm}
              >
                <DialogTitle>Confirmer Delete</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Es-tu sûr de vouloir effacer ce film ?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDeleteConfirm} color="primary">
                    Annuler
                  </Button>
                  <Button onClick={handleDeleteMovie} color="primary" autoFocus>
                    Confirmer
                  </Button>
                </DialogActions>
              </Dialog>

              <Backdrop
                sx={(theme) => ({
                  color: "#fff",
                  zIndex: theme.zIndex.drawer + 1,
                })}
                open={isUpdating} // Contrôle l'affichage avec isUpdating
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </section>
          </section>
        )}
        {/* END EDITING BUTTON */}

        {/* MODAL TRANSFERT LIST */}
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
              <TransferList
                dataType={dataType}
                items={data}
                selectedKinds={selectedKinds}
                onSelectedKindsUpdate={handleSelectedKindsUpdate}
                selectedDirectors={selectedDirectors}
                onSelectedDirectorsUpdate={handleSelectedDirectorsUpdate}
                selectedCasting={selectedCasting}
                onSelectedCastingUpdate={handleSelectedCastingUpdate}
                selectedScreenwriters={selectedScreenwriters}
                onSelectedScreenwritersUpdate={
                  handleSelectedScreenwritersUpdate
                }
                selectedMusic={selectedMusic}
                onSelectedMusicUpdate={handleSelectedMusicUpdate}
                selectedStudios={selectedStudios}
                onSelectedStudiosUpdate={handleSelectedStudiosUpdate}
                selectedCountries={selectedCountries}
                onSelectedCountriesUpdate={handleSelectedCountriesUpdate}
                selectedTags={selectedTags}
                onSelectedTagsUpdate={handleSelectedTagsUpdate}
                selectedFocus={selectedFocus}
                onSelectedFocusUpdate={handleSelectedFocusUpdate}
              />
            </Container>
          </Box>
        </Modal>
        {/* END MODAL TRANSFERT LIST */}
      </div>
    </article>
  ); // end return
}

export default MovieCard;
