import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import themaIco from "../../assets/ico/focus_thema.png";
import MovieFocusThumbnail from "../../components/MovieFocusThumbnail/MovieFocusThumbnail";
import MovieThumbnail from "../../components/MovieThumbnail/MovieThumbnail";
import ToggleSortedButton from "../../components/ToggleSortedBtn/ToggleSortedButton";
import SideActionBar from "../../components/StickySideBar/StickySideBar";
import "./movieFocus.css";

function MovieThema() {
  const themaData = useLoaderData();
  const [Focus, setFocus] = useState(themaData);
  const [selectedFocus, setSelectedFocus] = useState(null);
  const [films, setFilms] = useState([]);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [openMovieSideBar, setOpenMovieSideBar] = useState(false);
  const [sortFocusAsc, setSortFocusAsc] = useState(true);
  const [sortMoviesAsc, setSortMoviesAsc] = useState(true);
  const [sortMoviesYearAsc, setSortMoviesYearAsc] = useState(true);

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;
  console.info("Focus", Focus);

  //------------------------------------------
  // SORTED THEMAS
  //------------------------------------------
  const handleSortedAlphabeticalFocus = async () => {
    const url = sortFocusAsc
      ? `${backendUrl}/api/focus/1/sorted0` // ASC
      : `${backendUrl}/api/focus/1/sorted1`; // DESC

    const res = await fetch(url);
    const data = await res.json();
    setFocus(data);

    setSortFocusAsc(!sortFocusAsc);
  };

  const handleResetFocus = () => {
    setFocus(themaData);
  };

  //------------------------------------------
  // SELECTION D'UNE THEMA - FETCH DES FILMS
  //------------------------------------------
  const handleClickFocus = async (f) => {
    setSelectedFocus(f);

    // fetch des films du focus
    const res = await fetch(`${backendUrl}/api/focus/${f.id}/movies`);
    const data = await res.json();
    setFilms(data);
    console.info("data", data);
  };

  //------------------------------------------
  // SORTED MOVIES
  //------------------------------------------
  const handleSortedAlphabeticalMovies = async () => {
    if (!selectedFocus) return;

    const url = sortMoviesAsc
      ? `${backendUrl}/api/focus/${selectedFocus.id}/movies/sorted0` // ASC
      : `${backendUrl}/api/focus/${selectedFocus.id}/movies/sorted1`; // DESC

    const res = await fetch(url);
    const data = await res.json();
    setFilms(data);

    setSortMoviesAsc(!sortMoviesAsc);
  };

  const handleSortedChronologicalMovies = async () => {
    if (!selectedFocus) return;

    const url = sortMoviesYearAsc
      ? `${backendUrl}/api/focus/${selectedFocus.id}/movies/sorted2` // ASC
      : `${backendUrl}/api/focus/${selectedFocus.id}/movies/sorted3`; // DESC

    const res = await fetch(url);
    const data = await res.json();
    setFilms(data);

    setSortMoviesYearAsc(!sortMoviesYearAsc);
  };

  const handleResetMovies = async () => {
    if (!selectedFocus) return;

    const res = await fetch(
      `${backendUrl}/api/focus/${selectedFocus.id}/movies`
    );
    const data = await res.json();
    setFilms(data);

    setSortMoviesAsc(true);
    setSortMoviesYearAsc(true);
  };

  return (
    <main className="Main_movieFocusPage">
      <section className="search_bar_container_MF">
        <div className="search_bar_content_selectefFocus_MF">
          {selectedFocus ? (
            <>
              <IconButton
                onClick={() => setSelectedFocus("")}
                sx={{
                  color: "var(--color-01)",
                  border: "1px solid var(--color-01)",
                  borderRadius: "8px",
                  padding: "6px",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.05)",
                    borderColor: "var(--color-01)",
                  },
                }}
                aria-label="Retour"
              >
                <KeyboardReturnIcon />
              </IconButton>
              <h1 className="h1_titlePage_MF">{selectedFocus.name}</h1>
              <ToggleSortedButton
                active={!!films}
                onClick={() => setOpenMovieSideBar(!openMovieSideBar)}
              />
            </>
          ) : (
            <>
              <img src={themaIco} alt="Thémas" className="thema_icon" />
              <h1 className="h1_titlePage_MF">THEMAS</h1>
              <ToggleSortedButton
                active={!!themaData}
                onClick={() => setOpenSideBar(!openSideBar)}
              />
            </>
          )}
        </div>
      </section>
      <div className="dashed_secondary_bar" />
      <section className="main_content_MF">
        {!selectedFocus ? (
          <>
            <SideActionBar
              onAlphabeticClick={handleSortedAlphabeticalFocus}
              onResetClick={handleResetFocus}
              openSideBar={openSideBar}
              origin="focus"
            />
            <div className="thumbnails_container_MF">
              {Focus.map((f) => (
                <MovieFocusThumbnail
                  key={f.id}
                  data={f}
                  onClick={() => handleClickFocus(f)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <SideActionBar
              onAlphabeticClick={handleSortedAlphabeticalMovies}
              onChronologicClick={handleSortedChronologicalMovies}
              onResetClick={handleResetMovies}
              openSideBar={openMovieSideBar}
              origin="movies"
            />
            <div className="Movies_thumbnails_container_MF">
              {films.map((movie) => (
                <MovieThumbnail key={movie.id} data={movie} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default MovieThema;
