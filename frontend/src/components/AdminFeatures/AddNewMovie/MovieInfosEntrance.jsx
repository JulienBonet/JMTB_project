/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import axios from "axios";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { alpha, styled } from "@mui/material/styles";
import { pink } from "@mui/material/colors";
import Switch from "@mui/material/Switch";
import "./movieInfosEntrance.css";

function MovieInfosEntrance({ title, onMovieClick, handleCloseModalMIE }) {
  const [data, setData] = useState([]);
  const [fullData, setFullData] = useState(null);
  const [genres, setGenres] = useState([]); // Initialisation avec un tableau vide
  const [page, setPage] = useState(1);
  const [adult, setAdult] = useState(false);
  const [error, setError] = useState(null);
  const [genresLoaded, setGenresLoaded] = useState(false); // Nouvel état pour indiquer si les genres sont chargés

  const encodedTitle = encodeURIComponent(title);

  // Fonction pour récupérer les genres d'un film
  const getMovieGenres = (movie) => {
    // Vérifier si genres est chargé ou non
    if (!genresLoaded) {
      return "Chargement des genres...";
    }
    // Vérifier si movie.genre_ids est défini
    if (!movie.genre_ids) {
      return "";
    }
    const genreNames = [];
    movie.genre_ids.forEach((id) => {
      const genre = genres.find((genre) => genre.id === id);
      if (genre) {
        genreNames.push(genre.name);
      }
    });
    return genreNames.join(", ");
  };

  const handleAdultSwitchChange = (event) => {
    setAdult(event.target.checked);
    setPage(1);
  };

  const PinkSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: pink[600],
      "&:hover": {
        backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: pink[600],
    },
  }));

  useEffect(() => {
    setError(null);
    setData([]);

    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/search/movie`,
      params: {
        query: encodedTitle,
        include_adult: adult,
        language: "fr-FR",
        page,
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
      },
    };

    axios
      .request(options)
      .then((response) => {
        setData(response.data.results);
        setFullData(response.data);

        const genresOptions = {
          method: "GET",
          url: "https://api.themoviedb.org/3/genre/movie/list",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
          },
          params: {
            language: "fr-FR",
          },
        };

        axios
          .request(genresOptions)
          .then((response) => {
            setGenres(response.data.genres);
            setGenresLoaded(true); // Marquer les genres comme chargés
          })
          .catch((error) => {
            console.error(error);
            setError("Erreur lors de la récupération des genres");
          });
      })
      .catch((error) => {
        console.error(error);
        setError("Erreur lors de la récupération des films");
      });
  }, [page, adult, encodedTitle]);

  // Fonction pour faire défiler vers le haut de la page
  const scrollToTop = () => {
    const topElement = document.getElementById("top");
    if (topElement) {
      topElement.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // Fonction pour formater la date de sortie
  const getYear = (releaseDate) => {
    if (!releaseDate) {
      return "";
    }
    return releaseDate.substring(0, 4);
  };

  // Fonction pour gérer le clic sur le bouton précédent
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      scrollToTop();
    }
  };

  // Fonction pour gérer le clic sur le bouton suivant
  const handleNextPage = () => {
    if (fullData && page < fullData.total_pages) {
      setPage(page + 1);
      scrollToTop();
    }
  };

  // Afficher un message d'erreur s'il y en a un
  if (error) {
    return <div>{error}</div>;
  }

  // Afficher un message de chargement si les données complètes ne sont pas encore disponibles
  if (!fullData) {
    return <div>Chargement...</div>;
  }

  // Rendu du composant MovieInfosEntrance
  return (
    <section className="MIE_container">
      <span id="top" />
      <section className="MIE_contents">
        <h1 className="MIE-title">ENTRÉES DE RECHERCHE DE FILM</h1>
        <p className="MIE-movie_count">
          <span className="MIE_bold">{fullData.total_results}</span> film(s)
        </p>
        {fullData.total_pages > 1 && (
          <p className="MIE_PagesCounter">
            [ {page} / {fullData.total_pages} ]
          </p>
        )}
        <div className="adult_switch">
          <FormGroup>
            <FormControlLabel
              control={
                <PinkSwitch
                  checked={adult}
                  onChange={handleAdultSwitchChange}
                  name="adult"
                  color="primary"
                />
              }
              label="Inclure le contenu pour adultes"
            />
          </FormGroup>
        </div>
        <ul>
          {data.map((movie) => (
            <li key={movie.id} className="MIE_movie_bloc">
              <div className="MIE_movie_bloc_A1">
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="MIE_movie_image"
                  />
                )}
              </div>
              <div className="MIE_movie_bloc_A2">
                <h2 className="MIE_movie_title">{movie.title}</h2>
                {movie.original_title && (
                  <h3 className="MIE_movie_alt_title">
                    <span className="MIE_italic">{movie.original_title}</span>
                  </h3>
                )}
                {movie.adult === true && (
                  <p className="MIE_adult">X ADULTE X</p>
                )}
                <p className="MIE_movie_genre">
                  <span className="MIE_bold">Genre : </span>
                  {getMovieGenres(movie)}
                </p>
                <p className="MIE_movie_release">
                  <span className="MIE_bold">Sortie : </span>
                  {getYear(movie.release_date)}
                </p>
                <p className="MIE_movie_synopsis">
                  <span className="MIE_bold">Synopsis : </span>
                  {movie.overview}
                </p>
              </div>
              <div className="MIE_movie_bloc_A3">
                <button
                  onClick={() => {
                    onMovieClick(movie.id);
                    handleCloseModalMIE();
                  }}
                >
                  OK
                </button>
              </div>
            </li>
          ))}
        </ul>
        {fullData.total_pages > 1 && (
          <section className="MIE_NavBtn_Block MIE_NavBtn_Block_bottom">
            <button onClick={handlePrevPage} disabled={page === 1}>
              Précédent
            </button>
            <p className="MIE_PagesCounter">
              [ {page} / {fullData.total_pages} ]
            </p>
            <button
              onClick={handleNextPage}
              disabled={page === fullData.total_pages}
            >
              Suivant
            </button>
          </section>
        )}
      </section>
    </section>
  );
}

export default MovieInfosEntrance;
