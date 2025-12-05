/* eslint-disable no-alert */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import { useState, useEffect, useRef } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import "./movieSearch.css";
import "./movieSearchMediaQueries.css";
import "../../assets/css/scrollButton.css";
import CachedIcon from "@mui/icons-material/Cached";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import YearDropdown from "../../components/YearOption/YearDropdown";
import CountryDropdown from "../../components/CountryOption/CountryDropdown";
import KindsDropdown from "../../components/KindOption/KindsDropdown";
import MovieThumbnail from "../../components/MovieThumbnail/MovieThumbnail";
import MovieCount from "../../components/MovieCount/MovieCount";
import LoaderCowardlySquid from "../../components/LoaderCowardlySquid/LoaderCowardlySquid";
import ToggleSortedButton from "../../components/ToggleSortedBtn/ToggleSortedButton";
import SideActionBar from "../../components/StickySideBar/StickySideBar";

function MovieSearch() {
  const [movies, setMovies] = useState([]);

  // filtres / tri
  const [search, setSearch] = useState("");
  const [selectedKind, setSelectedKind] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTvShow, setSelectedTvShow] = useState("all");
  const [orderby, setOrderby] = useState("id");
  const [direction, setDirection] = useState("DESC");
  const [isLoading, setIsLoading] = useState(true);
  const [openSideBar, setOpenSideBar] = useState(false);

  // nombre de films
  const movieAmount = movies.length;

  // responsive / virtualisation
  const containerRef = useRef(null);
  // const [containerWidth, setContainerWidth] = useState(1280);
  const [mobileToggleOpen, setMobileToggleOpen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(window.innerWidth < 768);

  //-----------------------------
  // SUIVRE L'ETAT DE isNarrow
  //-----------------------------
  useEffect(() => {
    const handleResize = () => setIsNarrow(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -----------------------------------------------------------
  // Construction URL unifiée (utilise endpoint existant)
  // -----------------------------------------------------------
  const buildUrl = () => {
    const p = new URLSearchParams();

    if (search) p.append("search", search);
    if (selectedKind) p.append("kind", selectedKind);
    if (selectedCountry) p.append("country", selectedCountry);
    if (selectedYear) p.append("year", selectedYear);

    if (selectedTvShow !== "all") {
      // backend expects 0/1 for the old route; keep same semantics
      p.append("tvshow", selectedTvShow === "movies" ? 0 : 1);
    }

    p.append("orderby", orderby);
    p.append("direction", direction);

    return `${import.meta.env.VITE_BACKEND_URL}/api/movies/search-filter?${p.toString()}`;
  };

  // ------------------------------------------------------------------
  // Fetch principal (appelé automatiquement via useEffect ci-dessous)
  // ------------------------------------------------------------------
  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(buildUrl());
      if (!res.ok) {
        // tu peux adapter la gestion d'erreur
        console.error("Erreur fetch movies:", res.statusText);
        setMovies([]);
        return;
      }
      const moviesData = await res.json();
      setMovies(moviesData);
    } catch (err) {
      console.error("Erreur fetchMovies:", err);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // useEffect unique : fetch sur changement de filtres / tri / taille
  // ------------------------------------------------------------------
  useEffect(() => {
    fetchMovies();
  }, [
    search,
    selectedKind,
    selectedCountry,
    selectedYear,
    selectedTvShow,
    orderby,
    direction,
    isNarrow,
  ]);

  // ------------------------
  // Handlers UI
  // ------------------------
  const handleTyping = (e) => {
    let { value } = e.target;
    value = value.replace(/-/g, "").toLowerCase();
    setSearch(value);
  };

  const handleKindChange = (k) => setSelectedKind(k);
  const handleYearChange = (y) => setSelectedYear(y);
  const handleCountryChange = (c) => setSelectedCountry(c);

  // TRI via SideActionBar -> change orderby/direction which déclenche fetch
  const handleAlphabeticBtnClick = () => {
    setOrderby("title");
    setDirection((d) => (d === "ASC" ? "DESC" : "ASC"));
  };

  const handleChronologicBtnClick = () => {
    setOrderby("year");
    setDirection((d) => (d === "ASC" ? "DESC" : "ASC"));
  };

  const handleResetSearch = () => {
    setSearch("");
    setSelectedKind("");
    setSelectedCountry("");
    setSelectedYear("");
    setSelectedTvShow("all");
    setOrderby("id");
    setDirection("DESC");
  };

  // --------------------------------------------------------
  // UPDATE / DELETE MOVIE (modification locale de la liste)
  // --------------------------------------------------------
  const handleUpdateMovie = (updatedMovieData) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === updatedMovieData.id ? updatedMovieData : m))
    );
  };

  const handleDeleteMovie = (movieId) => {
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
  };

  //-----------------------------
  // SX STYLES
  //-----------------------------
  const searchToggleGroupButtonSx = { borderRadius: "10px" };
  const searchToggleButtonSx = {
    color: "var(--color-01)",
    border: "solid 1px white",
    borderRadius: "10px",
    height: "40px",
    textTransform: "none",
    "&.Mui-selected": { color: "var(--color-03)" },
    "&:hover": {
      backgroundColor: "var(--color-05)",
      border: "solid 1px white",
    },
  };

  const THUMB_WIDTH = 200;
  const THUMB_GAP = 16;
  const THUMB_HEIGHT = 300;

  //-----------------------------
  // RETURN
  //-----------------------------
  return (
    <main className="Main_movieSearchPage">
      <section className="search_bar_contents">
        <section className="search_bar_position">
          {/* Search bar */}
          <div className="search_bar_container">
            {/* <input
              value={search}
              onChange={handleTyping}
              className="search_bar search_bar_MovieSearchPage"
              placeholder="recherche"
            /> */}
            <TextField
              value={search}
              onChange={handleTyping}
              placeholder="Rechercher un film..."
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#aaa" }} />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearch("")} size="small">
                      <ClearIcon sx={{ color: "#888" }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                borderRadius: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "#f5f5f5",
                  "& fieldset": {
                    borderColor: "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--color-03)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--color-03)",
                    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
                  },
                },
                input: {
                  color: "#333",
                  "&::placeholder": {
                    color: "#aaa",
                    opacity: 1,
                  },
                },
              }}
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
              handleUpdateMovie={handleUpdateMovie}
              handleDeleteMovie={handleDeleteMovie}
            />
            <CountryDropdown
              onCountryChange={handleCountryChange}
              search={search}
              selectedCountryData={selectedCountry}
              handleUpdateMovie={handleUpdateMovie}
              handleDeleteMovie={handleDeleteMovie}
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
              active={movies.length > 0}
              onClick={() => setOpenSideBar(!openSideBar)}
            />
          </div>
        </section>
      </section>

      <div className="dashed_secondary_bar" />
      <MovieCount movieAmount={movieAmount} />

      <section className="search_moviesList_position" ref={containerRef}>
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

            {movies.length > 0 ? (
              <AutoSizer>
                {({ width, height }) => {
                  const columns = Math.max(
                    1,
                    Math.floor((width + THUMB_GAP) / (THUMB_WIDTH + THUMB_GAP))
                  );
                  const rowCount = Math.ceil(movies.length / columns);

                  // largeur totale occupée par la ligne
                  const totalRowWidth =
                    columns * (THUMB_WIDTH + THUMB_GAP) - THUMB_GAP;
                  const offsetX = Math.max(0, (width - totalRowWidth) / 2); // marge gauche pour centrer

                  return (
                    <Grid
                      columnCount={columns}
                      columnWidth={THUMB_WIDTH + THUMB_GAP}
                      rowCount={rowCount}
                      rowHeight={THUMB_HEIGHT + THUMB_GAP}
                      width={width}
                      height={height}
                    >
                      {({ columnIndex, rowIndex, style }) => {
                        const index = rowIndex * columns + columnIndex;
                        const movie = movies[index];
                        if (!movie) return null;

                        return (
                          <div
                            style={{
                              ...style,
                              left: style.left + offsetX, // ← décale chaque cellule pour centrer
                              width: THUMB_WIDTH,
                              height: THUMB_HEIGHT,
                              padding: THUMB_GAP / 2,
                              boxSizing: "border-box",
                            }}
                          >
                            <MovieThumbnail
                              key={movie.id}
                              data={movie}
                              onDeleteMovie={handleDeleteMovie}
                              onUpdateMovie={handleUpdateMovie}
                            />
                          </div>
                        );
                      }}
                    </Grid>
                  );
                }}
              </AutoSizer>
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
