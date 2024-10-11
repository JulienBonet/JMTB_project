/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./movieCard.css";
import ReactPlayer from "react-player";
import ModeIcon from "@mui/icons-material/Mode";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import UndoIcon from "@mui/icons-material/Undo";
// import FileUploadIcon from "@mui/icons-material/FileUpload";
// import CachedIcon from "@mui/icons-material/Cached";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function MovieCard({ movie, origin }) {
  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;
  const [isModify, setIsModify] = useState(false);

  // DATA
  const [movieData, setMovieData] = useState({
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

  const {
    id,
    title,
    altTitle,
    year,
    duration,
    cover,
    trailer,
    story,
    location,
    videoSupport,
    fileSize,
    multi,
    vostfr,
  } = movie;
  console.info("movie:", movie);

  useEffect(() => {
    console.info("Valeur actuelle de videoSupport:", movieData.videoSupport);
    setMovieData({
      title: movie.title || "",
      altTitle: movie.altTitle || "",
      year: movie.year || "",
      duration: movie.duration || "",
      videoSupport: movie.videoSupport || "",
      multi: movie.multi || false,
      vostfr: movie.vostfr || false,
      story: movie.story || "",
      location: movie.location || "",
      fileSize: movie.fileSize || "",
    });
  }, [movie]);

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
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/movies/${id}`)
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
    }, [id]);
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

  // Fonction pour soumettre les modifications
  // const handleSubmit = async () => {
  //   try {
  //     const response = await fetch(`/api/movies/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(movieData),
  //     });

  //     if (response.ok) {
  //       alert("Film mis à jour avec succès !");
  //     } else {
  //       throw new Error("Erreur lors de la mise à jour du film.");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("Erreur lors de la mise à jour du film.");
  //   }
  // };

  return (
    <article className="MovieCard">
      <div className="MovieCard_container">
        <section className="MC_line1">
          <div className="MovieCard_Cover_Position">
            <img
              className="MovieCard_cover"
              src={`${backendUrl}/images/${cover}`}
              alt={`Cover ${title}`}
            />
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
              <p className="MovieCard_title">{title}</p>
              <div className="divider" />
              {isTrailerVisible ? (
                <div className="MovieCard_trailer">
                  <ReactPlayer url={trailer} className="video_player" />
                </div>
              ) : (
                <>
                  <p className="MovieCard_info">{altTitle}</p>
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Genre:</span> {genres}
                  </p>
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Année:</span> {year}
                  </p>
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Pays:</span> {countries}
                  </p>
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Durée:</span> {duration}mn
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
                  value={movieData.videoSupport}
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
                    value={movieData.location}
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
                    value={movieData.fileSize}
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
                    {story}
                  </p>
                  <div className="divider_dashed" />
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Support:</span>{" "}
                    {videoSupport}
                  </p>
                  {vostfr ? (
                    <p className="MovieCard_info paraph_height">
                      <span className="paraph_bolder">Version:</span> VOSTFR
                    </p>
                  ) : null}
                  {multi ? (
                    <p className="MovieCard_info paraph_height">
                      <span className="paraph_bolder">Version:</span>{" "}
                      Multi-langues
                    </p>
                  ) : null}
                  {(videoSupport === "Fichier multimédia" ||
                    videoSupport === "FICHIER MULTIMEDIA") && (
                    <>
                      <p className="MovieCard_info paraph_height">
                        <span className="paraph_bolder">Emplacement:</span>{" "}
                        {location}
                      </p>
                      <p className="MovieCard_info">
                        <span className="paraph_bolder">Size:</span> {fileSize}
                      </p>
                    </>
                  )}
                </>
              )}

              {trailer && (
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
                <DoneOutlineIcon className="item_movie_done_ico" />
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

// VALIDATION PROPTYPES
MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    altTitle: PropTypes.string,
    year: PropTypes.number.isRequired,
    duration: PropTypes.number,
    cover: PropTypes.string.isRequired,
    trailer: PropTypes.string,
    story: PropTypes.string,
    location: PropTypes.string,
    videoSupport: PropTypes.string,
    fileSize: PropTypes.string,
  }).isRequired,
  movieData: PropTypes.shape({
    genres: PropTypes.arrayOf(PropTypes.string),
    countries: PropTypes.arrayOf(PropTypes.string),
    director_name: PropTypes.string,
    screenwriters: PropTypes.arrayOf(PropTypes.string),
    music: PropTypes.arrayOf(PropTypes.string),
    studios: PropTypes.arrayOf(PropTypes.string),
    cast: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default MovieCard;
