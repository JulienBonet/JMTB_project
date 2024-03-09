/* eslint-disable react/jsx-no-duplicate-props */
import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import "./movieSearch.css";
import "../../assets/css/scrollButton.css";
import AlphabeticBtn from "../../components/AlphabeticBtn/AlphabeticBtn";
import ChronologicBtn from "../../components/ChronologicBtn/ChronologicBtn";
import YearDropdown from "../../components/YearOption/YearDropdown";
import CountryDropdown from "../../components/CountryOption/CountryDropdown";
import MovieThumbnail from "../../components/MovieThumbnail/MovieThumbnail";
import MovieCount from "../../components/MovieCount/MovieCount";
import BearSearch from "../../assets/ico/search_Bear_02.jpeg";

function MovieSearch() {
  // DATAS
  const initialData = useLoaderData();
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [sortOrderA, setSortOrderA] = useState("asc");
  const [sortOrderY, setSortOrderY] = useState("desc");
  const [selectedYear, SetSelectedYear] = useState("");
  const [selectedCountry, SetSelectedCountry] = useState("");
  const [selectedMoviesByYear, SetMoviesByYear] = useState([]);
  const [selectedMoviesByCountry, SetMoviesByCountry] = useState([]);

  // REQUEST ALL MOVIES BY YEAR
  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/movies/sorted/5/${selectedYear}`
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

  // REQUEST ALL MOVIES BY COUNTRY (ALPHABETICAL ASC)
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

  // SEARCH BAR
  const handleTyping = (e) => {
    let { value } = e.target;
    value = value.replace(/-/g, "").toLowerCase();
    setSearch(value);
    SetSelectedYear("");
    SetSelectedCountry("");
  };

  const filteredMovies = data.filter((dataItem) =>
    dataItem.title
      .toString()
      .toLowerCase()
      .replace(/-/g, "")
      .includes(search.toLowerCase())
  );

  // SELECT YEAR
  const handleYearChange = (year) => {
    SetSelectedYear(year);
    setSearch("");
    SetSelectedCountry("");
  };

  // SELECT Country
  const handleCountryChange = (country) => {
    SetSelectedCountry(country);
    setSearch("");
    SetSelectedYear("");
  };

  // MOVIE AMOUNT
  const movieAmount = filteredMovies.length;
  const movieAmountSearchFilter = filteredMovies.length;
  const movieAmountYearSorted = selectedMoviesByYear.length;
  const movieAmountCountrySorted = selectedMoviesByCountry.length;

  // EXPAND SORTED BTN
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (search !== "" || selectedCountry !== "") {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [search, selectedCountry]);

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
          </div>
        </section>
      </section>
      <div className="dashed_secondary_bar" />
      <section className="search_bear_position">
        {search === "" && selectedYear === "" && selectedCountry === "" && (
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
        {search !== "" && selectedYear === "" && selectedCountry === "" && (
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
            selectedItems={search}
            style={{
              height: expanded ? "37px" : "0",
              fontSize: expanded ? "1rem" : "0",
              padding: expanded ? "10px 0" : "0",
              border: expanded ? "solid 1px var(--color-primary)" : "0",
              borderTop: expanded ? "0" : "none",
              transition: "height 0.3s ease-in",
            }}
            onClick={sortOrderA === "asc" ? movieSortedZ : movieSortedA}
          />
          {search === "" && selectedYear === "" && selectedCountry === "" && (
            <MovieCount movieAmount={movieAmount} />
          )}
          {search !== "" && (
            <MovieCount movieAmount={movieAmountSearchFilter} />
          )}
          {selectedYear !== "" && (
            <MovieCount movieAmount={movieAmountYearSorted} />
          )}
          {selectedCountry !== "" && (
            <MovieCount movieAmount={movieAmountCountrySorted} />
          )}
          <ChronologicBtn
            selectedItems={search}
            style={{
              height: expanded ? "37px" : "0",
              fontSize: expanded ? "1rem" : "0",
              padding: expanded ? "10px 0" : "0",
              border: expanded ? "solid 1px var(--color-primary)" : "0",
              borderTop: expanded ? "0" : "none",
              transition: "height 0.3s ease-in",
            }}
            onClick={
              sortOrderY === "asc" ? movieSortedYearDesc : movieSortedYear
            }
          />
        </div>
      </section>
    </main>
  );
}

export default MovieSearch;
