import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import "./movieThumbnail3.css";
import "./movieThumbnail3_MediaQueries.css";
import MovieCard from "../MovieCard/MovieCard";

function MovieThumbnail3({ data }) {
  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;

  const { title, year, cover } = data;

  const [selectedMovie, setSelectedMovie] = useState(null);

  const openModal = () => {
    setSelectedMovie(data);
  };

  const closeModal = () => {
    setSelectedMovie(null);
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
          src={`${backendUrl}/images/${cover}`}
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
              <MovieCard movie={selectedMovie} />
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
