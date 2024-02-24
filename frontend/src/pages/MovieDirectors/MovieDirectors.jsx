import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "./movieDirectors.css";
import "../../assets/css/common_elements.css";
import "../../assets/css/scrollButton.css";
// import data from "../../data/data.json";
import MovieCount from "../../components/MovieCount/MovieCount";
import MovieThumbnail from "../../components/MovieThumbnail/MovieThumbnail";
import DirectorBear from "../../assets/ico/director_bear_01.jpeg";

function MovieDirectors() {
  const directorsData = useLoaderData();
  const [selectedDirector, setSelectedDirector] = useState("");
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

  console.info(movies);

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
      .then((moviesData) => {
        setMovies(moviesData);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [selectedDirector]);

  const handleDirectorClick = (director) => {
    setSelectedDirector(director);
  };

  const handleTyping = (e) => {
    let { value } = e.target;
    value = value.replace(/-/g, "").toLowerCase();
    setSearch(value);
  };

  const filteredDirectors = directorsData
    ? directorsData.filter(
        (dataItem) =>
          dataItem.name &&
          dataItem.name
            .toString()
            .toLowerCase()
            .replace(/-/g, "")
            .includes(search.toLowerCase())
      )
    : [];

  // AFFICHER LE NOMBRE DE FILMS
  const movieAmount = movies.length;

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

  return (
    <main>
      <section className="directors_content">
        <section className="search_bar_contents">
          <section className="search_bar_position">
            <div className="search_bar_container">
              <span className="material-symbols-outlined">search</span>
              <input
                value={search}
                onChange={handleTyping}
                className="search_bar"
              />
            </div>
          </section>
        </section>
        <div className="dashed_secondary_bar" />
        <section className="directors_seach_container">
          <section className="directors_groups">
            {search === "" && (
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
                        onClick={() => handleDirectorClick(director)}
                      >
                        {director.name}
                      </Button>
                    ))}
                  </Stack>
                </ThemeProvider>
              </div>
            )}
            {search !== "" && (
              <div className="directors_groups_content">
                <ThemeProvider theme={theme}>
                  <Stack spacing={2} direction="row" className="directors_list">
                    {filteredDirectors.map((director) => (
                      <Button
                        key={director.id}
                        variant="text"
                        color="dir_list"
                        size="small"
                        className="director_button"
                        onClick={() => handleDirectorClick(director)}
                      >
                        {director.name}
                      </Button>
                    ))}
                  </Stack>
                </ThemeProvider>
              </div>
            )}
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

      <MovieCount movieAmount={movieAmount} />
    </main>
  );
}

export default MovieDirectors;
