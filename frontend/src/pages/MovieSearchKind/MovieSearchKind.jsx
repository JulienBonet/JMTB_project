import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Stack, Button } from "@mui/material";
import "./MovieSearchKind.css";
import "../../assets/css/scrollButton.css";
import MovieCount from "../../components/MovieCount/MovieCount";
import MovieThumbail3 from "../../components/MovieThumbnail3/MovieThumbnail3";
import BearKinds from "../../assets/ico/camera_Bear_03.jpeg";
import AlphabeticBtn from "../../components/AlphabeticBtn/AlphabeticBtn";
import ChronologicBtn from "../../components/ChronologicBtn/ChronologicBtn";

function MovieSearchKind() {
  // DATAS
  const kindsData = useLoaderData();
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedButton, setSelectedButton] = useState("");
  const [sortOrderA, setSortOrderA] = useState("asc");
  const [sortOrderY, setSortOrderY] = useState("desc");
  const [currentRow, setCurrentRow] = useState(1);

  // REQUEST ALL GENRES
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/kinds/${selectedGenre}`)
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
  }, [selectedGenre]);

  const movieSortedA = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/kinds/${selectedGenre}/sorted/0`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      setMovies(newData);
      setSortOrderA("asc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const movieSortedZ = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/kinds/${selectedGenre}/sorted/1`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      setMovies(newData);
      setSortOrderA("desc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const movieSortedYear = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/kinds/${selectedGenre}/sorted/2`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      setMovies(newData);
      setSortOrderY("asc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const movieSortedYearDesc = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/kinds/${selectedGenre}/sorted/3`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      setMovies(newData);
      setSortOrderY("desc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // SELECT GENRE
  const handleChoice = (genre) => {
    setSelectedGenre(genre);
    setSelectedButton(genre);
  };

  // PAGINATION BUTTONS GENRES

  const itemsPerRow = 10;
  const totalRows = Math.ceil(kindsData.length / itemsPerRow);
  const startRowIndex = (currentRow - 1) * itemsPerRow;
  const endRowIndex = startRowIndex + itemsPerRow;
  const genresForRow = kindsData
    .slice(startRowIndex, endRowIndex)
    .map((item) => item.genre);

  const handleRowUp = () => {
    const nextRow = currentRow === totalRows ? 1 : currentRow + 1;
    setCurrentRow(nextRow);
  };

  const handleRowDown = () => {
    const nextRow = currentRow === 1 ? totalRows : currentRow - 1;
    setCurrentRow(nextRow);
  };

  // STYLE BUTTONS GENRES
  const theme = createTheme({
    palette: {
      JmdbColorKindNav: {
        main: "#00D9C0",
        light: "#ffc45e",
        dark: "#e59100",
        contrastText: "#242105",
      },
      JmdbColorKindNav2: {
        main: "#ffa500",
        light: "#ffa500",
        dark: "#e59100",
        contrastText: "#242105",
      },
      primary: {
        main: "#00d9c0",
      },
    },
  });

  // MOVIE AMOUNT
  const movieAmount = 0;
  const movieAmountKind = movies.length;

  // EXPAND SORTED BTN
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (selectedGenre !== "") {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [selectedGenre]);
  return (
    <main>
      <section className="search_kind_contents">
        <section className="search_kind_position">
          <div className="arrow_container arrow_container_back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="30"
              viewBox="0 -960 960 960"
              width="30"
              fill="white"
              onClick={handleRowDown}
              role="button"
              aria-label="Previous"
              tabIndex="0"
              cursor="pointer"
            >
              <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
            </svg>
          </div>
          <div className="search_kind_container">
            <ThemeProvider theme={theme}>
              <Stack spacing={2} direction="row" className="Kind_Choice">
                {genresForRow.map((genre) => (
                  <Button
                    key={genre.id}
                    value={genre}
                    onClick={() => handleChoice(genre)}
                    variant={
                      selectedButton === genre ? "contained" : "outlined"
                    }
                    color="JmdbColorKindNav"
                    size="medium"
                    className="btn_Kind_Choice"
                  >
                    {genre}
                  </Button>
                ))}
              </Stack>
            </ThemeProvider>
          </div>
          <div className="arrow_container arrow_container_forward">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="30"
              viewBox="0 -960 960 960"
              width="30"
              fill="white"
              onClick={handleRowUp}
              role="button"
              aria-label="next"
              tabIndex="0"
              cursor="pointer"
            >
              <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
            </svg>
          </div>
        </section>
      </section>
      <div className="dashed_secondary_bar" />
      <section className="kinds_bloc_position">
        {selectedGenre === "" && (
          <section className="kinds_bear_position">
            <div className="kinds_bear_container">
              <div className="kinds_pitch_container">
                <p className="kinds_pitch">
                  QUEL STYLE DE FILMS CHERCHONS NOUS ?
                </p>
              </div>
              <img
                src={BearKinds}
                alt="Bear Kinds on camera"
                className="kinds_bear_illustr"
              />
            </div>
          </section>
        )}
        {selectedGenre !== "" && (
          <section className="MovieThumbnails_Kind_container">
            <div className="scroll_zone">
              <div className="MovieThumbnails_kind">
                {movies.map((movieData) => (
                  <MovieThumbail3 key={movieData.id} data={movieData} />
                ))}
              </div>
            </div>
          </section>
        )}
        <div className="btn_sort_container_kind">
          <AlphabeticBtn
            selectedItems={selectedGenre}
            style={{
              height: expanded ? "37px" : "0",
              fontSize: expanded ? "1rem" : "0",
              padding: expanded ? "10px 0" : "0",
              border: expanded ? "solid 1px var(--color-01)" : "0",
              borderTop: expanded ? "0" : "none",
              transition: "height 0.3s ease-in",
            }}
            onClick={sortOrderA === "asc" ? movieSortedZ : movieSortedA}
          />
          {selectedGenre === "" && <MovieCount movieAmount={movieAmount} />}
          {selectedGenre !== "" && <MovieCount movieAmount={movieAmountKind} />}
          <ChronologicBtn
            selectedItems={selectedGenre}
            style={{
              height: expanded ? "37px" : "0",
              fontSize: expanded ? "1rem" : "0",
              padding: expanded ? "10px 0" : "0",
              border: expanded ? "solid 1px var(--color-01)" : "0",
              borderTop: expanded ? "0" : "none",
              transition: "height 0.3s ease-in",
            }}
            onClick={
              sortOrderY === "asc" ? movieSortedYearDesc : movieSortedYear
            }
          />
          {/* <CountryBtn />
          <DurationBtn /> */}
        </div>
      </section>
    </main>
  );
}

export default MovieSearchKind;
