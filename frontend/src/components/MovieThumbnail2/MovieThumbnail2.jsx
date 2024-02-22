import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import "./movieThumbnail2.css";
import MovieCard from "../MovieCard/MovieCard";

function MovieThumbnail({ data }) {
  const { title, year, cover_location, ID_IMDb } = data;

  const [selectedMovie, setSelectedMovie] = useState(null);

  const openModal = () => {
    setSelectedMovie(data);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <div className="thumbail_container2" key={ID_IMDb} onClick={openModal}>
        <img
          className="thumbail_cover2"
          src={cover_location}
          alt={`Cover ${title}`}
        />
        <p className="thumbail_title2">
          {title} <span className="thumbail_year2">({year})</span>
        </p>
      </div>

      {selectedMovie && (
        <Modal open={true} onClose={closeModal} className="Movie_Modal">
          <Box>
            <Container maxWidth="lg">
              <p onClick={closeModal} className="modal_closed_btn">
                X Fermer
              </p>
              <MovieCard movie={selectedMovie} />
            </Container>
          </Box>
        </Modal>
      )}
    </>
  );
}

export default MovieThumbnail;
