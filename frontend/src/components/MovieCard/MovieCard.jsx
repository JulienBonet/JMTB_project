/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import { useState, useEffect, useRef } from "react";
import "./movieCard.css";
import ReactPlayer from "react-player";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ModeIcon from "@mui/icons-material/Mode";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import UndoIcon from "@mui/icons-material/Undo";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CachedIcon from "@mui/icons-material/Cached";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TransferList from "../AdminFeatures/AddNewMovie/MovieItemList";

function MovieCard({ movie, origin, onUpdateMovie }) {
  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;
  const [isModify, setIsModify] = useState(false);
  const [selectedKinds, setSelectedKinds] = useState([]);
  const [selectedDirectors, setSelectedDirectors] = useState([]);
  const [selectedCasting, setSelectedCasting] = useState([]);
  const [selectedScreenwriters, setSelectedScreenwriters] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState([]);
  const [selectedStudios, setSelectedStudios] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  // const [selectedLanguages, setSelectedLanguages] = useState([]);
  // const [selectedTags, setSelectedTags] = useState([]);

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

  // console.info("movieData1", movieData);

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

  const {
    genres,
    countries,
    directors,
    screenwriters,
    music,
    studios,
    casting,
  } = movieData;

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
          // console.info("data in fetch:", data);
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

  // UPDATE MODE

  const isModifyMode = () => {
    setIsModify(true);
  };

  const closeModifyMode = () => {
    setIsModify(false);
  };

  const handleUndo = () => {
    closeModifyMode();
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
  // console.info("image:", image);

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
        // console.info("Image successfully updated", updatedMovie.cover);
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
              genres: selectedKinds.map((genre) => genre.id),
              directors: selectedDirectors.map((director) => director.id),
              castings: selectedCasting.map((cast) => cast.id),
              screenwriters: selectedScreenwriters.map(
                (screenwriter) => screenwriter.id
              ),
              musics: selectedMusic.map((compositor) => compositor.id),
              studios: selectedStudios.map((studio) => studio.id),
              countries: selectedCountries.map((country) => country.id),
              // !!! ajouter les items que l'on met à jour !!!!
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

          // Rafraîchir les genres après la mise à jour
          const genresNames = updatedMovie[0].genres
            .map((g) => g.name)
            .join(", ");
          setSelectedKinds(genresNames); // Mets à jour les genres avec les nouvelles données
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

  // TRANSFERT LIST
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
    p: 4,
  };

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

  // Update des genres
  useEffect(() => {
    const fetchGenres = async () => {
      if (!genres) return; // Vérifie si genres est bien défini
      try {
        const genresArray = genres.split(", ").map(async (genreName) => {
          try {
            const response = await fetch(
              `${backendUrl}/api/kind/byname/${genreName}`
            );

            if (!response.ok) {
              console.warn(
                `Error fetching genre ${genreName}: ${response.statusText}`
              );
              return null; // Continue même si un genre échoue
            }

            const genre = await response.json();
            return genre;
          } catch (error) {
            console.warn(`Error fetching genre ${genreName}:`, error);
            return null; // Continue même si un genre échoue
          }
        });

        const genresData = (await Promise.all(genresArray)).filter(Boolean); // Filtre les null (en cas d'erreur)
        setSelectedKinds(genresData); // Met à jour avec [{ id, name }]
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, [genres]);

  const getSelectedKindsNames = (selectKinds) => {
    return selectKinds.map((kind) => kind.name).join(", ");
  };

  const handleSelectedKindsUpdate = (updatedSelectedKinds) => {
    setSelectedKinds(updatedSelectedKinds);
  };

  // update les directors
  useEffect(() => {
    const fetchDirectors = async () => {
      if (!directors) return; // Vérifie si directors est bien défini

      try {
        const directorsArray = directors
          .split(", ")
          .map(async (directorName) => {
            try {
              const response = await fetch(
                `${backendUrl}/api/director/byname/${directorName}`
              );
              if (!response.ok) {
                console.warn(
                  `Error fetching director ${directorName}: ${response.statusText}`
                );
                return null;
              }

              const director = await response.json();
              return director;
            } catch (error) {
              console.warn(`Error fetching director ${directorName}:`, error);
              return null; // Continue même si un director échoue
            }
          });

        // Assure-toi que le tableau est résolu avant d'appliquer .filter
        const directorsData = (await Promise.all(directorsArray)).filter(
          Boolean
        );
        setSelectedDirectors(directorsData); // Met à jour avec [{ id, name }]
      } catch (error) {
        console.error("Error fetching directors:", error);
      }
    };

    fetchDirectors();
  }, [directors]);

  const getSelectedDirectorsNames = (selectDirectors) => {
    return selectDirectors.map((director) => director.name).join(", ");
  };

  const handleSelectedDirectorsUpdate = (updatedSelectedDirectors) => {
    setSelectedDirectors(updatedSelectedDirectors);
  };

  // Update castings
  useEffect(() => {
    const fetchCastings = async () => {
      if (!casting) return; // Vérifie si casting est bien défini

      try {
        const castingsArray = casting.split(", ").map(async (castingName) => {
          try {
            const response = await fetch(
              `${backendUrl}/api/casting/byname/${castingName}`
            );
            if (!response.ok) {
              console.warn(
                `Error fetching casting ${castingName}: ${response.statusText}`
              );
              return null;
            }

            const castingN = await response.json();
            return castingN;
          } catch (error) {
            console.warn(`Error fetching casting ${castingName}:`, error);
            return null; // Continue même si un casting échoue
          }
        });

        const castingsData = (await Promise.all(castingsArray)).filter(Boolean);
        setSelectedCasting(castingsData); // Met à jour avec [{ id, name }]
      } catch (error) {
        console.error("Error fetching castings:", error);
      }
    };

    fetchCastings();
  }, [casting]);

  const getSelectedCastingNames = (selectCasting) => {
    return selectCasting.map((cast) => cast.name).join(", ");
  };

  const handleSelectedCastingUpdate = (updatedSelectedCasting) => {
    setSelectedCasting(updatedSelectedCasting);
  };

  // Update screenwriters
  useEffect(() => {
    const fetchScreenwriters = async () => {
      if (!screenwriters) return; // Vérifie si screenwriters est bien défini

      try {
        const screenwritersArray = screenwriters
          .split(", ")
          .map(async (screenwriterName) => {
            try {
              const response = await fetch(
                `${backendUrl}/api/screenwriter/byname/${screenwriterName}`
              );
              if (!response.ok) {
                console.warn(
                  `Error fetching screenwriter ${screenwriterName}: ${response.statusText}`
                );
                return null;
              }

              const screenwriter = await response.json();
              return screenwriter;
            } catch (error) {
              console.warn(
                `Error fetching screenwriter ${screenwriterName}:`,
                error
              );
              return null; // Continue même si un screenwriter échoue
            }
          });

        const screenwritersData = (
          await Promise.all(screenwritersArray)
        ).filter(Boolean);
        setSelectedScreenwriters(screenwritersData); // Met à jour avec [{ id, name }]
      } catch (error) {
        console.error("Error fetching screenwriter:", error);
      }
    };

    fetchScreenwriters();
  }, [screenwriters]);

  const getSelectedScreenwritersNames = (selectScreenwriters) => {
    return selectScreenwriters
      .map((screenwriter) => screenwriter.name)
      .join(", ");
  };
  const handleSelectedScreenwritersUpdate = (updatedSelectedScreenwriters) => {
    setSelectedScreenwriters(updatedSelectedScreenwriters);
  };

  // update les compositors
  useEffect(() => {
    const fetchMusics = async () => {
      if (!music) return; // Vérifie si music est bien défini

      try {
        const musicsArray = music.split(", ").map(async (musicName) => {
          try {
            const response = await fetch(
              `${backendUrl}/api/music/byname/${musicName}`
            );
            if (!response.ok) {
              console.warn(
                `Error fetching compositor ${musicName}: ${response.statusText}`
              );
              return null;
            }

            const musicN = await response.json();
            return musicN;
          } catch (error) {
            console.warn(`Error fetching compositor ${musicName}:`, error);
            return null; // Continue même si un music échoue
          }
        });

        const musicsData = (await Promise.all(musicsArray)).filter(Boolean);
        setSelectedMusic(musicsData); // Met à jour avec [{ id, name }]
      } catch (error) {
        console.error("Error fetching compositor:", error);
      }
    };

    fetchMusics();
  }, [music]);

  const getSelectedMusicNames = (selectMusic) => {
    return selectMusic.map((compositor) => compositor.name).join(", ");
  };

  const handleSelectedMusicUpdate = (updatedSelectedMusic) => {
    setSelectedMusic(updatedSelectedMusic);
  };

  // Update studios
  useEffect(() => {
    const fetchStudios = async () => {
      if (!studios) return; // Vérifie si studios est bien défini

      try {
        const studiosArray = studios.split(", ").map(async (studioName) => {
          try {
            const response = await fetch(
              `${backendUrl}/api/studio/byname/${studioName}`
            );
            if (!response.ok) {
              console.warn(
                `Error fetching studio ${studioName}: ${response.statusText}`
              );
              return null;
            }

            const studio = await response.json();
            return studio;
          } catch (error) {
            console.warn(`Error fetching studio ${studioName}:`, error);
            return null; // Continue même si un studio échoue
          }
        });

        const studiosData = (await Promise.all(studiosArray)).filter(Boolean);
        setSelectedStudios(studiosData); // Met à jour avec [{ id, name }]
      } catch (error) {
        console.error("Error fetching studios:", error);
      }
    };

    fetchStudios();
  }, [studios]);

  const getSelectedStudiosNames = (selectStudios) => {
    return selectStudios.map((studio) => studio.name).join(", ");
  };

  const handleSelectedStudiosUpdate = (updatedSelectedStudios) => {
    setSelectedStudios(updatedSelectedStudios);
  };

  // Update countries
  useEffect(() => {
    const fetchCountries = async () => {
      if (!countries) return; // Vérifie si countries est bien défini

      try {
        const countriesArray = countries
          .split(", ")
          .map(async (countryName) => {
            try {
              const response = await fetch(
                `${backendUrl}/api/country/byname/${countryName}`
              );
              if (!response.ok) {
                console.warn(
                  `Error fetching country ${countryName}: ${response.statusText}`
                );
                return null;
              }

              const country = await response.json();
              return country;
            } catch (error) {
              console.warn(`Error fetching country ${countryName}:`, error);
              return null; // Continue même si un country échoue
            }
          });

        const countriesData = (await Promise.all(countriesArray)).filter(
          Boolean
        );
        setSelectedCountries(countriesData); // Met à jour avec [{ id, name }]
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    };

    fetchCountries();
  }, [countries]);

  const getSelectedCountriesNames = (selectCountries) => {
    return selectCountries.map((country) => country.name).join(", ");
  };

  const handleSelectedCountriesUpdate = (updatedSelectedCountries) => {
    setSelectedCountries(updatedSelectedCountries);
  };

  // const getSelectedLanguagesNames = (selectedLanguages) => {
  //   return selectedLanguages.map((language) => language.name).join(", ");
  // };

  // const getSelectedTagsNames = (selectedTags) => {
  //   return selectedTags.map((tag) => tag.name).join(", ");
  // };

  // const handleSelectedLanguagesUpdate = (updatedSelectedLanguages) => {
  //   setSelectedLanguages(updatedSelectedLanguages);
  // };

  // const handleSelectedTagsUpdate = (updatedSelectedTags) => {
  //   setSelectedTags(updatedSelectedTags);
  // };

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
              <div className="box_item_form">
                <Box
                  component="form"
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
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                >
                  <TextField
                    id="outlined-read-only-input"
                    label="Genre(s)"
                    value={getSelectedKindsNames(selectedKinds)}
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
                    controls
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
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                >
                  <TextField
                    id="outlined-read-only-input"
                    label="Pays"
                    value={getSelectedCountriesNames(selectedCountries)}
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
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                >
                  <TextField
                    id="outlined-read-only-input"
                    label="Réalisateur(s)"
                    value={getSelectedDirectorsNames(selectedDirectors)}
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
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                >
                  <TextField
                    id="outlined-read-only-input"
                    label="Scénariste(s)"
                    value={getSelectedScreenwritersNames(selectedScreenwriters)}
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
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                >
                  <TextField
                    id="outlined-read-only-input"
                    label="Compositeur(s)"
                    value={getSelectedMusicNames(selectedMusic)}
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
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                >
                  <TextField
                    id="outlined-read-only-input"
                    label="Studio(s)"
                    value={getSelectedStudiosNames(selectedStudios)}
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
                  noValidate
                  autoComplete="off"
                  display="flex"
                  alignItems="center"
                >
                  <TextField
                    id="outlined-read-only-input"
                    label="Casting"
                    value={getSelectedCastingNames(selectedCasting)}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Box>
                <AddCircleOutlineIcon
                  className="Btn_Add_itemsPopUp_MovieCard"
                  onClick={() => handleOpenModal("casting")}
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
                  onClick={() => handleUndo()}
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
              selectedCasting={selectedCasting}
              onSelectedCastingUpdate={handleSelectedCastingUpdate}
              selectedScreenwriters={selectedScreenwriters}
              onSelectedScreenwritersUpdate={handleSelectedScreenwritersUpdate}
              selectedMusic={selectedMusic}
              onSelectedMusicUpdate={handleSelectedMusicUpdate}
              selectedStudios={selectedStudios}
              onSelectedStudiosUpdate={handleSelectedStudiosUpdate}
              selectedCountries={selectedCountries}
              onSelectedCountriesUpdate={handleSelectedCountriesUpdate}
            />
          </Box>
        </Modal>
      </div>
    </article>
  ); // end return
}

export default MovieCard;
