import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import MovieFocusThumbnail from "../../components/MovieFocusThumbnail/MovieFocusThumbnail";
import MovieThumbnail from "../../components/MovieThumbnail/MovieThumbnail";
import ToggleSortedButton from "../../components/ToggleSortedBtn/ToggleSortedButton";
// import SideActionBar from "../../components/StickySideBar/StickySideBar";
import "./movieFocus.css";

function MovieThema() {
  const themaData = useLoaderData();

  const [selectedFocus, setSelectedFocus] = useState(null);
  const [films, setFilms] = useState([]);

  const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;

  //------------------------------------------
  // SELECTION D'UNE THEMA - FETCH DES FILMS
  //------------------------------------------
  const handleClickFocus = async (focus) => {
    setSelectedFocus(focus);

    // fetch des films du focus
    const res = await fetch(`${backendUrl}/api/focus/${focus.id}/movies`);
    const data = await res.json();
    setFilms(data);
    console.info("data", data);
  };

  return (
    <main className="Main_movieFocusPage">
      <section className="search_bar_container_MF">
        {selectedFocus ? (
          <div className="search_bar_content_selectefFocus_MF">
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
            <h1 className="h1_titlePage_MF">
              {selectedFocus ? selectedFocus.name : "THEMAS"}
            </h1>
            <ToggleSortedButton />
          </div>
        ) : (
          <div className="search_bar_content_MF">
            <h1 className="h1_titlePage_MF">
              {selectedFocus ? selectedFocus.name : "THEMAS"}
            </h1>
          </div>
        )}
      </section>
      <div className="dashed_secondary_bar" />
      <section className="main_content_MF">
        {!selectedFocus ? (
          <div className="thumbnails_container_MF">
            {themaData.map((focus) => (
              <MovieFocusThumbnail
                key={focus.id}
                data={focus}
                onClick={() => handleClickFocus(focus)}
              />
            ))}
          </div>
        ) : (
          <div className="Movies_thumbnails_container_MF">
            {films.map((movie) => (
              <MovieThumbnail key={movie.id} data={movie} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default MovieThema;
