/* eslint-disable no-alert */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import { useState, useEffect, useRef } from "react";
// import axios from "axios";
import { toast } from "react-toastify";
import "./movieCard.css";
import "./movieCard_videoPlayer_MediaQueries.css";
import ReactPlayer from "react-player";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
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
import TransferList from "../AdminFeatures/AddNewMovie/MovieItemList";
import refetchMovieTMDB from "../../utils/refetchMovieTMDB";
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

  // DATA
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

  const {
    genres,
    countries,
    directors,
    screenwriters,
    music,
    studios,
    casting,
    tags,
  } = movieData;

  const isTvShow = movieData.isTvShow === 1;

  // --------- REFRESH WITH API TMDB ------------ //
  // const [newDataMovie, setNewDataMovie] = useState([]);
  // console.info("newDataMovie", newDataMovie);

  const { idTheMovieDb } = movie;

  // FETCH MOVIE DATAS
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

  const [isTrailerVisible, setIsTrailerVisible] = useState(false);
  const [isTrailerLoading, setIsTrailerLoading] = useState(false);

  const toggleTrailerVideo = () => {
    setIsTrailerVisible(!isTrailerVisible);
    setIsTrailerLoading(true); // Active le chargement lors de l'ouverture du trailer
  };

  const handleTrailerReady = () => {
    setIsTrailerLoading(false); // Cache le loader quand la vidéo est prête
  };

  // MODIFY MODE - modifier champs TextField
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // MODIFY MODE - modifier  version
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

  // MODIFY MODE - MODIFICATION DE L'AFFICHE
  const [image, setImage] = useState(`${backendUrl}/images/${movie.cover}`);
  const [showUploadButton, setShowUploadButton] = useState(true);
  const fileCoverRef = useRef(null);

  useEffect(() => {
    if (isModify) {
      // Lorsque le mode modification est activé, réinitialiser l'affichage du bouton d'upload
      if (image === `${backendUrl}/images/${movie.cover}`) {
        setShowUploadButton(true); // Si l'image n'a pas été changée, montrer l'icône d'upload
      } else {
        setShowUploadButton(false); // Si l'image a été modifiée, montrer l'icône de reset
      }
    }
  }, [isModify, image, movie.cover, backendUrl]);

  // Handle Cover Upload
  const handleCoverUpload = (event) => {
    const file = event.target.files[0];
    const newImageUrl = URL.createObjectURL(file);
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

  // -----------------/ INPUT FILE /----------------- //
  const fileInputRef = useRef(null); // Référence pour le fichier vidéo

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();
    const videoFormats = ["avi", "mkv", "mp4"];

    if (videoFormats.includes(fileExtension)) {
      const fileSizeInBytes = file.size;
      const fileSizeInGigabytes = fileSizeInBytes / (1024 * 1024 * 1024);

      setMovieData((prevData) => ({
        ...prevData,
        location: file.name, // Ou un chemin approprié
        videoFormat: fileExtension,
        videoSupport: "Fichier multimédia",
        fileSize: fileSizeInGigabytes.toFixed(2),
      }));
    } else {
      toast.warn("Veuillez sélectionner un fichier vidéo valide.");
    }
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

  // -----------------/ TRANSFERT LIST /----------------- //
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState("");

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
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

  // HANDLERS POUR CHAQUE TYPE
  const handleSelectedKindsUpdate = setSelectedKinds;
  const handleSelectedDirectorsUpdate = setSelectedDirectors;
  const handleSelectedCastingUpdate = setSelectedCasting;
  const handleSelectedScreenwritersUpdate = setSelectedScreenwriters;
  const handleSelectedMusicUpdate = setSelectedMusic;
  const handleSelectedStudiosUpdate = setSelectedStudios;
  const handleSelectedCountriesUpdate = setSelectedCountries;
  const handleSelectedTagsUpdate = setSelectedTags;

  // -----------------/ UPDATE MODE /----------------- //
  const isModifyMode = () => {
    setIsModify(true);
  };

  const closeModifyMode = () => {
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

    closeModifyMode();
  };

  // UPDATE MOVIE
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
            duration: movieData.duration,
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
            // !!! ajouter les items que l'on met à jour !!!!
          }),
        }
      );

      if (response.ok) {
        toast.success("Film mis à jour avec succès");
        console.info("Film mis à jour avec succès");
        const updatedMovie = await response.json();
        console.info("updatedMovie", updatedMovie);
        setMovieData(updatedMovie[0]);
        onUpdateMovie(updatedMovie[0]);
        closeModifyMode();
        closeModal();
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

  // -- UX FIELDS

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

  return (
    <article className="MovieCard">
      <div className="MovieCard_container">
        <section className="MC_line1">
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
                {showUploadButton ? (
                  <div className="movie_cover_modify_button">
                    <FileUploadIcon
                      className="Item_uploadButton"
                      onClick={handleUploadClick}
                    />
                  </div>
                ) : (
                  <div className="movie_cover_modify_button">
                    <CachedIcon
                      className="Item_reset_img_Button"
                      onClick={handleResetImage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          {/* info bloc 1 */}
          {isModify ? (
            <div className="infos_bloc_1_modify">
              <CloudSyncIcon
                variant="contained"
                className="Btn_Add_itemsPopUp_MovieCard"
                onClick={() =>
                  refetchMovieTMDB(idTheMovieDb, {
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
                    searchLanguageInDatabase,
                    createLanguageInDatabase,
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
                  })
                }
              />
              <TextField
                label="Title"
                name="title"
                value={movieData.title}
                onChange={(e) => handleChange(e)}
                fullWidth
                sx={textFieldSx}
              />
              <div className="divider" />
              <TextField
                label="Alt Title"
                name="altTitle"
                value={movieData.altTitle}
                onChange={handleChange}
                fullWidth
                sx={textFieldSx}
              />
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
              </div>
              <TextField
                label="Year"
                name="year"
                value={movieData.year}
                onChange={(e) => handleChange(e)}
                fullWidth
                type="number"
                sx={textFieldSx}
              />
              <TextField
                label="Duration"
                name="duration"
                value={movieData.duration}
                onChange={(e) => handleChange(e)}
                fullWidth
                type="number"
                sx={textFieldSx}
              />
            </div>
          ) : (
            <div className="infos_bloc_1">
              <p className="MovieCard_title">{movieData.title}</p>
              <div className="divider" />
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
                  {movieData.altTitle && (
                    <p className="MovieCard_info">
                      {movieData.altTitle} (Titre original)
                    </p>
                  )}
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Genre:</span> {genres}
                  </p>
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Année:</span>{" "}
                    {movieData.year || ""}
                  </p>
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Pays:</span> {countries}
                  </p>
                  {isTvShow &&
                    movieData.tvSeasons &&
                    movieData.tvSeasons.trim() !== "" && (
                      <p className="MovieCard_info">
                        <span className="paraph_bolder">saisons:</span>{" "}
                        {movieData.tvSeasons || ""}
                      </p>
                    )}
                  {isTvShow &&
                    movieData.nbTvEpisodes &&
                    movieData.nbTvEpisodes > 0 && (
                      <p className="MovieCard_info">
                        <span className="paraph_bolder">Nb d'épisodes:</span>{" "}
                        {movieData.nbTvEpisodes || ""}
                      </p>
                    )}
                  {isTvShow &&
                    movieData.episodeDuration &&
                    movieData.episodeDuration > 0 && (
                      <p className="MovieCard_info">
                        <span className="paraph_bolder">Durée d'épisode:</span>{" "}
                        {movieData.episodeDuration || ""}
                      </p>
                    )}
                  {!isTvShow && (
                    <p className="MovieCard_info">
                      <span className="paraph_bolder">Durée:</span>{" "}
                      {movieData.duration || ""}mn
                    </p>
                  )}
                  <div className="divider_dashed" />
                  {/* Autres détails du film */}
                  {directors && (
                    <p className="MovieCard_info">
                      <span className="paraph_bolder paraph_color_2">
                        {isTvShow ? "Créateur:" : "Réalisateur:"}
                      </span>{" "}
                      {directors}
                    </p>
                  )}
                  {screenwriters && (
                    <p className="MovieCard_info">
                      <span className="paraph_bolder paraph_color_2">
                        Scénariste:
                      </span>{" "}
                      {screenwriters}
                    </p>
                  )}
                  {music && (
                    <p className="MovieCard_info">
                      <span className="paraph_bolder paraph_color_2">
                        Musique:
                      </span>{" "}
                      {music}
                    </p>
                  )}
                  {studios && (
                    <p className="MovieCard_info">
                      <span className="paraph_bolder paraph_color_2">
                        Studio:
                      </span>{" "}
                      {studios}
                    </p>
                  )}
                  {casting && (
                    <p className="MovieCard_info MovieCard_casting paraph_height">
                      <span className="paraph_bolder paraph_color_2">
                        Casting:
                      </span>{" "}
                      {casting}
                    </p>
                  )}
                  <div className="divider" />
                </>
              )}
            </div>
          )}
          {/* fin info bloc 1 */}
        </section>

        <section>
          {/* info bloc 2 */}
          {isModify ? (
            <div className="MC_line2_modify">
              <div className="divider" />
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
              </div>
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
                    label="Réalisateur(s)"
                    value={getSelectedNames(selectedDirectors)}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Box>
                <AddCircleOutlineIcon
                  className="Btn_Add_itemsPopUp_MovieCard"
                  onClick={() => handleOpenModal("directors")}
                />
              </div>
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
              </div>
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
              </div>
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
              </div>
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
              </div>
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
              </div>
              <div className="divider" />
              <TextField
                label="Résumé"
                name="story"
                value={movieData.story}
                onChange={(e) => handleChange(e)}
                multiline
                fullWidth
                sx={textFieldSx}
              />
              <div className="divider" />

              <FormControl sx={textFieldSx}>
                <InputLabel>Support</InputLabel>
                <Select
                  id="demo-select-small"
                  name="videoSupport"
                  value={movieData.videoSupport || ""}
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
                  <div className="box_item_form">
                    <TextField
                      label="Emplacement"
                      name="location"
                      value={movieData.location || ""}
                      onChange={(e) => handleChange(e)}
                      fullWidth
                      sx={textFieldSx}
                    />
                    <FileUploadIcon
                      className="Btn_upload_File_MovieCard"
                      onClick={() => fileInputRef.current.click()}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>

                  <TextField
                    label="Taille du fichier"
                    name="fileSize"
                    value={movieData.fileSize || ""}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                    type="number"
                    sx={textFieldSx}
                  />

                  <FormControl
                    sx={{
                      m: 1,
                      color: "white",
                    }}
                  >
                    <FormLabel
                      id="demo-row-radio-buttons-group-label"
                      sx={{
                        color: "white", // couleur du texte
                        "&.Mui-focused": { color: "white" }, // conserver la couleur quand le label est sélectionné
                      }}
                    >
                      version:
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={version} // Assurez-vous que la valeur sélectionnée soit affichée correctement
                      onChange={handleVersionChange}
                    >
                      <FormControlLabel
                        value="none"
                        control={<Radio sx={{ color: "white" }} />}
                        label="none"
                        sx={{
                          color: "white",
                          "& .MuiRadio-root.Mui-checked": { color: "cyan" }, // garder le bouton sélectionné en blanc
                        }}
                      />
                      <FormControlLabel
                        value="VOSTFR"
                        control={<Radio sx={{ color: "white" }} />}
                        label="VOSTFR"
                        sx={{
                          color: "white",
                          "& .MuiRadio-root.Mui-checked": { color: "cyan" }, // garder le bouton sélectionné en blanc
                        }}
                      />
                      <FormControlLabel
                        value="MULTI"
                        control={<Radio sx={{ color: "white" }} />}
                        label="MULTI"
                        sx={{
                          color: "white",
                          "& .MuiRadio-root.Mui-checked": { color: "cyan" }, // garder le bouton sélectionné en blanc
                        }}
                      />
                    </RadioGroup>
                  </FormControl>
                </>
              )}
              <div className="divider" />
              <TextField
                label="trailer"
                name="trailer"
                value={movieData.trailer || ""}
                onChange={(e) => handleChange(e)}
                fullWidth
                sx={textFieldSx}
              />
              <div className="divider" />
              <TextField
                label="Commentaire"
                name="comment"
                value={movieData.comment}
                onChange={(e) => handleChange(e)}
                multiline
                fullWidth
                sx={textFieldSx}
              />
            </div>
          ) : (
            <div className="MC_line2">
              {isTrailerVisible ? (
                <div className="MovieCard_trailer" />
              ) : (
                <>
                  <p className="MovieCard_info paraph_bolder">Résumé:</p>
                  <p className="MovieCard_info MovieCard_story  paraph_height">
                    {movieData.story}
                  </p>
                  <div className="divider_dashed" />
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Support:</span>{" "}
                    {movieData.videoSupport}
                  </p>
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
                  {movieData.comment && (
                    <>
                      <div className="divider_dashed" />
                      <p className="MovieCard_info">
                        <span className="paraph_bolder">Commentaire:</span>{" "}
                        {movieData.comment}
                      </p>
                    </>
                  )}
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
              )}
            </div>
          )}
          {/* fin info bloc 2 */}
        </section>
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
              />
            </Container>
          </Box>
        </Modal>
      </div>
    </article>
  ); // end return
}

export default MovieCard;
