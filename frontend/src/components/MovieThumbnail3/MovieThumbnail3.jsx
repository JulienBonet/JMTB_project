/* eslint-disable react/prop-types */
import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import "./movieThumbnail3.css";
import "./movieThumbnail3_MediaQueries.css";
import MovieCard from "../MovieCard/MovieCard";

function MovieThumbnail3({ data }) {
  const origin = "movie";
  const homepage = true;
  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;
  const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

  // Initialisation des données du film à partir des props
  const [movieData, setMovieData] = useState(data);

  const { title, cover: coverName } = movieData;
  const year = Number(movieData.year) || "";

  const [selectedMovie, setSelectedMovie] = useState(null);

  const openModal = () => {
    setSelectedMovie(data);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  // Fonction de callback pour mettre à jour les données après modification dans MovieCard
  const handleUpdateMovie = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/movies/${data.id}`);
      if (response.ok) {
        const updatedMovie = await response.json();
        setMovieData(updatedMovie); // Met à jour les données du film
      } else {
        console.error(
          "Erreur lors de la récupération des données mises à jour"
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données mises à jour:",
        error
      );
    }
  };

  const getCoverUrl = (cover) => {
    if (!cover) return `${CLOUDINARY_BASE_URL}/00_cover_default.jpg`;
    if (cover.startsWith("http")) return cover;
    return `${CLOUDINARY_BASE_URL}/${cover}`;
  };

  // without this: front homepage bug !
  // eslint-disable-next-line no-unused-vars
  const customStyles = {
    content: {
      width: "1500px",
      margin: "auto",
    },
  };

  return (
    <>
      <div
        className="thumbail_container3"
        role="button"
        tabIndex={0}
        onClick={openModal}
        onKeyDown={openModal}
      >
        <img
          className="thumbail_cover3"
          src={getCoverUrl(coverName)}
          alt={`Cover ${title}`}
        />
        <p className="thumbail_title3">
          {title} <span className="thumbail_year3">({year})</span>
        </p>
      </div>

      {selectedMovie && (
        <Modal open onClose={closeModal} className="Movie_Modal">
          <Box>
            <Container>
              <div
                onClick={closeModal}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    closeModal();
                  }
                }}
                role="button"
                tabIndex={0}
                className="modal_closed_btn"
              >
                X Fermer
              </div>
              <MovieCard
                movie={selectedMovie}
                origin={origin}
                onUpdateMovie={handleUpdateMovie}
                homepage={homepage}
              />
            </Container>
          </Box>
        </Modal>
      )}
    </>
  );
}

// VALIDATION PROPTYPES
MovieThumbnail3.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    cover: PropTypes.string.isRequired,
  }).isRequired,
};
export default MovieThumbnail3;
