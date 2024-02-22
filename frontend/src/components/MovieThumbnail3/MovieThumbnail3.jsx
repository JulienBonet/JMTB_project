import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import "./movieThumbnail3.css";
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

  const customStyles = {
    content: {
      width: "1500px", // Définir la largeur souhaitée
      margin: "auto", // Pour centrer la modal horizontalement
    },
  };

  return (
    <>
      <div className="thumbail_container3" key={ID_IMDb} onClick={openModal}>
        <img
          className="thumbail_cover3"
          src={cover_location}
          alt={`Cover ${title}`}
        />
        <p className="thumbail_title3">
          {title} <span className="thumbail_year3">({year})</span>
        </p>
      </div>

      {selectedMovie && (
        <Modal open={true} onClose={closeModal} className="Movie_Modal">
          <Box>
            <Container>
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
