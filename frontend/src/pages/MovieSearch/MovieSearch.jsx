/* eslint-disable no-alert */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import "./movieSearch.css";
import "./movieSearchMediaQueries.css";
import "../../assets/css/scrollButton.css";
import CachedIcon from "@mui/icons-material/Cached";
import AlphabeticBtn from "../../components/AlphabeticBtn/AlphabeticBtn";
import ChronologicBtn from "../../components/ChronologicBtn/ChronologicBtn";
import YearDropdown from "../../components/YearOption/YearDropdown";
import CountryDropdown from "../../components/CountryOption/CountryDropdown";
import KindsDropdown from "../../components/KindOption/KindsDropdown";
import MovieThumbnail from "../../components/MovieThumbnail/MovieThumbnail";
import MovieCount from "../../components/MovieCount/MovieCount";
import LoaderCowardlySquid from "../../components/LoaderCowardlySquid/LoaderCowardlySquid";

function MovieSearch() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedKind, setSelectedKind] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [filteredMovies, setFilteredMovies] = useState(data);
  const [isAscending, setIsAscending] = useState(true);
  const [isChronologicalAscending, setIsChronologicalAscending] =
    useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/movies/search-filter`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((moviesData) => {
        setData(moviesData);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  // SEARCH BAR
  const handleTyping = (e) => {
    let { value } = e.target;
    value = value.replace(/-/g, "").toLowerCase();
    setSearch(value);
  };

  // FILTERS OPTIONS
  useEffect(() => {
    setIsLoading(true); // Définir isLoading à true au début du chargement

    // Simuler une opération de chargement asynchrone
    const loadData = () => {
      // Appliquer les filtres aux données initialData
      let filteredMovies = data.filter((movie) =>
        movie.title
          .toString()
          .toLowerCase()
          .replace(/-/g, "")
          .includes(search.toLowerCase())
      );

      if (selectedKind) {
        filteredMovies = filteredMovies.filter((movie) =>
          movie.genres?.split(", ").includes(selectedKind)
        );
      }

      // Filtre par année (décennie)
      if (selectedYear) {
        filteredMovies = filteredMovies.filter(
          (movie) =>
            Math.floor(movie.year / 10) * 10 === parseInt(selectedYear, 10)
        );
      }

      if (selectedCountry) {
        filteredMovies = filteredMovies.filter((movie) =>
          movie.countries?.split(", ").includes(selectedCountry)
        );
      }

      // Mettre à jour l'état des données filtrées
      setFilteredMovies(filteredMovies);
      setIsLoading(false);
    };

    // Simuler une durée de chargement
    const timeout = setTimeout(loadData, 1000);

    // Nettoyage lors du démontage du composant
    return () => clearTimeout(timeout);
  }, [data, search, selectedKind, selectedYear, selectedCountry]);

  const handleKindChange = (selectedKind) => {
    setSelectedKind(selectedKind);
  };

  const handleYearChange = (selectedYear) => {
    setSelectedYear(selectedYear);
  };

  const handleCountryChange = (selectedCountry) => {
    setSelectedCountry(selectedCountry);
  };

  const handleResetSearch = () => {
    setSearch("");
    setSelectedKind("");
    setSelectedYear("");
    setSelectedCountry("");
  };

  // MOVIE AMOUNT
  const movieAmount = filteredMovies.length;

  // ALPHABETICAL SORT BTN
  const ignoreSuffixes = [
    "le",
    "la",
    "l'",
    "un",
    "une",
    "des",
    "d'",
    "the",
    "a",
    "der",
  ];

  const removeIgnoredSuffixes = (title) => {
    const words = title.split(" ");
    const filteredWords = words.filter(
      (word) => !ignoreSuffixes.includes(word.toLowerCase())
    );
    return filteredWords.join(" ");
  };

  const sortAlphabetically = () => {
    const sortedMovies = [...filteredMovies].sort((a, b) => {
      const titleA = removeIgnoredSuffixes(a.title);
      const titleB = removeIgnoredSuffixes(b.title);

      return isAscending
        ? titleA.localeCompare(titleB, undefined, { sensitivity: "accent" })
        : titleB.localeCompare(titleA, undefined, { sensitivity: "accent" });
    });
    setFilteredMovies(sortedMovies);
  };
  // reverse alphabtical sort
  const handleAlphabeticBtnClick = () => {
    sortAlphabetically();
    setIsAscending(!isAscending);
  };

  // CHRONOLIGICAL SORT BTN
  const sortChronologically = () => {
    const sortedMovies = [...filteredMovies].sort((a, b) => {
      return isChronologicalAscending ? a.year - b.year : b.year - a.year;
    });
    setFilteredMovies(sortedMovies);
  };
  // reverse Chronological sort
  const handleChronologicBtnClick = () => {
    sortChronologically();
    setIsChronologicalAscending(!isChronologicalAscending);
  };

  // MISE A JOUR AFFICHAGE SI UPDATE MOVIE DANS MOVIECARD
  const handleUpdateMovie = async (updatedMovieData) => {
    const updatedMovies = data.map((movie) =>
      movie.id === updatedMovieData.id ? updatedMovieData : movie
    );
    setData(updatedMovies);
    setFilteredMovies(updatedMovies); // Mettez à jour la liste filtrée si nécessaire
  };

  //   const handleUpdateMovie = async (updatedMovieData) => {
  //   // Début de l'opération, changer le curseur en sablier
  //   document.body.style.cursor = 'wait';

  //   try {
  //     // Simule l'opération de mise à jour (par exemple un fetch ou une modification locale)
  //     const updatedMovies = data.map((movie) =>
  //       movie.id === updatedMovieData.id ? updatedMovieData : movie
  //     );
  //     setData(updatedMovies);
  //     setFilteredMovies(updatedMovies); // Mettez à jour la liste filtrée si nécessaire

  //     // Logique additionnelle si besoin (comme une confirmation visuelle)
  //     console.info("Mise à jour réussie", updatedMovieData);
  //   } catch (error) {
  //     console.error("Erreur lors de la mise à jour:", error);
  //   } finally {
  //     // Retour au curseur normal après la mise à jour
  //     document.body.style.cursor = 'default';
  //   }
  // };

  // DELETE MOVIE transmis en prop à MovieCard vi MovieThumbnail
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
        const updatedData = data.filter((movie) => movie.id !== movieId);
        setData(updatedData);
        setFilteredMovies(updatedData); // Mettez à jour la liste filtrée si nécessaire
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
      <section className="search_bar_contents">
        <section className="search_bar_position">
          <div className="search_bar_container">
            <input
              value={search}
              onChange={handleTyping}
              className="search_bar"
              placeholder="recherche"
            />
          </div>
          <div className="dropdown_search_container">
            <KindsDropdown
              onKindChange={handleKindChange}
              search={search}
              selectedKindData={selectedKind}
            />
            <CountryDropdown
              onCountryChange={handleCountryChange}
              search={search}
              selectedCountryData={selectedCountry}
            />
            <YearDropdown
              onYearChange={handleYearChange}
              search={search}
              selectedYearData={selectedYear}
            />
            <CachedIcon
              className="reset_search_btn"
              onClick={handleResetSearch}
            />
          </div>
        </section>
      </section>

      <div className="dashed_secondary_bar" />

      <section className="search_bear_position">
        {isLoading && (
          <div className="MovieThumbnails_container MovieThumbnails_Loader">
            <LoaderCowardlySquid />
          </div>
        )}
        {!isLoading && (
          <div className="MovieThumbnails_container">
            <div className="scroll_zone">
              <div className="MovieThumbnails">
                {filteredMovies.length > 0 ? (
                  filteredMovies.map((movieData) => (
                    <MovieThumbnail
                      key={movieData.id}
                      data={movieData}
                      onDeleteMovie={handleDeleteMovie}
                      onUpdateMovie={handleUpdateMovie}
                    />
                  ))
                ) : (
                  <div className="NoMovieMessageContainer">
                    <p>NO MOVIE FOUND ...</p>
                    <CachedIcon
                      className="reset_search_btn_NoMovie"
                      onClick={handleResetSearch}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="btn_sort_container_search">
          <AlphabeticBtn onClick={handleAlphabeticBtnClick} />
          <MovieCount movieAmount={movieAmount} />
          <ChronologicBtn onClick={handleChronologicBtnClick} />
        </div>
      </section>
    </main>
  ); // return
} // function MovieSearch()

export default MovieSearch;
