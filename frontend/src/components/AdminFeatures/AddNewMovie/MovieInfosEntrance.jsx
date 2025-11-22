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

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
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

  // useEffect(() => {
  //   setError(null);
  //   setData([]);
  //   setGenresLoaded(false);

  //   const headers = {
  //     accept: "application/json",
  //     Authorization: `Bearer ${import.meta.env.VITE_APP_TMDB_AUTH_TOKEN}`,
  //   };

  //   // Requête pour les films
  //   const movieRequest = axios.get(
  //     "https://api.themoviedb.org/3/search/movie",
  //     {
  //       params: {
  //         query: encodedTitle,
  //         include_adult: adult,
  //         language: "fr-FR",
  //         page,
  //       },
  //       headers,
  //     }
  //   );

  //   // Requête pour les séries
  //   const tvRequest = axios.get("https://api.themoviedb.org/3/search/tv", {
  //     params: {
  //       query: encodedTitle,
  //       include_adult: adult,
  //       language: "fr-FR",
  //       page,
  //     },
  //     headers,
  //   });

  //   // On lance les deux en parallèle
  //   Promise.all([movieRequest, tvRequest])
  //     .then(([movieRes, tvRes]) => {
  //       // Ajouter un champ "type" pour distinguer films/séries
  //       const movieResults = movieRes.data.results.map((m) => ({
  //         ...m,
  //         media_type: "movie",
  //       }));
  //       const tvResults = tvRes.data.results.map((t) => ({
  //         ...t,
  //         media_type: "tv",
  //       }));

  //       // Fusionner les deux tableaux
  //       const combined = [...movieResults, ...tvResults];

  //       // Trier les résultats par popularité (optionnel)
  //       combined.sort((a, b) => b.popularity - a.popularity);

  //       setData(combined);

  //       // Pour la pagination (on peut choisir celle avec le plus de pages)
  //       setFullData({
  //         total_results: movieRes.data.total_results + tvRes.data.total_results,
  //         total_pages: Math.max(
  //           movieRes.data.total_pages,
  //           tvRes.data.total_pages
  //         ),
  //       });

  //       // Charger les genres (films + séries)
  //       const genresMovie = axios.get(
  //         "https://api.themoviedb.org/3/genre/movie/list",
  //         { headers, params: { language: "fr-FR" } }
  //       );
  //       const genresTV = axios.get(
  //         "https://api.themoviedb.org/3/genre/tv/list",
  //         { headers, params: { language: "fr-FR" } }
  //       );

  //       Promise.all([genresMovie, genresTV])
  //         .then(([movieGenres, tvGenres]) => {
  //           setGenres([
  //             ...movieGenres.data.genres,
  //             ...tvGenres.data.genres.filter(
  //               (tvG) => !movieGenres.data.genres.some((mG) => mG.id === tvG.id)
  //             ),
  //           ]);
  //           setGenresLoaded(true);
  //         })
  //         .catch(() => setError("Erreur lors de la récupération des genres"));
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       setError("Erreur lors de la récupération des données");
  //     });
  // }, [page, adult, encodedTitle]);

  // Fonction pour faire défiler vers le haut de la page

  useEffect(() => {
    setError(null);
    setData([]);
    setGenresLoaded(false);

    const fetchData = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/tmdb/search`, {
          params: { query: encodedTitle, include_adult: adult, page },
        });

        const { movieRes, tvRes, genresMovie, genresTV } = res.data;

        const movieResults = movieRes.results.map((m) => ({
          ...m,
          media_type: "movie",
        }));
        const tvResults = tvRes.results.map((t) => ({
          ...t,
          media_type: "tv",
        }));

        const combined = [...movieResults, ...tvResults].sort(
          (a, b) => b.popularity - a.popularity
        );

        setData(combined);
        setFullData({
          total_results: movieRes.total_results + tvRes.total_results,
          total_pages: Math.max(movieRes.total_pages, tvRes.total_pages),
        });

        setGenres([
          ...genresMovie.genres,
          ...genresTV.genres.filter(
            (tvG) => !genresMovie.genres.some((mG) => mG.id === tvG.id)
          ),
        ]);
        setGenresLoaded(true);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des données");
      }
    };

    fetchData();
  }, [page, adult, encodedTitle]);

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
          {data.map((item) => (
            <li
              key={`${item.media_type}-${item.id}`}
              className="MIE_movie_bloc"
            >
              <div className="MIE_movie_bloc_A1">
                {item.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="MIE_movie_image"
                  />
                )}
              </div>
              <div className="MIE_movie_bloc_A2">
                <h2 className="MIE_movie_title">
                  {item.title || item.name}{" "}
                  <span className="MIE_type_tag">
                    [{item.media_type === "movie" ? "Film" : "Série"}]
                  </span>
                </h2>
                {(item.original_title || item.original_name) && (
                  <h3 className="MIE_movie_alt_title">
                    <span className="MIE_italic">
                      {item.original_title || item.original_name}
                    </span>
                  </h3>
                )}
                {item.adult && <p className="MIE_adult">X ADULTE X</p>}
                <p className="MIE_movie_genre">
                  <span className="MIE_bold">Genre : </span>
                  {getMovieGenres(item)}
                </p>
                <p className="MIE_movie_release">
                  <span className="MIE_bold">Sortie : </span>
                  {getYear(item.release_date || item.first_air_date)}
                </p>
                <p className="MIE_movie_synopsis">
                  <span className="MIE_bold">Synopsis : </span>
                  {item.overview}
                </p>
              </div>
              <div className="MIE_movie_bloc_A3">
                <button
                  onClick={() => {
                    onMovieClick(item.id, item.media_type);
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
