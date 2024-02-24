import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import "./movieThumbnail2.css";
import MovieCard from "../MovieCard/MovieCard";

function MovieThumbnail2({ data }) {
  const { title, year, cover } = data;

  const [selectedMovie, setSelectedMovie] = useState(null);

  const openModal = () => {
    setSelectedMovie(data);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <div
        className="thumbail_container2"
        role="button"
        tabIndex={0}
        onClick={openModal}
        onKeyDown={openModal}
      >
        <img className="thumbail_cover2" src={cover} alt={`Cover ${title}`} />
        <p className="thumbail_title2">
          {title} <span className="thumbail_year2">({year})</span>
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
              <MovieCard movie={selectedMovie} />
            </Container>
          </Box>
        </Modal>
      )}
    </>
  );
}

// VALIDATION PROPTYPES
MovieThumbnail2.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    cover: PropTypes.string.isRequired,
  }).isRequired,
};

export default MovieThumbnail2;
