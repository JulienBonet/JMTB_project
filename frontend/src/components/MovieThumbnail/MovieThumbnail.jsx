/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import "./movieThumbnail.css";
// import "./movieThumbnailMediaQueries.css";
import MovieCard from "../MovieCard/MovieCard";

function MovieThumbnail({ data, onDeleteMovie, onUpdateMovie }) {
  const origin = "movie";
  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;

  const { title, year, cover } = data;

  const [selectedMovie, setSelectedMovie] = useState(null);

  // Ouvre le modal avec le film sélectionné
  const openModal = () => {
    setSelectedMovie(data);
  };

  // Ferme le modal
  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <div
        className="thumbail_container"
        role="button"
        tabIndex={0}
        onClick={openModal}
        onKeyDown={openModal}
      >
        <img
          className="thumbail_cover"
          src={`${backendUrl}/images/${cover}`}
          alt={`Cover ${title}`}
        />
        <p className="thumbail_title">
          {title} <span className="thumbail_year">({year})</span>
        </p>
      </div>

      {selectedMovie && (
        <Modal open onClose={closeModal} className="Movie_Modal">
          <Box>
            <Container maxWidth="lg">
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
                onUpdateMovie={onUpdateMovie}
                onDeleteMovie={onDeleteMovie}
              />
            </Container>
          </Box>
        </Modal>
      )}
    </>
  );
}

export default MovieThumbnail;
