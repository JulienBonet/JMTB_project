/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import { useState } from "react";
import PropTypes from "prop-types";
import "./movieCard.css";
import ReactPlayer from "react-player";

function MovieCard({ movie }) {
  const {
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
  } = movie;

  const FichierMultimedia = "Fichier multimédia";

  // Gestion toggle
  const [isTrailerVisible, setIsTrailerVisible] = useState(false);
  const toggleTrailerVideo = () => {
    setIsTrailerVisible(!isTrailerVisible);
  };

  return (
    <article className="MovieCard">
      <div className="MovieCard_container">
        <section className="MC_line1">
          <div className="MovieCard_Cover_Position">
            <img
              className="MovieCard_cover"
              src={cover}
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
                  {/* <span className="paraph_bolder">Genre:</span> {genres} */}
                </p>
                <p className="MovieCard_info">
                  <span className="paraph_bolder">Année:</span> {year}
                </p>
                <p className="MovieCard_info">
                  {/* <span className="paraph_bolder">Pays:</span> {countries} */}
                </p>
                <p className="MovieCard_info">
                  <span className="paraph_bolder">Durée:</span> {duration}mn
                </p>
                <div className="divider_dashed" />
                {/* Autres détails du film */}
                {/* {director_name && (
                  <p className="MovieCard_info">
                    <span className="paraph_bolder paraph_color_2">
                      Réalisateur:
                    </span>{" "}
                    {director_name}
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
                )} */}
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

              {videoSupport === FichierMultimedia && (
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
              <div className="Toggle_video_player" onClick={toggleTrailerVideo}>
                <p className="MovieCard_info Toggle_video_btn">
                  {isTrailerVisible
                    ? "VOIR FICHE DU FILM"
                    : "VOIR BANDE ANNONCE"}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </article>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    title2: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    country: PropTypes.string.isRequired,
    genre: PropTypes.string.isRequired,
    langage: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    director: PropTypes.string.isRequired,
    screenwriter: PropTypes.string.isRequired,
    music: PropTypes.string.isRequired,
    studio: PropTypes.string.isRequired,
    casting: PropTypes.string.isRequired,
    trailer: PropTypes.string.isRequired,
    pitch: PropTypes.string.isRequired,
    story: PropTypes.string.isRequired,

    support: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    cover_location: PropTypes.string.isRequired,
    file_size: PropTypes.string.isRequired,
  }).isRequired,
};

export default MovieCard;
