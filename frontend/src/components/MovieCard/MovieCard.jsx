/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import { useState, useEffect, useRef } from "react";
import "./movieCard.css";
import ReactPlayer from "react-player";
import ModeIcon from "@mui/icons-material/Mode";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import UndoIcon from "@mui/icons-material/Undo";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CachedIcon from "@mui/icons-material/Cached";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function MovieCard({ movie, origin, onUpdateMovie }) {
  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;
  const [isModify, setIsModify] = useState(false);

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
    multi: movie.multi || false,
    vostfr: movie.vostfr || false,
    story: movie.story || "",
    location: movie.location || "",
    fileSize: movie.fileSize || "",
  });
  console.info("movie: ", movie);
  console.info("movieData", movieData);

  // const {
  //   id,
  //   title,
  //   altTitle,
  //   year,
  //   duration,
  //   cover,
  //   trailer,
  //   story,
  //   location,
  //   videoSupport,
  //   fileSize,
  //   multi,
  //   vostfr,
  // } = movie;
  // console.info("movie:", movie);

  const { genres, countries, directors, screenwriters, music, studios, cast } =
    movieData;

  if (origin === "country") {
    useEffect(() => {
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
    }, [movie.id]);
  } else {
    useEffect(() => {
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
    }, [movieData.id]);
  }

  // TOGGLE trailer
  const [isTrailerVisible, setIsTrailerVisible] = useState(false);
  const toggleTrailerVideo = () => {
    setIsTrailerVisible(!isTrailerVisible);
  };

  // MODIF MODE

  const isModifyMode = () => {
    setIsModify(true);
  };

  const closeModifyMode = () => {
    setIsModify(false);
  };

  // Utiliser useEffect pour mettre à jour movieData si movie change
  useEffect(() => {
    setMovieData(movie);
  }, [movie]);

  // Fonction pour gérer les changements dans les champs TextField
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fonctions pour modifier l'image
  const [image, setImage] = useState(`${backendUrl}/images/${movie.cover}`);
  const [showUploadButton, setShowUploadButton] = useState(true);
  const fileInputRef = useRef(null);
  console.info("image:", image);

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

  // Handle File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const newImageUrl = URL.createObjectURL(file);
    setImage(newImageUrl);
    setShowUploadButton(false); // Après le choix d'une image, afficher le bouton de reset
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleResetImage = () => {
    setImage(`${backendUrl}/images/${movie.cover}`); // Remettre l'image d'origine
    setShowUploadButton(true); // Remettre l'icône d'upload
  };

  const handleUpdateImage = async () => {
    const fileInput = fileInputRef.current;
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

  // Fonction pour soumettre les modifications
  const handleUpdateMovie = async () => {
    const confirmUpdate = window.confirm(
      "Are you sure you want to update this film?"
    );

    if (confirmUpdate) {
      try {
        // Mettre à jour l'image (s'il y a un fichier sélectionné)
        if (fileInputRef.current.files[0]) {
          await handleUpdateImage(); // Attendre que l'image soit mise à jour avant de poursuivre
          console.info("Image successfully updated");
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
            }),
          }
        );

        if (response.ok) {
          console.info("Film mis à jour avec succès");
          const updatedMovie = await response.json();
          console.info("updatedMovie", updatedMovie);
          setMovieData(updatedMovie[0]);
          onUpdateMovie(updatedMovie[0]);
          closeModifyMode();
        } else {
          console.error("Erreur lors de la mise à jour");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour du film et de l'image",
          error
        );
      }
    } // end confirm update
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
                  onChange={handleFileUpload}
                  ref={fileInputRef}
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
              <TextField
                label="Title"
                name="title"
                value={movieData.title}
                onChange={(e) => handleChange(e)}
                fullWidth
                sx={{
                  width: "80%",
                  "& .MuiInputLabel-root": {
                    color: "white", // Couleur du label en blanc
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Couleur du texte
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Couleur de la bordure
                    },
                    "&:hover fieldset": {
                      borderColor: "orange", // Couleur de la bordure au hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "cyan", // Couleur de la bordure lorsqu'il est focus
                    },
                  },
                }}
              />
              <div className="divider" />
              <TextField
                label="Alt Title"
                name="altTitle"
                value={movieData.altTitle}
                onChange={handleChange}
                fullWidth
                sx={{
                  width: "80%",
                  "& .MuiInputLabel-root": {
                    color: "white", // Couleur du label en blanc
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Couleur du texte
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Couleur de la bordure
                    },
                    "&:hover fieldset": {
                      borderColor: "orange", // Couleur de la bordure au hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "cyan", // Couleur de la bordure lorsqu'il est focus
                    },
                  },
                }}
              />
              <TextField
                label="Genres"
                name="genres"
                value={genres}
                onChange={handleChange}
                fullWidth
                sx={{
                  width: "80%",
                  "& .MuiInputLabel-root": {
                    color: "white", // Couleur du label en blanc
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Couleur du texte
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Couleur de la bordure
                    },
                    "&:hover fieldset": {
                      borderColor: "orange", // Couleur de la bordure au hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "cyan", // Couleur de la bordure lorsqu'il est focus
                    },
                  },
                }}
              />
              <TextField
                label="Year"
                name="year"
                value={movieData.year}
                onChange={(e) => handleChange(e)}
                fullWidth
                type="number"
                sx={{
                  width: "80%",
                  "& .MuiInputLabel-root": {
                    color: "white", // Couleur du label en blanc
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Couleur du texte
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Couleur de la bordure
                    },
                    "&:hover fieldset": {
                      borderColor: "orange", // Couleur de la bordure au hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "cyan", // Couleur de la bordure lorsqu'il est focus
                    },
                  },
                }}
              />
              <TextField
                label="Duration"
                name="duration"
                value={movieData.duration}
                onChange={(e) => handleChange(e)}
                fullWidth
                type="number"
                sx={{
                  width: "80%",
                  "& .MuiInputLabel-root": {
                    color: "white", // Couleur du label en blanc
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Couleur du texte
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Couleur de la bordure
                    },
                    "&:hover fieldset": {
                      borderColor: "orange", // Couleur de la bordure au hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "cyan", // Couleur de la bordure lorsqu'il est focus
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className="infos_bloc_1">
              <p className="MovieCard_title">{movieData.title}</p>
              <div className="divider" />
              {isTrailerVisible ? (
                <div className="MovieCard_trailer">
                  <ReactPlayer
                    url={movieData.trailer}
                    className="video_player"
                  />
                </div>
              ) : (
                <>
                  <p className="MovieCard_info">{movieData.altTitle}</p>
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Genre:</span> {genres}
                  </p>
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Année:</span>{" "}
                    {movieData.year}
                  </p>
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Pays:</span> {countries}
                  </p>
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Durée:</span>{" "}
                    {movieData.duration}mn
                  </p>
                  <div className="divider_dashed" />
                  {/* Autres détails du film */}
                  {directors && (
                    <p className="MovieCard_info">
                      <span className="paraph_bolder paraph_color_2">
                        Réalisateur:
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
                  {cast && (
                    <p className="MovieCard_info MovieCard_casting paraph_height">
                      <span className="paraph_bolder paraph_color_2">
                        Casting:
                      </span>{" "}
                      {cast}
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
              <TextField
                label="Réalisateur"
                name="directors"
                value={directors}
                onChange={handleChange}
                fullWidth
                sx={{
                  width: "85%",
                  "& .MuiInputLabel-root": {
                    color: "white", // Couleur du label en blanc
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Couleur du texte
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Couleur de la bordure
                    },
                    "&:hover fieldset": {
                      borderColor: "orange", // Couleur de la bordure au hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "cyan", // Couleur de la bordure lorsqu'il est focus
                    },
                  },
                }}
              />
              <TextField
                label="Scénariste"
                name="screenwriters"
                value={screenwriters}
                onChange={handleChange}
                fullWidth
                sx={{
                  width: "85%",
                  "& .MuiInputLabel-root": {
                    color: "white", // Couleur du label en blanc
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Couleur du texte
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Couleur de la bordure
                    },
                    "&:hover fieldset": {
                      borderColor: "orange", // Couleur de la bordure au hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "cyan", // Couleur de la bordure lorsqu'il est focus
                    },
                  },
                }}
              />
              <TextField
                label="Compositeur"
                name="music"
                value={music}
                onChange={handleChange}
                fullWidth
                sx={{
                  width: "85%",
                  "& .MuiInputLabel-root": {
                    color: "white", // Couleur du label en blanc
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Couleur du texte
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Couleur de la bordure
                    },
                    "&:hover fieldset": {
                      borderColor: "orange", // Couleur de la bordure au hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "cyan", // Couleur de la bordure lorsqu'il est focus
                    },
                  },
                }}
              />
              <TextField
                label="Studio"
                name="studios"
                value={studios}
                onChange={handleChange}
                fullWidth
                sx={{
                  width: "85%",
                  "& .MuiInputLabel-root": {
                    color: "white", // Couleur du label en blanc
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Couleur du texte
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Couleur de la bordure
                    },
                    "&:hover fieldset": {
                      borderColor: "orange", // Couleur de la bordure au hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "cyan", // Couleur de la bordure lorsqu'il est focus
                    },
                  },
                }}
              />
              <TextField
                label="Casting"
                name="cast"
                value={cast}
                onChange={handleChange}
                fullWidth
                sx={{
                  width: "85%",
                  "& .MuiInputLabel-root": {
                    color: "white", // Couleur du label en blanc
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Couleur du texte
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Couleur de la bordure
                    },
                    "&:hover fieldset": {
                      borderColor: "orange", // Couleur de la bordure au hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "cyan", // Couleur de la bordure lorsqu'il est focus
                    },
                  },
                }}
              />
              <div className="divider" />
              <TextField
                label="Résumé"
                name="story"
                value={movieData.story}
                onChange={(e) => handleChange(e)}
                multiline
                fullWidth
                sx={{
                  width: "85%",
                  "& .MuiInputLabel-root": {
                    color: "white", // Couleur du label en blanc
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Couleur du texte
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Couleur de la bordure
                    },
                    "&:hover fieldset": {
                      borderColor: "orange", // Couleur de la bordure au hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "cyan", // Couleur de la bordure lorsqu'il est focus
                    },
                  },
                }}
              />
              <div className="divider" />

              <FormControl
                sx={{
                  width: "35%",
                  "& .MuiInputLabel-root": {
                    color: "white", // Couleur du label en blanc
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Couleur du texte
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Couleur de la bordure
                    },
                    "&:hover fieldset": {
                      borderColor: "orange", // Couleur de la bordure au hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "cyan", // Couleur de la bordure lorsqu'il est focus
                    },
                  },
                }}
              >
                <InputLabel>Support</InputLabel>
                <Select
                  id="demo-select-small"
                  name="videoSupport"
                  value={movieData.videoSupport || ""}
                  label="Support"
                  onChange={(e) => handleChange(e)}
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
                  <TextField
                    label="Emplacement"
                    name="location"
                    value={movieData.location || ""}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                    sx={{
                      width: "85%",
                      "& .MuiInputLabel-root": {
                        color: "white", // Couleur du label en blanc
                      },
                      "& .MuiInputBase-input": {
                        color: "white", // Couleur du texte
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white", // Couleur de la bordure
                        },
                        "&:hover fieldset": {
                          borderColor: "orange", // Couleur de la bordure au hover
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "cyan", // Couleur de la bordure lorsqu'il est focus
                        },
                      },
                    }}
                  />

                  <TextField
                    label="Taille du fichier"
                    name="fileSize"
                    value={movieData.fileSize || ""}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                    type="number"
                    sx={{
                      width: "85%",
                      "& .MuiInputLabel-root": {
                        color: "white", // Couleur du label en blanc
                      },
                      "& .MuiInputBase-input": {
                        color: "white", // Couleur du texte
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white", // Couleur de la bordure
                        },
                        "&:hover fieldset": {
                          borderColor: "orange", // Couleur de la bordure au hover
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "cyan", // Couleur de la bordure lorsqu'il est focus
                        },
                      },
                    }}
                  />
                </>
              )}
              <div className="divider" />
              <TextField
                label="trailer"
                name="trailer"
                value={movieData.trailer}
                onChange={(e) => handleChange(e)}
                fullWidth
                sx={{
                  width: "85%",
                  "& .MuiInputLabel-root": {
                    color: "white", // Couleur du label en blanc
                  },
                  "& .MuiInputBase-input": {
                    color: "white", // Couleur du texte
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Couleur de la bordure
                    },
                    "&:hover fieldset": {
                      borderColor: "orange", // Couleur de la bordure au hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "cyan", // Couleur de la bordure lorsqu'il est focus
                    },
                  },
                }}
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
                      <p className="MovieCard_info paraph_height">
                        <span className="paraph_bolder">Emplacement:</span>{" "}
                        {movieData.location}
                      </p>
                      <p className="MovieCard_info">
                        <span className="paraph_bolder">Size:</span>{" "}
                        {movieData.fileSize}
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

        <section className="Movie_editing_btn-container">
          <section className="Item_Movie_Editing_Buttons">
            {isModify ? (
              <>
                <UndoIcon
                  className="item_movie_undo_ico"
                  onClick={() => closeModifyMode()}
                />
                <DoneOutlineIcon
                  className="item_movie_done_ico"
                  onClick={() => handleUpdateMovie()}
                />
              </>
            ) : (
              <ModeIcon
                className="item_movie_mode_ico"
                onClick={() => isModifyMode()}
              />
            )}
          </section>
        </section>
      </div>
    </article>
  );
}

export default MovieCard;
