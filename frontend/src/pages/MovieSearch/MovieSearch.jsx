/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-duplicate-props */
import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import "./movieSearch.css";
import "../../assets/css/scrollButton.css";
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
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [sortOrderA, setSortOrderA] = useState("asc");
  const [sortOrderY, setSortOrderY] = useState("desc");
  const [sortMovieByCountryOrderA, setSortMovieByCountryOrderA] =
    useState("asc");
  const [sortMovieByCountryOrderY, setSortMovieByCountryOrderY] =
    useState("desc");
  const [sortMovieByYearOrderA, setSortMovieByYearOrderA] = useState("asc");
  const [sortMovieByKindOrderA, setSortMovieByKindOrderA] = useState("asc");
  const [sortMovieByKindOrderY, setSortMovieByKindOrderY] = useState("desc");
  const [selectedKind, setSelectedKind] = useState("");
  const [selectedYear, SetSelectedYear] = useState("");
  const [selectedCountry, SetSelectedCountry] = useState("");
  const [selectedMoviesByKind, SetMoviesByKind] = useState([]);
  const [selectedMoviesByYear, SetMoviesByYear] = useState([]);
  const [selectedMoviesByCountry, SetMoviesByCountry] = useState([]);
  const [selectedItems, setSelectedItems] = useState("");
  const [expanded, setExpanded] = useState(false);

  // REQUEST ALL MOVIES SORTED ALPHABETICAL ASC
  const movieSortedA = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/movies/sorted/0`
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
        `${import.meta.env.VITE_BACKEND_URL}/api/movies/sorted/1`
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
        `${import.meta.env.VITE_BACKEND_URL}/api/movies/sorted/2`
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
        `${import.meta.env.VITE_BACKEND_URL}/api/movies/sorted/3`
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

  // REQUEST ALL MOVIES BY KINDS
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/kinds/${selectedKind}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((MovieBykind) => {
        SetMoviesByKind(MovieBykind);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [selectedKind]);

  // REQUEST ALL MOVIES BY KIND (SORTED ALPHABETICAL ASC)
  const MovieByKindsOrderA = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/kinds/${selectedKind}/sorted/0`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      SetMoviesByKind(newData);
      setSortMovieByKindOrderA("asc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // REQUEST ALL MOVIES BY KIND (SORTED ALPHABETICAL DESC)
  const MovieByKindsOrderZ = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/kinds/${selectedKind}/sorted/1`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      SetMoviesByKind(newData);
      setSortMovieByKindOrderA("desc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // REQUEST ALL MOVIES BY KIND (SORTED CHRONOLOGICAL ASC)
  const MovieByKindsOrderYasc = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/kinds/${selectedKind}/sorted/2`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      SetMoviesByKind(newData);
      setSortMovieByKindOrderY("asc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // REQUEST ALL MOVIES BY KIND (SORTED CHRONOLOGICAL DESC)
  const MovieByKindsOrderYdesc = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/kinds/${selectedKind}/sorted/3`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      SetMoviesByKind(newData);
      setSortMovieByKindOrderY("desc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // REQUEST ALL MOVIES BY YEAR
  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/movies/year/sorted/${selectedYear}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((MovieByYear) => {
        SetMoviesByYear(MovieByYear);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [selectedYear]);

  // REQUEST ALL MOVIES BY YEAR (SORTED ALPHABETICAL ASC)
  const MovieByYearOrderA = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/movies/year/sorted/0/${selectedYear}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      SetMoviesByYear(newData);
      setSortMovieByYearOrderA("asc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // REQUEST ALL MOVIES BY YEAR (SORTED ALPHABETICAL DESC)
  const MovieByYearOrderZ = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/movies/year/sorted/1/${selectedYear}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      SetMoviesByYear(newData);
      setSortMovieByYearOrderA("desc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // REQUEST ALL MOVIES BY COUNTRY
  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/movies/sorted/country/${selectedCountry}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((MovieBycountry) => {
        SetMoviesByCountry(MovieBycountry);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [selectedCountry]);

  // REQUEST ALL MOVIES BY COUNTRY (SORTED ALPHABETICAL ASC)
  const MovieByCountryOrderA = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/movies/sorted/country/sorted/0/${selectedCountry}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      SetMoviesByCountry(newData);
      setSortMovieByCountryOrderA("asc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // REQUEST ALL MOVIES BY COUNTRY (SORTED ALPHABETICAL DESC)
  const MovieByCountryOrderz = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/movies/sorted/country/sorted/1/${selectedCountry}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      SetMoviesByCountry(newData);
      setSortMovieByCountryOrderA("desc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // REQUEST ALL MOVIES BY COUNTRY (SORTED YEAR ASC)
  const MovieByCountryOrderYasc = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/movies/sorted/country/sorted/2/${selectedCountry}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      SetMoviesByCountry(newData);
      setSortMovieByCountryOrderY("asc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // REQUEST ALL MOVIES BY COUNTRY (SORTED YEAR DESC)
  const MovieByCountryOrderYdesc = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/movies/sorted/country/sorted/3/${selectedCountry}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      SetMoviesByCountry(newData);
      setSortMovieByCountryOrderY("desc");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // EXPAND SORTED BTN
  const handleExpandedChange = (value) => {
    setExpanded(value);
  };

  // SEARCH BAR
  const handleTyping = (e) => {
    let { value } = e.target;
    value = value.replace(/-/g, "").toLowerCase();
    setSearch(value);
    SetSelectedYear("");
    SetSelectedCountry("");
    setSelectedItems(value);
  };

  const filteredMovies = data.filter((dataItem) =>
    dataItem.title
      .toString()
      .toLowerCase()
      .replace(/-/g, "")
      .includes(search.toLowerCase())
  );

  // SELECT KINDS
  const handleKindChange = (kind) => {
    setSelectedKind(kind);
    SetSelectedYear("");
    setSearch("");
    SetSelectedCountry("");
    setSelectedItems(kind);
  };

  // SELECT YEAR
  const handleYearChange = (year) => {
    SetSelectedYear(year);
    setSearch("");
    SetSelectedCountry("");
    setSelectedKind("");
    setSelectedItems(year);
  };

  // SELECT Country
  const handleCountryChange = (country) => {
    setSelectedKind("");
    SetSelectedCountry(country);
    setSearch("");
    SetSelectedYear("");
    setSelectedItems(country);
  };

  // SELECT SEARCH
  const handleResetSearch = () => {
    setSelectedKind("");
    SetSelectedCountry("");
    setSearch("");
    SetSelectedYear("");
    setExpanded(false);
    setSelectedItems("");
  };

  // MOVIE AMOUNT
  const movieAmount = filteredMovies.length;
  const movieAmountSearchFilter = filteredMovies.length;
  const movieAmountKindSorted = selectedMoviesByKind.length;
  const movieAmountYearSorted = selectedMoviesByYear.length;
  const movieAmountCountrySorted = selectedMoviesByCountry.length;

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
            <YearDropdown
              onYearChange={handleYearChange}
              search={search}
              selectedYearData={selectedYear}
            />
            <CountryDropdown
              onCountryChange={handleCountryChange}
              search={search}
              selectedCountryData={selectedCountry}
            />
            <svg
              className="reset_search_btn"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="40px"
              height="40px"
              fill="white"
              onClick={handleResetSearch}
              role="button"
              aria-label="reset"
              tabIndex="0"
              cursor="pointer"
            >
              <path
                d="M10,22v2c0,7.72,6.28,14,14,14s14-6.28,14-14s-6.28-14-14-14h-6.662l3.474-4.298l-3.11-2.515L10.577,12l7.125,8.813
		l3.11-2.515L17.338,14H24c5.514,0,10,4.486,10,10s-4.486,10-10,10s-10-4.486-10-10v-2H10z"
              />
            </svg>
          </div>
        </section>
      </section>
      <div className="dashed_secondary_bar" />
      <section className="search_bear_position">
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
        {search !== "" &&
          selectedKind === "" &&
          selectedYear === "" &&
          selectedCountry === "" && (
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
        {selectedKind !== "" &&
          selectedYear === "" &&
          selectedCountry === "" && (
            <div className="MovieThumbnails_container">
              <div className="scroll_zone">
                <div className="MovieThumbnails">
                  {selectedMoviesByKind.map((movieByKindData) => (
                    <MovieThumbnail
                      key={movieByKindData.id}
                      data={movieByKindData}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        {selectedYear !== "" && selectedCountry === "" && (
          <div className="MovieThumbnails_container">
            <div className="scroll_zone">
              <div className="MovieThumbnails">
                {selectedMoviesByYear.map((movieByYearData) => (
                  <MovieThumbnail
                    key={movieByYearData.id}
                    data={movieByYearData}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {selectedCountry !== "" && (
          <div className="MovieThumbnails_container">
            <div className="scroll_zone">
              <div className="MovieThumbnails">
                {selectedMoviesByCountry.map((movieByCountryData) => (
                  <MovieThumbnail
                    key={movieByCountryData.movieId}
                    data={movieByCountryData}
                    origin="country"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="btn_sort_container_search">
          <AlphabeticBtn
            selectedItems={selectedItems}
            expanded={expanded}
            onExpandedChange={handleExpandedChange}
            style={{
              height: expanded ? "37px" : "0",
              fontSize: expanded ? "1rem" : "0",
              padding: expanded ? "10px 0" : "0",
              border: expanded ? "solid 1px var(--color-01)" : "0",
              borderTop: expanded ? "0" : "none",
              transition: "height 0.3s ease-in",
            }}
            onClick={
              search !== ""
                ? sortOrderA === "asc"
                  ? movieSortedZ
                  : movieSortedA
                : selectedKind !== ""
                  ? sortMovieByKindOrderA === "asc"
                    ? MovieByKindsOrderZ
                    : MovieByKindsOrderA
                  : selectedCountry !== ""
                    ? sortMovieByCountryOrderA === "asc"
                      ? MovieByCountryOrderz
                      : MovieByCountryOrderA
                    : selectedYear !== ""
                      ? sortMovieByYearOrderA === "asc"
                        ? MovieByYearOrderZ
                        : MovieByYearOrderA
                      : () => {}
            }
          />
          {search === "" &&
            selectedKind === "" &&
            selectedYear === "" &&
            selectedCountry === "" && <MovieCount movieAmount={movieAmount} />}
          {search !== "" && (
            <MovieCount movieAmount={movieAmountSearchFilter} />
          )}
          {selectedKind !== "" && (
            <MovieCount movieAmount={movieAmountKindSorted} />
          )}
          {selectedYear !== "" && (
            <MovieCount movieAmount={movieAmountYearSorted} />
          )}
          {selectedCountry !== "" && (
            <MovieCount movieAmount={movieAmountCountrySorted} />
          )}
          <ChronologicBtn
            selectedItems={selectedItems}
            expanded={expanded}
            onExpandedChange={handleExpandedChange}
            style={{
              height: expanded ? "37px" : "0",
              fontSize: expanded ? "1rem" : "0",
              padding: expanded ? "10px 0" : "0",
              border: expanded ? "solid 1px var(--color-01)" : "0",
              borderTop: expanded ? "0" : "none",
              transition: "height 0.3s ease-in",
            }}
            onClick={
              search !== ""
                ? sortOrderY === "asc"
                  ? movieSortedYearDesc
                  : movieSortedYear
                : selectedKind !== ""
                  ? sortMovieByKindOrderY === "asc"
                    ? MovieByKindsOrderYdesc
                    : MovieByKindsOrderYasc
                  : selectedCountry !== ""
                    ? sortMovieByCountryOrderY === "asc"
                      ? MovieByCountryOrderYdesc
                      : MovieByCountryOrderYasc
                    : () => {}
            }
          />
        </div>
      </section>
    </main>
  );
}

export default MovieSearch;
