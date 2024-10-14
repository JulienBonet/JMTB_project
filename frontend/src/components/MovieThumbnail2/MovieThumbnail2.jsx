/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import "./movieThumbnail2.css";
import MovieCard from "../MovieCard/MovieCard";

function MovieThumbnail2({ data }) {
  const origin = "movie";
  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;

  // Initialisation des données du film à partir des props
  const [movieData, setMovieData] = useState(data);

  const { title, year, cover } = movieData;

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

  return (
    <>
      <div
        className="thumbail_container2"
        role="button"
        tabIndex={0}
        onClick={openModal}
        onKeyDown={openModal}
      >
        <img
          className="thumbail_cover2"
          src={`${backendUrl}/images/${cover}`}
          alt={`Cover ${title}`}
        />
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
              <MovieCard
                movie={selectedMovie}
                origin={origin}
                onUpdateMovie={handleUpdateMovie}
              />
            </Container>
          </Box>
        </Modal>
      )}
    </>
  );
}

export default MovieThumbnail2;
