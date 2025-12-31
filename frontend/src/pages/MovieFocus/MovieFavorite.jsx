import { useState, useEffect } from "react";
import { Container } from "@mui/material";
import MovieThumbnail from "../../components/MovieThumbnail/MovieThumbnail";
import ToggleSortedButton from "../../components/ToggleSortedBtn/ToggleSortedButton";
import SideActionBar from "../../components/StickySideBar/StickySideBar";
import favoriteIco from "../../assets/ico/favorite.png";
import "./movieFocus.css";
import "./movieFocusMediaqueries.css";

function Favorites() {
  const [movies, setMovies] = useState([]);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [sortMoviesAsc, setSortMoviesAsc] = useState(true);
  const [sortMoviesYearAsc, setSortMoviesYearAsc] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const origin = "movies";

  const fetchFavorites = async () => {
    const res = await fetch(`${backendUrl}/api/favorites`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) return;

    const data = await res.json();
    setMovies(data);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  //------------------------------------------
  // SORTED MOVIES
  //------------------------------------------
  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleSortedAlphabeticalMovies = async () => {
    const url = sortMoviesAsc
      ? `${backendUrl}/api/favorites/sorted0`
      : `${backendUrl}/api/favorites/sorted1`;

    const res = await fetch(url, { headers: authHeaders });
    const data = await res.json();
    setMovies(data);

    setSortMoviesAsc(!sortMoviesAsc);
  };

  const handleSortedChronologicalMovies = async () => {
    const url = sortMoviesYearAsc
      ? `${backendUrl}/api/favorites/sorted2`
      : `${backendUrl}/api/favorites/sorted3`;

    const res = await fetch(url, { headers: authHeaders });
    const data = await res.json();
    setMovies(data);

    setSortMoviesYearAsc(!sortMoviesYearAsc);
  };

  const handleResetMovies = async () => {
    const res = await fetch(`${backendUrl}/api/favorites`, {
      headers: authHeaders,
    });
    const data = await res.json();
    setMovies(data);

    setSortMoviesAsc(true);
    setSortMoviesYearAsc(true);
  };

  //------------------------------------------
  // UPDATE / DELETE
  //------------------------------------------
  const handleUpdateMovie = (updatedMovie) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === updatedMovie.id ? updatedMovie : m))
    );
  };

  const handleDeleteMovie = (movieId) => {
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
  };

  //------------------------------------------
  // RENDER
  //------------------------------------------
  return (
    <main className="Main_favoritesPage">
      {/* HEADER */}
      <section className="search_bar_container_MF">
        <div className="search_bar_content_selectefFocus_MF">
          <img src={favoriteIco} alt="favorite" className="thema_icon" />
          <h1 className="h1_titlePage_MF">MA LISTE</h1>
          <ToggleSortedButton
            active={!!movies}
            onClick={() => setOpenSideBar(!openSideBar)}
          />
        </div>
      </section>

      <div className="dashed_secondary_bar" />

      {/* CONTENT */}
      <section className="main_content_MF">
        <SideActionBar
          onAlphabeticClick={handleSortedAlphabeticalMovies}
          onChronologicClick={handleSortedChronologicalMovies}
          onResetClick={handleResetMovies}
          openSideBar={openSideBar}
          origin={origin}
        />

        <Container maxWidth={false}>
          {movies.length === 0 ? (
            <div className="NoFavoriteMessageContainer">
              <p>AUCUN FILM DANS VOTRE LISTE</p>
            </div>
          ) : (
            <div className="Movies_thumbnails_container_MF">
              {movies.map((movie) => (
                <MovieThumbnail
                  key={movie.id}
                  data={movie}
                  onUpdateMovie={handleUpdateMovie}
                  onDeleteMovie={handleDeleteMovie}
                  onFavoriteRemoved={fetchFavorites}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}

export default Favorites;
