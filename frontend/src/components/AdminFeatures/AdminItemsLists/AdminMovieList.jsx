/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { Button, Container } from "@mui/material";
import Modal from "@mui/material/Modal";
import "./adminLists.css";
import PreviewIcon from "@mui/icons-material/Preview";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteIcon from "@mui/icons-material/Delete";
import MovieCard from "../../MovieCard/MovieCard";

function AdminMovieList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, []);

  // PAGINATION
  const moviesPerPage = 50;
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = data.slice(indexOfFirstMovie, indexOfLastMovie);

  const filteredData = currentMovies.filter((movieData) =>
    movieData.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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
          <Button
            variant="contained"
            onClick={() => console.info("Ajouter un film")}
          >
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
            filteredData.map((movieData) => (
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
                <td>
                  <ModeIcon className="admin_tools_ico" />
                </td>
                <td>
                  <DeleteIcon className="admin_tools_ico" />
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
          count={Math.ceil(data.length / moviesPerPage)}
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
              <MovieCard movie={selectedMovie} origin={origin} />
            </Container>
          </Box>
        </Modal>
      )}
    </section>
  );
}

export default AdminMovieList;
