import { useState } from "react";
import PropTypes from "prop-types";
import "./movieCard.css";
import ReactPlayer from "react-player";
import Arrow from "../../assets/ico/outline_play_arrow_white_24dp.png";

function MovieCard({ movie }) {
  const {
    title,
    title2,
    year,
    country,
    genre,
    duration,
    director,
    screenwriter,
    music,
    studio,
    casting,
    trailer,
    story,
    support,
    location,
    cover_location,
    file_size,
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
              src={cover_location}
              alt={`Cover ${title}`}
            />
          </div>
          <div className="infos_bloc_1">
            <p className="MovieCard_title">{title}</p>
            <div className="divider"></div>
            {isTrailerVisible ? (
              <div className="MovieCard_trailer">
                <ReactPlayer url={trailer} className="video_player" />
              </div>
            ) : (
              <>
                <p className="MovieCard_info">{title2}</p>
                <p className="MovieCard_info">
                  <span className="paraph_bolder">Genre:</span> {genre}
                </p>
                <p className="MovieCard_info">
                  <span className="paraph_bolder">Année:</span> {year}
                </p>
                <p className="MovieCard_info">
                  <span className="paraph_bolder">Pays:</span> {country}
                </p>
                <p className="MovieCard_info">
                  <span className="paraph_bolder">Durée:</span> {duration}mn
                </p>
                <div className="divider_dashed"></div>
                {/* Autres détails du film */}
                {director && (
                  <p className="MovieCard_info">
                    <span className="paraph_bolder paraph_color_2">
                      Réalisateur:
                    </span>{" "}
                    {director}
                  </p>
                )}
                {screenwriter && (
                  <p className="MovieCard_info">
                    <span className="paraph_bolder paraph_color_2">
                      Scénariste:
                    </span>{" "}
                    {screenwriter}
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
                {studio && (
                  <p className="MovieCard_info">
                    <span className="paraph_bolder paraph_color_2">
                      Studio:
                    </span>{" "}
                    {studio}
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
                <div className="divider"></div>
              </>
            )}
          </div>
        </section>

        <section className="MC_line2">
          {isTrailerVisible ? (
            <div className="MovieCard_trailer"></div>
          ) : (
            <>
              <p className="MovieCard_info paraph_bolder">Résumé:</p>
              <p className="MovieCard_info MovieCard_story  paraph_height">
                {story}
              </p>
              <div className="divider_dashed"></div>
              <p className="MovieCard_info">
                <span className="paraph_bolder">Support:</span> {support}
              </p>

              {support === FichierMultimedia && (
                <>
                  <p className="MovieCard_info paraph_height">
                    <span className="paraph_bolder">Emplacement:</span>{" "}
                    {location}
                  </p>
                  <p className="MovieCard_info">
                    <span className="paraph_bolder">Size:</span> {file_size}
                  </p>
                </>
              )}
            </>
          )}

          {trailer && (
            <div className="MovieCard_trailer">
              <div className="divider_dashed divider_trailer"></div>
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
