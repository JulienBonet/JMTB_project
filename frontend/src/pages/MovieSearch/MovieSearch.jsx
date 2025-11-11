/* eslint-disable no-alert */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import { useState, useEffect, useRef } from "react";
import "./movieSearch.css";
import "./movieSearchMediaQueries.css";
import "../../assets/css/scrollButton.css";
import CachedIcon from "@mui/icons-material/Cached";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import YearDropdown from "../../components/YearOption/YearDropdown";
import CountryDropdown from "../../components/CountryOption/CountryDropdown";
import KindsDropdown from "../../components/KindOption/KindsDropdown";
import MovieThumbnail from "../../components/MovieThumbnail/MovieThumbnail";
import MovieCount from "../../components/MovieCount/MovieCount";
import LoaderCowardlySquid from "../../components/LoaderCowardlySquid/LoaderCowardlySquid";
import ToggleSortedButton from "../../components/ToggleSortedBtn/ToggleSortedButton";
import SideActionBar from "../../components/StickySideBar/StickySideBar";

// Virtualisation ligne par ligne
function getVisibleRows(movies, containerWidth, thumbnailWidth, gap) {
  // Largeur d’une vignette + l’espace entre elles
  const effectiveWidth = thumbnailWidth + gap;

  // Nombre de colonnes qu’on peut placer dans la largeur
  const cols = Math.max(1, Math.floor((containerWidth + gap) / effectiveWidth));

  // On découpe la liste des films en lignes
  const rows = [];
  for (let i = 0; i < movies.length; i += cols) {
    rows.push(movies.slice(i, i + cols));
  }

  return rows;
}

