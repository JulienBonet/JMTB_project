import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "./movieArtist.css";
import "../../assets/css/common_elements.css";
import "../../assets/css/scrollButton.css";
import MovieCount from "../../components/MovieCount/MovieCount";
import AlphabetDropdown from "../../components/AlphabetOption/AlphabetDropdown";
import Counter from "../../components/Counters/Counters";
import AlphabeticBtn from "../../components/AlphabeticBtn/AlphabeticBtn";
import ChronologicBtn from "../../components/ChronologicBtn/ChronologicBtn";
import MovieThumbnail from "../../components/MovieThumbnail/MovieThumbnail";
import ScreenwriterBear from "../../assets/ico/screenwiter-bear.jpeg";

function MovieScreenwriters() {
  // DATAS
  const screenWData = useLoaderData();
  const [movies, setMovies] = useState([]);
  const [data, setData] = useState(movies);
  const [search, setSearch] = useState("");
  const [sortOrderA, setSortOrderA] = useState("asc");
  const [sortOrderY, setSortOrderY] = useState("desc");
  const [movieAmount, setMovieAmount] = useState(0);
  const [selectedLetter, SetSelectedLetter] = useState("a");
  const [selectedScreenW, setselectedScreenW] = useState("");
  const [selecteScreenWByLetter, setSelecteScreenWByLetter] = useState([]);

  // REQUEST ALL ARTIST BY LETTER
  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/screenwriters/sorted/${selectedLetter}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((screenwritersDataLetter) => {
        setSelecteScreenWByLetter(screenwritersDataLetter);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [selectedLetter]);

  // REQUEST ALL MOVIES
  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/screenwriters/${
        selectedScreenW.id
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
        setMovieAmount(moviesData.length);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [selectedScreenW]);

  // SELECT LETTER
  const handleLetterChange = (letter) => {
    SetSelectedLetter(letter);
    setSearch("");
  };

  // SELECT ARTIST
  const handleArtistClick = (ScreenW) => {
    setselectedScreenW(ScreenW);
  };

  // SEARCH BAR
  const handleTyping = (e) => {
    let { value } = e.target;
    value = value.replace(/-/g, "").toLowerCase();
    setSearch(value);
    SetSelectedLetter("");
  };

  const filteredCasting = screenWData
    ? screenWData.filter(
        (dataItem) =>
          dataItem.name &&
          dataItem.name
            .toString()
            .toLowerCase()
            .replace(/-/g, "")
            .includes(search.toLowerCase())
      )
    : [];

  // AFFICHER LE NOMBRE D'ARTISTES
  const castingAmount = selecteScreenWByLetter.length;
  const selectedCastingAmount = filteredCasting.length;

  // SORTED BTN
  useEffect(() => {
    setData(movies);
  }, [movies]);

  const movieSortedA = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/screenwriters/${
          selectedScreenW.id
        }/sorted/0`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      setData(newData);
      setSortOrderA("asc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const movieSortedZ = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/screenwriters/${
          selectedScreenW.id
        }/sorted/1`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      setData(newData);
      setSortOrderA("desc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const movieSortedYear = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/screenwriters/${
          selectedScreenW.id
        }/sorted/2`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      setData(newData);
      setSortOrderY("asc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const movieSortedYearDesc = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/screenwriters/${
          selectedScreenW.id
        }/sorted/3`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      setData(newData);
      setSortOrderY("desc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // STYLE MUI
  const theme = createTheme({
    palette: {
      primary: {
        main: "#fefee2",
        light: "#ffa500",
        dark: "#e59100",
        contrastText: "#242105",
      },
      artists_list: {
        main: "#fefee2",
        light: "#ffa500",
        dark: "#e59100",
        contrastText: "#242105",
      },
    },
  });

  return (
    <main>
      <section className="artists_content">
        <section className="search_bar_contents">
          <section className="search_bar_position">
            <div className="search_bar_container">
              <input
                value={search}
                onChange={handleTyping}
                className="search_bar"
              />
            </div>
          </section>
        </section>
        <div className="dashed_secondary_bar" />
        <section>
          <section className="artists_seach_container">
            <section className="artists_groups">
              <AlphabetDropdown onLetterChange={handleLetterChange} />
              {search === "" && (
                <div className="artists_groups_content">
                  <ThemeProvider theme={theme}>
                    <Stack spacing={2} direction="row" className="artists_list">
                      {selecteScreenWByLetter.map((casting) => (
                        <Button
                          key={casting.id}
                          variant="text"
                          color="artists_list"
                          size="small"
                          className="artists_button"
                          onClick={() => handleArtistClick(casting)}
                        >
                          {casting.name}
                        </Button>
                      ))}
                    </Stack>
                  </ThemeProvider>
                </div>
              )}
              {search !== "" && (
                <div className="artists_groups_content">
                  <ThemeProvider theme={theme}>
                    <Stack spacing={2} direction="row" className="artists_list">
                      {filteredCasting.map((casting) => (
                        <Button
                          key={casting.id}
                          variant="text"
                          color="primary"
                          size="small"
                          className="artists_button"
                          onClick={() => handleArtistClick(casting)}
                        >
                          {casting.name}
                        </Button>
                      ))}
                    </Stack>
                  </ThemeProvider>
                </div>
              )}
              {search === "" && (
                <Counter origin="screenwriters" countAmount={castingAmount} />
              )}
              {search !== "" && (
                <Counter
                  origin="screenwriters"
                  countAmount={selectedCastingAmount}
                />
              )}
            </section>
            <section className="filmo_artists">
              {selectedScreenW === "" && (
                <section className="artists_bear">
                  <section className="artists_bear_position">
                    <div className="artists_bear_container">
                      <div className="artists_pitch_container">
                        <p className="artists_pitch">
                          QUEL SCENARISTE CHERCHONS NOUS ?
                        </p>
                      </div>
                      <img
                        src={ScreenwriterBear}
                        alt="a Bear screenwriter"
                        className="artists_bear_illustr"
                      />
                    </div>
                  </section>
                </section>
              )}
              {selectedScreenW !== "" && (
                <section className="artists_filmo">
                  <div className="scroll_zone scroll_zone_2">
                    <div className="artists_filmo_thumbs">
                      {data.map((filmo) => (
                        <MovieThumbnail key={filmo.id} data={filmo} />
                      ))}
                    </div>
                  </div>
                </section>
              )}
              <div className="btn_sort_container_search">
                <AlphabeticBtn
                  origin="artists"
                  onClick={sortOrderA === "asc" ? movieSortedZ : movieSortedA}
                />
                <MovieCount movieAmount={movieAmount} />
                <ChronologicBtn
                  origin="artists"
                  onClick={
                    sortOrderY === "asc" ? movieSortedYearDesc : movieSortedYear
                  }
                />
              </div>
            </section>
          </section>
        </section>
      </section>
    </main>
  );
}

export default MovieScreenwriters;
