import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Pagination, Stack, Button } from "@mui/material";
import "./MovieSearchKind.css";
import "../../assets/css/scrollButton.css";
import MovieCount from "../../components/MovieCount/MovieCount";
import MovieThumbail3 from "../../components/MovieThumbnail3/MovieThumbnail3";
import BearKinds from "../../assets/ico/camera_Bear_03.jpeg";
import AlphabeticBtn from "../../components/AlphabeticBtn/AlphabeticBtn";
import ChronologicBtn from "../../components/ChronologicBtn/ChronologicBtn";
// import CountryBtn from "../../components/CountryBtn/CountryBtn";
// import DurationBtn from "../../components/DurationBtn/DurationBtn";

function MovieSearchKind() {
  // database back//
  const kindsData = useLoaderData();
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedButton, setSelectedButton] = useState("");
  const [sortOrderA, setSortOrderA] = useState("asc");
  const [sortOrderY, setSortOrderY] = useState("desc");

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

  const handleChoice = (genre) => {
    setSelectedGenre(genre);
    setSelectedButton(genre);
  };

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
      console.info(newData);
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

  // STYLE Btn KIND ----------------------------------//
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
  // PAGINATION Btn KIND ----------------------------------//

  const itemsPerRow = 13;
  const totalRows = Math.ceil(kindsData.length / itemsPerRow);
  const [currentRow, setCurrentRow] = useState(1);
  const startRowIndex = (currentRow - 1) * itemsPerRow;
  const endRowIndex = startRowIndex + itemsPerRow;
  const genresForRow = kindsData
    .slice(startRowIndex, endRowIndex)
    .map((item) => item.genre);

  const handlePageChange = (event, value) => {
    setCurrentRow(value);
  };

  // AFFICHER LE NOMBRE DE FILMS ----------------------------------//
  const movieAmount = 0;
  const movieAmountKind = movies.length;

  return (
    <main>
      <section className="search_kind_contents">
        <section className="search_kind_position">
          <div className="search_kind_container">
            <ThemeProvider theme={theme}>
              <Stack spacing={2} direction="row" className="Kind_Choice">
                {genresForRow.map((genre, index) => (
                  <Button
                    key={index}
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
        </section>
      </section>
      <div className="dashed_secondary_bar" />
      <div className="Kinds_btn_rows_pagination">
        <Stack spacing={2} className="pagination_content">
          <Pagination
            count={totalRows}
            page={currentRow}
            onChange={handlePageChange}
            shape="rounded"
            size="small"
          />
        </Stack>
      </div>
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
            onClick={sortOrderA === "asc" ? movieSortedZ : movieSortedA}
          />
          <ChronologicBtn
            onClick={
              sortOrderY === "asc" ? movieSortedYearDesc : movieSortedYear
            }
          />
          {/* <CountryBtn />
          <DurationBtn /> */}
        </div>
      </section>
      {selectedGenre === "" && <MovieCount movieAmount={movieAmount} />}
      {selectedGenre !== "" && <MovieCount movieAmount={movieAmountKind} />}
    </main>
  );
}

export default MovieSearchKind;
