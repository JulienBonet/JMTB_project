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

function MovieCard({ movie, origin }) {
  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;
  const [isModify, setIsModify] = useState(false);

  // DATA
  const [movieData, setMovieData] = useState([]);
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
        </section>

        <section className="MC_line2">
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
                <span className="paraph_bolder">Support:</span> {videoSupport}
              </p>
              {vostfr ? (
                <p className="MovieCard_info paraph_height">
                  <span className="paraph_bolder">Version:</span> VOSTFR
                </p>
              ) : null}
              {multi ? (
                <p className="MovieCard_info paraph_height">
                  <span className="paraph_bolder">Version:</span> Multi-langues
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
        </section>

        <section className="Movie_editing_btn-container">
          <div className="divider_dashed divider_trailer" />
          <section className="Item_Movie_Editing_Buttons">
            {isModify ? (
              <>
                <UndoIcon
                  className="item_movie_undo_ico"
                  onClick={() => closeModifyMode()}
                />
                <DoneOutlineIcon className="item_movie_don_ico" />
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
