import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import "./movieArtist.css";
// import "./movieArtistMediaQueries.css";
import ArtistList from "../../components/ArtistList/ArtistList";
import ArtistFilmo from "../../components/ArtistFilmo/ArtistFilmo";
import MovieArtistSearchBar from "../../components/MovieArtistSearchBar/MovieArtistSearchBar";

function MovieDirectors() {
  // DATAS
  const directorsData = useLoaderData();
  const [movies, setMovies] = useState([]);
  const [data, setData] = useState(movies);
  const [selectedDirector, setSelectedDirector] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrderA, setSortOrderA] = useState("asc");
  const [sortOrderY, setSortOrderY] = useState("desc");
  const [movieAmount, setMovieAmount] = useState(0);
  const [selectedLetter, SetSelectedLetter] = useState("a");
  const [selectedDirectorByLetter, setSelectedDirectorByLetter] = useState([]);

  // REQUEST ALL ARTIST BY LETTER
  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/directors/sorted/${selectedLetter}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((directorsDataLetter) => {
        setSelectedDirectorByLetter(directorsDataLetter);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [selectedLetter]);

  // REQUEST ALL MOVIES by ARTIST
  const fetchMoviesByDirector = () => {
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/directors/${selectedDirector.id}`
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
  };

  useEffect(() => {
    fetchMoviesByDirector();
  }, [selectedDirector]);

  // SELECT LETTER
  const handleLetterChange = (letter) => {
    SetSelectedLetter(letter);
    setSearch("");
  };

  // SELECT ARTIST
  const handleArtistClick = (director) => {
    setSelectedDirector(director);
  };

  // SEARCH BAR
  const handleTyping = (e) => {
    let { value } = e.target;
    value = value.replace(/-/g, "").toLowerCase();
    setSearch(value);
    SetSelectedLetter("");
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

  // ARTISTS AMOUNT
  const directorsAmount = selectedDirectorByLetter.length;
  const selectedDirectorAmount = filteredDirectors.length;

  // SORTED BTN
  useEffect(() => {
    setData(movies);
  }, [movies]);

  // REQUEST ALL MOVIES SORTED ALPHABETICAL ASC
  const movieSortedA = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/directors/${
          selectedDirector.id
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

  // REQUEST ALL MOVIES SORTED ALPHABETICAL DESC
  const movieSortedZ = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/directors/${
          selectedDirector.id
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

  // REQUEST ALL MOVIES SORTED CHRONOLOGICAL ASC
  const movieSortedYear = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/directors/${
          selectedDirector.id
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

  // REQUEST ALL MOVIES SORTED CHRONOLOGICAL DSC
  const movieSortedYearDesc = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/directors/${
          selectedDirector.id
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

  // PROPS FOR TEXTS & IMAGE
  const origin = "directors";

  // MISE A JOUR AFFICHAGE SI DELETE MOVIE DANS MOVIECARD
  const handleDeleteMovie = () => {
    fetchMoviesByDirector();
  };

  // FONCTION POUR BTN RESET SEARCH
  const handleResetSearch = () => {
    setSearch("");
    SetSelectedLetter("a"); // lettre par défaut
    setSelectedDirector("");
    setMovies([]);
    setData([]);
    setMovieAmount(0);
  };

  return (
    <main className="Main_movieArtistPage">
      <section className="artists_content">
        <section className="search_bar_contents">
          <MovieArtistSearchBar
            placeholder="recherche réalisateur"
            search={search}
            onSearchChange={handleTyping}
            onReset={handleResetSearch}
            selectedItem={selectedDirector}
            sortOrderA={sortOrderA}
            sortOrderY={sortOrderY}
            movieSortedA={movieSortedA}
            movieSortedZ={movieSortedZ}
            movieSortedYear={movieSortedYear}
            movieSortedYearDesc={movieSortedYearDesc}
          />
        </section>
      </section>
      <div className="dashed_secondary_bar" />
      <section>
        <section className="artists_seach_container">
          <ArtistList
            handleLetterChange={handleLetterChange}
            search={search}
            theme={theme}
            selectedByLetter={selectedDirectorByLetter}
            filteredArtist={filteredDirectors}
            handleArtistClick={handleArtistClick}
            origin={origin}
            artistAmount={directorsAmount}
            selectedArtistAmount={selectedDirectorAmount}
          />
          <ArtistFilmo
            selectedArtist={selectedDirector}
            origin={origin}
            data={data}
            sortOrderA={sortOrderA}
            movieSortedZ={movieSortedZ}
            movieSortedA={movieSortedA}
            sortOrderY={sortOrderY}
            movieSortedYearDesc={movieSortedYearDesc}
            movieSortedYear={movieSortedYear}
            movieAmount={movieAmount}
            onUpdateMovie={fetchMoviesByDirector}
            onDeleteMovie={handleDeleteMovie}
          />
        </section>
      </section>
    </main>
  ); // end return
} // end function MovieDirectors()

export default MovieDirectors;
