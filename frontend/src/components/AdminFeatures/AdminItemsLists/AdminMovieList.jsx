/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { Button, Container } from "@mui/material";
import Modal from "@mui/material/Modal";
import "./adminLists.css";
import PreviewIcon from "@mui/icons-material/Preview";
import DeleteIcon from "@mui/icons-material/Delete";
import MovieCard from "../../MovieCard/MovieCard";

function AdminMovieList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);

  const origin = "movie";

  const openModal = (movieData) => {
    setSelectedMovie(movieData);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  // REQUEST ALL MOVIES
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/movies`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((datas) => {
        setData(datas);
        setFilteredData(datas); // Set filtered data initially to all data
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, []);

  // Update filtered data when search term changes
  useEffect(() => {
    const filtered = data.filter((movieData) =>
      movieData.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  // PAGINATION
  const moviesPerPage = 50;
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredData.slice(indexOfFirstMovie, indexOfLastMovie);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // NAVIGATION VERS NEW MOVIE
  const navigate = useNavigate();

  const handleAddNewMovie = () => {
    navigate("/new_movie");
  };

  // Fonction pour Raffraichier l'affichage d'un film en cas d'update dans MovieCard
  const updateMovieData = (updatedMovie) => {
    setData((prevData) =>
      prevData.map((movie) =>
        movie.id === updatedMovie.id ? updatedMovie : movie
      )
    );
    setFilteredData((prevFilteredData) =>
      prevFilteredData.map((movie) =>
        movie.id === updatedMovie.id ? updatedMovie : movie
      )
    );

    // Mettre à jour aussi le film sélectionné pour refléter les modifications dans le modal
    if (selectedMovie && selectedMovie.id === updatedMovie.id) {
      setSelectedMovie(updatedMovie);
    }
  };

  // Fonction pour supprimer un film
  const handleDeleteMovie = async (id) => {
    console.info("Tentative de suppression du film avec ID:", id);
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?"
    );
    if (!confirmDelete) {
      console.info("Suppression annulée par l'utilisateur.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/movie/${id}`,
        {
          method: "DELETE",
        }
      );

      console.info("Réponse du serveur:", response); // Log de la réponse du serveur

      if (response.ok) {
        setData(data.filter((movie) => movie.id !== id)); // Met à jour la liste des films
        setFilteredData(filteredData.filter((movie) => movie.id !== id)); // Met à jour les données filtrées
        // Alerte pour confirmer la suppression
        window.alert("Film supprimé avec succès");
        console.info("Film supprimé avec succès");
      } else {
        window.alert("Erreur lors de la suppression du film");
        console.error(
          "Erreur lors de la suppression du film",
          await response.text()
        ); // Log l'erreur
      }
    } catch (error) {
      console.error("Erreur durant la suppression:", error);
    }
  };

  return (
    <section className="AdminItemsSection">
      <section className="HeaderAdminItemsSection">
        <div className="admin_Title_feat_container">
          <h1 className="admin_Title_feat">MOVIES LIST</h1>
        </div>
        <div className="admin_feat_tools_line">
          <div className="Admin_search_bar_container">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search_bar"
              placeholder="recherche"
            />
          </div>
          <Button variant="contained" onClick={handleAddNewMovie}>
            ADD NEW FILM
          </Button>
        </div>
      </section>
      <table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">TITLE</th>
            <th scope="col">YEAR</th>
            <th scope="col">DURATION</th>
            <th scope="col">SUPPORT</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <div className="LoaderTemp">LOADING...</div>
          ) : (
            currentMovies.map((movieData) => (
              <tr key={movieData.id}>
                <th scope="row">{movieData.id}</th>
                <td>{movieData.title}</td>
                <td>{movieData.year}</td>
                <td>{movieData.duration}</td>
                <td>{movieData.videoSupport}</td>
                <td>
                  <PreviewIcon
                    className="admin_tools_ico"
                    onClick={() => openModal(movieData)}
                  />
                </td>
                {/* <td>
                  <ModeIcon className="admin_tools_ico" />
                </td> */}
                <td>
                  <DeleteIcon
                    className="admin_tools_ico"
                    onClick={() => handleDeleteMovie(movieData.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          count={Math.ceil(filteredData.length / moviesPerPage)}
          shape="rounded"
          onChange={handlePageChange}
        />
      </Box>
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
                onUpdateMovie={updateMovieData}
              />
            </Container>
          </Box>
        </Modal>
      )}
    </section>
  );
}

export default AdminMovieList;
