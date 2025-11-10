/* eslint-disable no-alert */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
import "./movieSearch.css";
import "./movieSearchMediaQueries.css";
import "../../assets/css/scrollButton.css";
import CachedIcon from "@mui/icons-material/Cached";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
// import AlphabeticBtn from "../../components/AlphabeticBtn/AlphabeticBtn";
// import ChronologicBtn from "../../components/ChronologicBtn/ChronologicBtn";
import YearDropdown from "../../components/YearOption/YearDropdown";
import CountryDropdown from "../../components/CountryOption/CountryDropdown";
import KindsDropdown from "../../components/KindOption/KindsDropdown";
import MovieThumbnail from "../../components/MovieThumbnail/MovieThumbnail";
import MovieCount from "../../components/MovieCount/MovieCount";
import LoaderCowardlySquid from "../../components/LoaderCowardlySquid/LoaderCowardlySquid";
import SideActionBar from "../../components/StickySideBar/StickySideBar";

function MovieSearch() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTvShow, setSelectedTvShow] = useState("all");
  const [selectedKind, setSelectedKind] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [filteredMovies, setFilteredMovies] = useState(data);
  const [isAscending, setIsAscending] = useState(true);
  const [isChronologicalAscending, setIsChronologicalAscending] =
    useState(true);
  const [isLoading, setIsLoading] = useState(true);

  //--------------
  // CHARGEMENT
  //--------------
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

  //--------------
  // SEARCH BAR
  //--------------
  const handleTyping = (e) => {
    let { value } = e.target;
    value = value.replace(/-/g, "").toLowerCase();
    setSearch(value);
  };

  //----------------------------------
  // FETCH DATA BACKEND SELON ISTVSHOW
  //----------------------------------
  useEffect(() => {
    setIsLoading(true);
    let url = `${import.meta.env.VITE_BACKEND_URL}/api/movies/filter/tvshow`;

    if (selectedTvShow === "movies") url += "?isTvShow=0";
    else if (selectedTvShow === "series") url += "?isTvShow=1";

    fetch(url)
      .then((res) => res.json())
      .then((moviesData) => {
        setData(moviesData);
        setFilteredMovies(moviesData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [selectedTvShow]);

  //-----------------
  // FILTERS OPTIONS
  //-----------------
  useEffect(() => {
    setIsLoading(true); // loader actif pendant le fetch
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/movies/search-filter`)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((moviesData) => {
        setData(moviesData);
        setFilteredMovies(moviesData); // remplir la liste filtrée au départ
        setIsLoading(false); // loader désactivé après réception des données
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setIsLoading(false); // loader désactivé même en cas d'erreur
      });
  }, []);

  useEffect(() => {
    let filteredMovies = data.filter((movie) =>
      movie.title.toLowerCase().replace(/-/g, "").includes(search.toLowerCase())
    );

    if (selectedKind) {
      filteredMovies = filteredMovies.filter((movie) =>
        movie.genres?.split(", ").includes(selectedKind)
      );
    }

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

    setFilteredMovies(filteredMovies);
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
    setSelectedTvShow("all");
  };

  //-----------------
  // MOVIE AMOUNT
  //-----------------
  const movieAmount = filteredMovies.length;

  //------------------------
  // ALPHABETICAL SORT BTN
  //------------------------
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

  //------------------------
  // CHRONOLIGICAL SORT BTN
  //------------------------
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

  //-------------------------------------------------------
  // MISE A JOUR AFFICHAGE SI UPDATE MOVIE DANS MOVIECARD
  //-------------------------------------------------------
  const handleUpdateMovie = async (updatedMovieData) => {
    const updatedMovies = data.map((movie) =>
      movie.id === updatedMovieData.id ? updatedMovieData : movie
    );
    setData(updatedMovies);
    setFilteredMovies(updatedMovies); // Mettez à jour la liste filtrée si nécessaire
  };

  //-------------------------------------------------------
  // MISE A JOUR AFFICHAGE SI DELETE MOVIE DANS MOVIECARD
  //-------------------------------------------------------
  const handleDeleteMovie = (movieId) => {
    const updatedMovies = data.filter((movie) => movie.id !== movieId);
    setData(updatedMovies);
    setFilteredMovies(updatedMovies); // Mettez à jour la liste filtrée
  };

  //-----------
  // SX STYLES
  //-----------

  const searchToggleGroupButtonSx = {
    borderRadius: "8px",
  };

  const searchToggleButtonSx = {
    color: "var(--color-01)",
    border: "solid 1px white",
    textTransform: "none",
    "&.Mui-selected": {
      color: "var(--color-02)",
    },
    "&:hover": {
      color: "var(--color-03)",
    },
  };

  //-----------
  // RETURN
  //-----------
  return (
    <main className="Main_movieSearchPage">
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
          <ToggleButtonGroup
            value={selectedTvShow}
            exclusive
            className="tvShowToggleGroup"
            onChange={(e, newValue) => newValue && setSelectedTvShow(newValue)}
            sx={searchToggleGroupButtonSx}
          >
            <ToggleButton value="all" sx={searchToggleButtonSx}>
              Tous
            </ToggleButton>
            <ToggleButton value="movies" sx={searchToggleButtonSx}>
              Films
            </ToggleButton>
            <ToggleButton value="series" sx={searchToggleButtonSx}>
              Séries
            </ToggleButton>
          </ToggleButtonGroup>
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

            {/* <AlphabeticBtn onClick={handleAlphabeticBtnClick} />
            <ChronologicBtn onClick={handleChronologicBtnClick} />
            <CachedIcon
              className="reset_search_btn"
              onClick={handleResetSearch}
            /> */}
          </div>

          <div className="search_bar_container_responsive">
            <input
              value={search}
              onChange={handleTyping}
              className="search_bar"
              placeholder="recherche"
            />
          </div>
        </section>
      </section>

      <div className="dashed_secondary_bar" />
      <MovieCount movieAmount={movieAmount} />

      <section className="search_bear_position">
        {isLoading && (
          <div className="MovieThumbnails_container MovieThumbnails_Loader">
            <LoaderCowardlySquid />
          </div>
        )}
        {!isLoading && (
          <div className="MovieThumbnails_container">
            <SideActionBar
              onAlphabeticClick={handleAlphabeticBtnClick}
              onChronologicClick={handleChronologicBtnClick}
              onResetClick={handleResetSearch}
              // selectedItems={selectedItems} // ou l’équivalent selon ta logique
              origin="movies"
            />
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
        )}
      </section>
    </main>
  ); // return
} // function MovieSearch()

export default MovieSearch;
