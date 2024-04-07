/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import "./movieSearch.css";
import "../../assets/css/scrollButton.css";
import CachedIcon from "@mui/icons-material/Cached";
import AlphabeticBtn from "../../components/AlphabeticBtn/AlphabeticBtn";
import ChronologicBtn from "../../components/ChronologicBtn/ChronologicBtn";
import YearDropdown from "../../components/YearOption/YearDropdown";
import CountryDropdown from "../../components/CountryOption/CountryDropdown";
import KindsDropdown from "../../components/KindOption/KindsDropdown";
import MovieThumbnail from "../../components/MovieThumbnail/MovieThumbnail";
import MovieCount from "../../components/MovieCount/MovieCount";
import BearSearch from "../../assets/ico/search_Bear_02.jpeg";

function MovieSearch() {
  const initialData = useLoaderData();
  const [search, setSearch] = useState("");
  const [selectedKind, setSelectedKind] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isAscending, setIsAscending] = useState(true);
  const [isChronologicalAscending, setIsChronologicalAscending] =
    useState(true);
  const [selectedItems, setSelectedItems] = useState("");

  // SEARCH BAR
  const handleTyping = (e) => {
    let { value } = e.target;
    value = value.replace(/-/g, "").toLowerCase();
    setSearch(value);
    setSelectedItems(value);
  };

  // FILTERS OPTIONS
  const applyFilters = () => {
    let filteredMovies = initialData.filter((movie) =>
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

    if (selectedYear) {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.year === selectedYear
      );
    }

    if (selectedCountry) {
      filteredMovies = filteredMovies.filter((movie) =>
        movie.countries?.split(", ").includes(selectedCountry)
      );
    }

    setFilteredMovies(filteredMovies);
  };

  useEffect(() => {
    applyFilters();
  }, [search, selectedKind, selectedYear, selectedCountry]);

  const handleKindChange = (selectedKind) => {
    setSelectedKind(selectedKind);
    setSelectedItems(selectedKind);
  };

  const handleYearChange = (selectedYear) => {
    setSelectedYear(selectedYear);
    setSelectedItems(selectedYear);
  };

  const handleCountryChange = (selectedCountry) => {
    setSelectedCountry(selectedCountry);
    setSelectedItems(selectedCountry);
  };

  const handleResetSearch = () => {
    setSearch("");
    setSelectedKind("");
    setSelectedYear("");
    setSelectedCountry("");
    setSelectedItems("");
  };

  // MOVIE AMOUNT
  const movieAmount = initialData.length;
  const movieAmountFiltered = filteredMovies.length;

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

  // Modifiez la fonction de tri pour inverser le sens de tri à chaque clic
  const handleChronologicBtnClick = () => {
    sortChronologically();
    setIsChronologicalAscending(!isChronologicalAscending);
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
        {/* Affichage lorsque la recherche est vide et aucun filtre n'est sélectionné */}
        {search === "" &&
          selectedKind === "" &&
          selectedYear === "" &&
          selectedCountry === "" && (
            <div className="search_bear_background_container">
              <div className="Search_pitch_container">
                <p className="Search_pitch">QUEL FILM CHERCHONS NOUS ?</p>
              </div>
              <img
                src={BearSearch}
                alt="Que cherchons-nous ?"
                className="search_bear_background"
              />
            </div>
          )}
        {/* Affichage lorsqu'un filtre est sélectionné */}
        {(search !== "" ||
          selectedKind !== "" ||
          selectedYear !== "" ||
          selectedCountry !== "") && (
          <div className="MovieThumbnails_container">
            <div className="scroll_zone">
              <div className="MovieThumbnails">
                {filteredMovies.map((movieData) => (
                  <MovieThumbnail key={movieData.id} data={movieData} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="btn_sort_container_search">
          <AlphabeticBtn
            onClick={handleAlphabeticBtnClick}
            selectedItems={selectedItems}
          />
          {search === "" &&
            selectedKind === "" &&
            selectedYear === "" &&
            selectedCountry === "" && <MovieCount movieAmount={movieAmount} />}
          {(search !== "" ||
            selectedKind !== "" ||
            selectedYear !== "" ||
            selectedCountry !== "") && (
            <MovieCount movieAmount={movieAmountFiltered} />
          )}
          <ChronologicBtn
            onClick={handleChronologicBtnClick}
            selectedItems={selectedItems}
          />
        </div>
      </section>
    </main>
  );
}

export default MovieSearch;
