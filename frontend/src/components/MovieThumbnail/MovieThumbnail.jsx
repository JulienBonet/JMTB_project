import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import "./movieThumbnail.css";
import MovieCard from "../MovieCard/MovieCard";

function MovieThumbnail({ data }) {
  const { title, year, cover, ID_IMDb } = data;
  console.info(cover);

  const [selectedMovie, setSelectedMovie] = useState(null);

  const openModal = () => {
    setSelectedMovie(data);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <div className="thumbail_container" key={ID_IMDb} onClick={openModal}>
        <img className="thumbail_cover" src={cover} alt={`Cover ${title}`} />
        <p className="thumbail_title">
          {title} <span className="thumbail_year">({year})</span>
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
