import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import "./movieArtist.css";
import "./movieArtistMediaQueries.css";
import ArtistList from "../../components/ArtistList/ArtistList";
import ArtistFilmo from "../../components/ArtistFilmo/ArtistFilmo";

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

  // REQUEST ALL MOVIES by ARTIST
  // useEffect(() => {
  //   fetch(
  //     `${import.meta.env.VITE_BACKEND_URL}/api/screenwriters/${
  //       selectedScreenW.id
  //     }`
  //   )
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((moviesData) => {
  //       setMovies(moviesData);
  //       setMovieAmount(moviesData.length);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching user data:", error);
  //     });
  // }, [selectedScreenW]);

  const fetchMoviesByScreenwriter = () => {
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
  };

  useEffect(() => {
    fetchMoviesByScreenwriter();
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

  const filteredscreenWriter = screenWData
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

  // ARTISTS AMOUNT
  const screenWriterAmount = selecteScreenWByLetter.length;
  const selectedscreenWriterAmount = filteredscreenWriter.length;

  // SORTED BTN
  useEffect(() => {
    setData(movies);
  }, [movies]);

  // REQUEST ALL MOVIES SORTED ALPHABETICAL ASC
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

  // REQUEST ALL MOVIES SORTED ALPHABETICAL DESC
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

  // REQUEST ALL MOVIES SORTED CHRONOLOGICAL ASC
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

  // REQUEST ALL MOVIES SORTED CHRONOLOGICAL DESC
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

  // PROPS FOR TEXTS & IMAGE
  const origin = "screenwriters";

  // DELETE MOVIE transmis en prop à MovieCard
  const handleDeleteMovie = async (movieId) => {
    console.info("Tentative de suppression du film avec ID:", movieId);
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?"
    );
    if (!confirmDelete) {
      console.info("Suppression annulée par l'utilisateur.");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/movie/${movieId}`,
        {
          method: "DELETE",
        }
      );

      console.info("Réponse du serveur:", response); // Log de la réponse du serveur

      if (response.ok) {
        fetchMoviesByScreenwriter();
        // Alerte pour confirmer la suppression
        window.alert("Film supprimé avec succès");
        console.info("Film supprimé avec succès");
      } else {
        window.alert("Erreur lors de la suppression du film");
        console.error(
          "Erreur lors de la suppression du film",
          await response.text()
        ); // Log l'erreur
      }
    } catch (error) {
      console.error("Erreur durant la suppression:", error);
    }
  };

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
                placeholder="recherche scénariste"
              />
            </div>
          </section>
        </section>
        <div className="dashed_secondary_bar" />
        <section>
          <section className="artists_seach_container">
            <ArtistList
              handleLetterChange={handleLetterChange}
              search={search}
              theme={theme}
              selectedByLetter={selecteScreenWByLetter}
              filteredArtist={filteredscreenWriter}
              handleArtistClick={handleArtistClick}
              origin={origin}
              artistAmount={screenWriterAmount}
              selectedArtistAmount={selectedscreenWriterAmount}
            />
            <ArtistFilmo
              selectedArtist={selectedScreenW}
              origin={origin}
              data={data}
              sortOrderA={sortOrderA}
              movieSortedZ={movieSortedZ}
              movieSortedA={movieSortedA}
              sortOrderY={sortOrderY}
              movieSortedYearDesc={movieSortedYearDesc}
              movieSortedYear={movieSortedYear}
              movieAmount={movieAmount}
              onUpdateMovie={fetchMoviesByScreenwriter}
              onDeleteMovie={handleDeleteMovie}
            />
          </section>
        </section>
      </section>
    </main>
  ); // return
} // function MovieScreenwriters()

export default MovieScreenwriters;
