import { useState, useEffect } from "react";
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
  // ---- LISTE BOUTONS DIRECTORS -------------------//
  ////////////////////////////////////////////////////

  // Création d'une structure avec les noms complets des réalisateurs et leurs noms de famille
  const directorData = data
    .map((movieData) => {
      const fullName = movieData.director;
      if (fullName.trim() !== "") {
        const namesArray = fullName.split(" ");
        const lastName = namesArray[namesArray.length - 1];
        return { fullName, lastName };
      }
      return null;
    })
    .filter(Boolean);

  // Création d'un objet pour stocker les réalisateurs groupés par lettre
  const groupedDirectors = {};

  // Regrouper les réalisateurs par lettre
  directorData.forEach((director) => {
    const firstLetter = director.lastName[0].toUpperCase();
    if (!groupedDirectors[firstLetter]) {
      groupedDirectors[firstLetter] = [];
    }
    groupedDirectors[firstLetter].push(director.fullName);
  });

  // Trier les groupes par lettre
  const sortedGroupedDirectors = Object.keys(groupedDirectors).sort();

  // État local pour stocker le groupe sélectionné
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Créer une liste ordonnée et sans doublons des réalisateurs par défaut
  useEffect(() => {
    const defaultDirectorsList = directorData
      .map((director) => director.fullName)
      .filter((name, index, self) => self.indexOf(name) === index)
      .sort((a, b) => {
        const lastNameA = a.split(" ").pop(); // Récupérer le dernier mot de A
        const lastNameB = b.split(" ").pop(); // Récupérer le dernier mot de B
        return lastNameA.localeCompare(lastNameB); // Trier en utilisant localeCompare
      });

    setSelectedGroup(defaultDirectorsList);
  }, []);

  // Afficher les réalisateurs du groupe sélectionné
  const handleGroupClick = (letter) => {
    // Récupérer le groupe de réalisateurs associé à la lettre sélectionnée
    const directorsForLetter = groupedDirectors[letter];

    // Supprimer les doublons en utilisant un ensemble (Set) pour stocker les noms uniques
    const uniqueDirectors = [...new Set(directorsForLetter)];

    // Mettre à jour l'état pour afficher les réalisateurs sans doublons
    setSelectedGroup(uniqueDirectors);
  };

  /////////////////////////////////////////////////////
  // ---- MOVIES BY DIRECTORS -----------------------//
  ////////////////////////////////////////////////////

  // Ajouter un nouvel état local pour stocker les films du réalisateur sélectionné
  const [selectedDirectorFilms, setSelectedDirectorFilms] = useState("");

  // Créer une fonction pour mettre à jour les films du réalisateur sélectionné
  const handleDirectorClick = (directorName) => {
    // Filtrer les films pour le réalisateur sélectionné
    const filmsForDirector = data.filter(
      (movie) => movie.director === directorName
    );

    // Mettre à jour l'état local pour afficher les films du réalisateur sélectionné
    setSelectedDirectorFilms(filmsForDirector);
  };

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
  const movieAmount2 = selectedDirectorFilms.length;

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // ---------------- [RETURN] -----------------------------------------------------------------------//
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <main>
      <section className="directors_content">
        <section className="alphabet_menu">
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
        </section>
        <div className="dashed_secondary_bar" />
        <section className="directors_seach_container">
          <section className="directors_groups">
            <div className="directors_groups_content">
              <ThemeProvider theme={theme}>
                <Stack spacing={2} direction="row" className="directors_list">
                  {selectedGroup &&
                    selectedGroup.map((director, index) => (
                      <Button
                        key={index}
                        variant="text"
                        color="dir_list"
                        size="small"
                        className="director_button"
                        onClick={() => handleDirectorClick(director)}
                      >
                        {director}
                      </Button>
                    ))}
                </Stack>
              </ThemeProvider>
            </div>
          </section>

          {selectedDirectorFilms === "" && (
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
          {selectedDirectorFilms !== "" && (
            <section className="director_filmo">
              <div className="scroll_zone scroll_zone_2">
                <div className="director_filmo_thumbs">
                  {selectedDirectorFilms.map((filmo) => (
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
      {selectedDirectorFilms === "" && <MovieCount movieAmount={movieAmount} />}
      {selectedDirectorFilms !== "" && (
        <MovieCount movieAmount={movieAmount2} />
      )}
    </main>
  );
}

export default MovieDirectors;
