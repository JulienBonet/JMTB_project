import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "../../components/MovieCount/MovieCount";
import "./movieDirectors.css";
import "../../assets/css/common_elements.css";
import "../../assets/css/scrollButton.css";
import data from "../../data/data.json";
import MovieCount from "../../components/MovieCount/MovieCount";
import MovieThumbnail from "../../components/MovieThumbnail/MovieThumbnail";
import DirectorBear from "../../assets/ico/director_bear_01.jpeg";

function MovieDirectors() {
  const directorsData = useLoaderData();
  const [selectedDirector, setSelectedDirector] = useState("");
  const [movies, setMovies] = useState([""]);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api//directors/${
        selectedDirector.id
      }`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setMovies(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [selectedDirector]);

  const handleDirectorClick = (director) => {
    setSelectedDirector(director);
  };

  /////////////////////////////////////////////////////
  // AFFICHER LE NOMBRE DE FILMS --------------------//
  /////////////////////////////////////////////////////
  const movieAmount = data.length;

  const theme = createTheme({
    palette: {
      dir_alphabet_Nav: {
        main: "#00D9C0",
        light: "#ffc45e",
        dark: "#e59100",
        contrastText: "#242105",
      },
      dir_list: {
        main: "#fefee2",
        light: "#ffa500",
        dark: "#e59100",
        contrastText: "#242105",
      },
    },
  });

  /////////////////////////////////////////////////////
  // ------ SCROLLBUTTON ---------------------------//
  ///////////////////////////////////////////////////
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    // Afficher le bouton quand on fait défiler la page
    const handleScroll = () => {
      if (document.documentElement.scrollTop > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Retirer l'écouteur d'événement lors du démontage du composant
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //////////////////////////////////////////////////////
  // -------AFFICHER LE NOMBRE DE FILMS --------------//
  //////////////////////////////////////////////////////
  const movieAmount2 = movies.length;

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // ---------------- [RETURN] -----------------------------------------------------------------------//
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <main>
      <section className="directors_content">
        {/* <section className="alphabet_menu">
          <ThemeProvider theme={theme}>
            <Stack spacing={2} direction="row" className="alphabet_buttons">
              {sortedGroupedDirectors.map((letter, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  shape="rounded"
                  color="dir_alphabet_Nav"
                  size="small"
                  className="group_button"
                  onClick={() => handleGroupClick(letter)}
                >
                  {letter}
                </Button>
              ))}
            </Stack>
          </ThemeProvider>
        </section> */}
        <div className="dashed_secondary_bar" />
        <section className="directors_seach_container">
          <section className="directors_groups">
            <div className="directors_groups_content">
              <ThemeProvider theme={theme}>
                <Stack spacing={2} direction="row" className="directors_list">
                  {directorsData.map((director) => (
                    <Button
                      key={director.id}
                      variant="text"
                      color="dir_list"
                      size="small"
                      className="director_button"
                      onClick={() => handleDirectorClick(director)} // Passer le nom du réalisateur
                    >
                      {director.name} {/* Afficher le nom du réalisateur */}
                    </Button>
                  ))}
                </Stack>
              </ThemeProvider>
            </div>
          </section>

          {selectedDirector === "" && (
            <section className="director_bear">
              <section className="director_bear_position">
                <div className="director_bear_container">
                  <div className="director_pitch_container">
                    <p className="director_pitch">
                      QUEL REALISATEUR CHERCHONS NOUS ?
                    </p>
                  </div>
                  <img
                    src={DirectorBear}
                    alt="a Bear director"
                    className="director_bear_illustr"
                  />
                </div>
              </section>
            </section>
          )}
          {selectedDirector !== "" && (
            <section className="director_filmo">
              <div className="scroll_zone scroll_zone_2">
                <div className="director_filmo_thumbs">
                  {movies.map((filmo) => (
                    <MovieThumbnail key={filmo.id} data={filmo} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </section>
      </section>

      {showButton && (
        <button className="scrollToTopButton" onClick={scrollToTop}>
          Remonter en haut
        </button>
      )}
      {selectedDirector === "" && <MovieCount movieAmount={movieAmount} />}
      {selectedDirector !== "" && <MovieCount movieAmount={movieAmount2} />}
    </main>
  );
}

export default MovieDirectors;
