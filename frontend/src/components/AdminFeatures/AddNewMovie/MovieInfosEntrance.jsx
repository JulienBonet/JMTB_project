/* eslint-disable react/button-has-type */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./movieInfosEntrance.css";

function MovieInfosEntrance() {
  const [data, setData] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://api.themoviedb.org/3/search/movie?query=2001&include_adult=true&language=fr-FR&page=1",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMmE5ZDM3MjAyY2EzMDA0NWQyYTU3NThkYjQ5ODc4ZiIsInN1YiI6IjY1OTlkNGY4NmU5MzhhMDA5MzFiNzI5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7Yebg6Ufdusdly-MNReQ_u-OiZp4WPeEX0cQmNPH8FA",
      },
    };

    axios
      .request(options)
      .then((response) => {
        setData(response.data.results);

        // Récupérer les noms de genres en français
        const genresOptions = {
          method: "GET",
          url: "https://api.themoviedb.org/3/genre/movie/list",
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMmE5ZDM3MjAyY2EzMDA0NWQyYTU3NThkYjQ5ODc4ZiIsInN1YiI6IjY1OTlkNGY4NmU5MzhhMDA5MzFiNzI5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7Yebg6Ufdusdly-MNReQ_u-OiZp4WPeEX0cQmNPH8FA",
          },
          params: {
            language: "fr-FR",
          },
        };

        axios
          .request(genresOptions)
          .then((response) => {
            setGenres(response.data.genres);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Fonction pour récupérer les noms de genres d'un film
  const getMovieGenres = (movie) => {
    const genreNames = [];
    movie.genre_ids.forEach((id) => {
      const genre = genres.find((genre) => genre.id === id);
      if (genre) {
        genreNames.push(genre.name);
      }
    });
    return genreNames.join(", ");
  };

  const getYear = (releaseDate) => {
    if (!releaseDate) {
      return "";
    }
    return releaseDate.substring(0, 4);
  };

  return (
    <section className="MIE_container">
      <section className="MIE_contents">
        <h1 className="MIE-title">MOVIE SEARCH ENTRANCES</h1>
        <p className="MIE-movie_count">
          <span className="MIE_bold">{data.length}</span> movie(s)
        </p>
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
                {movie.adult === true && <p className="MIE_adult">X ADULT X</p>}
                <p className="MIE_movie_genre">
                  <span className="MIE_bold">Genre: </span>
                  {getMovieGenres(movie)}
                </p>
                <p className="MIE_movie_release">
                  <span className="MIE_bold">Release: </span>
                  {getYear(movie.release_date)}
                </p>
                <p className="MIE_movie_synopsis">
                  <span className="MIE_bold">Synopsis: </span>
                  {movie.overview}
                </p>
              </div>
              <div className="MIE_movie_bloc_A3">
                <button>OK</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

export default MovieInfosEntrance;