function MovieSearch() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTvShow, setSelectedTvShow] = useState("all");
  const [selectedKind, setSelectedKind] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isAscending, setIsAscending] = useState(true);
  const [isChronologicalAscending, setIsChronologicalAscending] =
    useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [openSideBar, setOpenSideBar] = useState(false);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1280);
  const [mobileToggleOpen, setMobileToggleOpen] = useState(false);

  //-----------------------------
  // FETCH INITIAL DATA
  //-----------------------------
  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/movies/search-filter`)
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
  }, []);

  //-----------------------------
  // TV SHOW FILTER
  //-----------------------------
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

  //-----------------------------
  // FILTERS SEARCH
  //-----------------------------
  useEffect(() => {
    let filtered = data.filter((movie) =>
      movie.title.toLowerCase().replace(/-/g, "").includes(search.toLowerCase())
    );

    if (selectedKind) {
      filtered = filtered.filter((movie) =>
        movie.genres?.split(", ").includes(selectedKind)
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (movie) =>
          Math.floor(movie.year / 10) * 10 === parseInt(selectedYear, 10)
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter((movie) =>
        movie.countries?.split(", ").includes(selectedCountry)
      );
    }

    setFilteredMovies(filtered);
  }, [data, search, selectedKind, selectedYear, selectedCountry]);

  const handleTyping = (e) => {
    let { value } = e.target;
    value = value.replace(/-/g, "").toLowerCase();
    setSearch(value);
  };

  const handleKindChange = (kind) => setSelectedKind(kind);
  const handleYearChange = (year) => setSelectedYear(year);
  const handleCountryChange = (country) => setSelectedCountry(country);
  const handleResetSearch = () => {
    setSearch("");
    setSelectedKind("");
    setSelectedYear("");
    setSelectedCountry("");
    setSelectedTvShow("all");
  };

  const movieAmount = filteredMovies.length;

  //-----------------------------
  // SORT FUNCTIONS
  //-----------------------------
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
  const handleAlphabeticBtnClick = () => {
    sortAlphabetically();
    setIsAscending(!isAscending);
  };

  const sortChronologically = () => {
    const sortedMovies = [...filteredMovies].sort((a, b) => {
      return isChronologicalAscending ? a.year - b.year : b.year - a.year;
    });
    setFilteredMovies(sortedMovies);
  };
  const handleChronologicBtnClick = () => {
    sortChronologically();
    setIsChronologicalAscending(!isChronologicalAscending);
  };

  //-----------------------------
  // UPDATE / DELETE MOVIE
  //-----------------------------
  const handleUpdateMovie = (updatedMovieData) => {
    const updatedMovies = data.map((movie) =>
      movie.id === updatedMovieData.id ? updatedMovieData : movie
    );
    setData(updatedMovies);
    setFilteredMovies(updatedMovies);
  };

  const handleDeleteMovie = (movieId) => {
    const updatedMovies = data.filter((movie) => movie.id !== movieId);
    setData(updatedMovies);
    setFilteredMovies(updatedMovies);
  };

  //-----------------------------
  // SX STYLES
  //-----------------------------
  const searchToggleGroupButtonSx = { borderRadius: "10px" };
  const searchToggleButtonSx = {
    color: "var(--color-01)",
    border: "solid 1px white",
    borderRadius: "10px",
    textTransform: "none",
    "&.Mui-selected": { color: "var(--color-03)" },
    "&:hover": {
      backgroundColor: "var(--color-05)",
      border: "solid 1px white",
    },
  };

  //-----------------------------
  // Resize container width pour responsive
  //-----------------------------
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // appel immédiat
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const THUMB_WIDTH = 200;
  const THUMB_GAP = 16;

  const visibleRows = getVisibleRows(
    filteredMovies,
    containerWidth,
    THUMB_WIDTH,
    THUMB_GAP
  );

  //-----------------------------
  // RETURN
  //-----------------------------
  return (
    <main className="Main_movieSearchPage">
      <section className="search_bar_contents">
        <section className="search_bar_position">
          {/* Search bar */}
          <div
            className="search_bar_container"
            // style={{
            //   padding:
            //     mobileToggleOpen || window.innerWidth > 768
            //       ? "10px 0"
            //       : "10px 0 0 0",
            // }}
          >
            <input
              value={search}
              onChange={handleTyping}
              className="search_bar"
              placeholder="recherche"
            />
          </div>
          {/* Toggle button pour mobile */}
          <button
            type="button"
            className="mobile_toggle_button"
            onClick={() => setMobileToggleOpen(!mobileToggleOpen)}
          >
            <span>{mobileToggleOpen ? "▲" : "▼"}</span>
          </button>
          {/* Dropdowns */}
          <div
            className="dropdown_search_container"
            style={{
              display:
                mobileToggleOpen || window.innerWidth > 768 ? "flex" : "none",
            }}
          >
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
          </div>
          {/* Filter buttons */}
          <div
            className="filter_container_MovieSearch"
            style={{
              display:
                mobileToggleOpen || window.innerWidth > 768 ? "flex" : "none",
            }}
          >
            <ToggleButtonGroup
              value={selectedTvShow}
              exclusive
              className="tvShowToggleGroup"
              onChange={(e, newValue) =>
                newValue && setSelectedTvShow(newValue)
              }
              sx={searchToggleGroupButtonSx}
            >
              <ToggleButton value="all" sx={searchToggleButtonSx}>
                TOUS
              </ToggleButton>
              <ToggleButton value="movies" sx={searchToggleButtonSx}>
                FILMS
              </ToggleButton>
              <ToggleButton value="series" sx={searchToggleButtonSx}>
                SERIES
              </ToggleButton>
            </ToggleButtonGroup>

            <ToggleSortedButton
              active={!!data}
              onClick={() => setOpenSideBar(!openSideBar)}
            />
          </div>
        </section>
      </section>

      <div className="dashed_secondary_bar" />
      <MovieCount movieAmount={movieAmount} />

      <section className="search_bear_position" ref={containerRef}>
        {isLoading ? (
          <div className="MovieThumbnails_container MovieThumbnails_Loader">
            <LoaderCowardlySquid />
          </div>
        ) : (
          <div className="MovieThumbnails_container">
            <SideActionBar
              onAlphabeticClick={handleAlphabeticBtnClick}
              onChronologicClick={handleChronologicBtnClick}
              onResetClick={handleResetSearch}
              openSideBar={openSideBar}
              origin="movies"
            />

            {filteredMovies.length > 0 ? (
              <div className="MovieThumbnails">
                {visibleRows.map((rowMovies) => (
                  <div
                    key={rowMovies.map((m) => m.id).join("-")}
                    className="MovieThumbnails_Row"
                  >
                    {rowMovies.map((movie) => (
                      <MovieThumbnail
                        key={movie.id}
                        data={movie}
                        onDeleteMovie={handleDeleteMovie}
                        onUpdateMovie={handleUpdateMovie}
                      />
                    ))}
                  </div>
                ))}
              </div>
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
        )}
      </section>
    </main>
  );
}

export default MovieSearch;
