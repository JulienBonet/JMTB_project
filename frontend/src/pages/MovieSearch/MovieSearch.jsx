/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import "./movieSearch.css";
import "../../assets/css/scrollButton.css";
import CachedIcon from "@mui/icons-material/Cached";
// import AlphabeticBtn from "../../components/AlphabeticBtn/AlphabeticBtn";
// import ChronologicBtn from "../../components/ChronologicBtn/ChronologicBtn";
import YearDropdown from "../../components/YearOption/YearDropdown";
import CountryDropdown from "../../components/CountryOption/CountryDropdown";
import KindsDropdown from "../../components/KindOption/KindsDropdown";
import MovieThumbnail from "../../components/MovieThumbnail/MovieThumbnail";
import MovieCount from "../../components/MovieCount/MovieCount";
import BearSearch from "../../assets/ico/search_Bear_02.jpeg";

function MovieSearch() {
  const initialData = useLoaderData();
  const [search, setSearch] = useState("");

  // const [sortOrderA, setSortOrderA] = useState("asc");
  // const [sortOrderY, setSortOrderY] = useState("desc");
  // const [sortMovieByCountryOrderA, setSortMovieByCountryOrderA] =
  //   useState("asc");
  // const [sortMovieByCountryOrderY, setSortMovieByCountryOrderY] =
  //   useState("desc");
  // const [sortMovieByYearOrderA, setSortMovieByYearOrderA] = useState("asc");
  // const [sortMovieByKindOrderA, setSortMovieByKindOrderA] = useState("asc");
  // const [sortMovieByKindOrderY, setSortMovieByKindOrderY] = useState("desc");

  // const [selectedMoviesByKind, SetMoviesByKind] = useState([]);
  // const [selectedMoviesByYear, SetMoviesByYear] = useState([]);
  // const [selectedMoviesByCountry, SetMoviesByCountry] = useState([]);
  // const [selectedItems, setSelectedItems] = useState("");
  // const [expanded, setExpanded] = useState(false);

  // // REQUEST ALL MOVIES SORTED ALPHABETICAL ASC
  // const movieSortedA = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/movies/sorted/0`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const newData = await response.json();
  //     setData(newData);
  //     setSortOrderA("asc");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // REQUEST ALL MOVIES SORTED ALPHABETICAL DESC
  // const movieSortedZ = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/movies/sorted/1`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const newData = await response.json();
  //     setData(newData);
  //     setSortOrderA("desc");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // REQUEST ALL MOVIES SORTED CHRONOLOGICAL ASC
  // const movieSortedYear = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/movies/sorted/2`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const newData = await response.json();
  //     setData(newData);
  //     setSortOrderY("asc");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // REQUEST ALL MOVIES SORTED CHRONOLOGICAL DSC
  // const movieSortedYearDesc = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/movies/sorted/3`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const newData = await response.json();
  //     setData(newData);
  //     setSortOrderY("desc");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // REQUEST ALL MOVIES BY KINDS
  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_BACKEND_URL}/api/kinds/${selectedKind}`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((MovieBykind) => {
  //       SetMoviesByKind(MovieBykind);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching user data:", error);
  //     });
  // }, [selectedKind]);

  // // REQUEST ALL MOVIES BY KIND (SORTED ALPHABETICAL ASC)
  // const MovieByKindsOrderA = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/kinds/${selectedKind}/sorted/0`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const newData = await response.json();
  //     SetMoviesByKind(newData);
  //     setSortMovieByKindOrderA("asc");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // REQUEST ALL MOVIES BY KIND (SORTED ALPHABETICAL DESC)
  // const MovieByKindsOrderZ = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/kinds/${selectedKind}/sorted/1`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const newData = await response.json();
  //     SetMoviesByKind(newData);
  //     setSortMovieByKindOrderA("desc");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // REQUEST ALL MOVIES BY KIND (SORTED CHRONOLOGICAL ASC)
  // const MovieByKindsOrderYasc = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/kinds/${selectedKind}/sorted/2`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const newData = await response.json();
  //     SetMoviesByKind(newData);
  //     setSortMovieByKindOrderY("asc");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // REQUEST ALL MOVIES BY KIND (SORTED CHRONOLOGICAL DESC)
  // const MovieByKindsOrderYdesc = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/kinds/${selectedKind}/sorted/3`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const newData = await response.json();
  //     SetMoviesByKind(newData);
  //     setSortMovieByKindOrderY("desc");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // REQUEST ALL MOVIES BY YEAR
  // useEffect(() => {
  //   fetch(
  //     `${
  //       import.meta.env.VITE_BACKEND_URL
  //     }/api/movies/year/sorted/${selectedYear}`
  //   )
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((MovieByYear) => {
  //       SetMoviesByYear(MovieByYear);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching user data:", error);
  //     });
  // }, [selectedYear]);

  // // REQUEST ALL MOVIES BY YEAR (SORTED ALPHABETICAL ASC)
  // const MovieByYearOrderA = async () => {
  //   try {
  //     const response = await fetch(
  //       `${
  //         import.meta.env.VITE_BACKEND_URL
  //       }/api/movies/year/sorted/0/${selectedYear}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const newData = await response.json();
  //     SetMoviesByYear(newData);
  //     setSortMovieByYearOrderA("asc");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // REQUEST ALL MOVIES BY YEAR (SORTED ALPHABETICAL DESC)
  // const MovieByYearOrderZ = async () => {
  //   try {
  //     const response = await fetch(
  //       `${
  //         import.meta.env.VITE_BACKEND_URL
  //       }/api/movies/year/sorted/1/${selectedYear}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const newData = await response.json();
  //     SetMoviesByYear(newData);
  //     setSortMovieByYearOrderA("desc");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // REQUEST ALL MOVIES BY COUNTRY
  // useEffect(() => {
  //   fetch(
  //     `${
  //       import.meta.env.VITE_BACKEND_URL
  //     }/api/movies/sorted/country/${selectedCountry}`
  //   )
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((MovieBycountry) => {
  //       SetMoviesByCountry(MovieBycountry);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching user data:", error);
  //     });
  // }, [selectedCountry]);

  // // REQUEST ALL MOVIES BY COUNTRY (SORTED ALPHABETICAL ASC)
  // const MovieByCountryOrderA = async () => {
  //   try {
  //     const response = await fetch(
  //       `${
  //         import.meta.env.VITE_BACKEND_URL
  //       }/api/movies/sorted/country/sorted/0/${selectedCountry}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const newData = await response.json();
  //     SetMoviesByCountry(newData);
  //     setSortMovieByCountryOrderA("asc");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // REQUEST ALL MOVIES BY COUNTRY (SORTED ALPHABETICAL DESC)
  // const MovieByCountryOrderz = async () => {
  //   try {
  //     const response = await fetch(
  //       `${
  //         import.meta.env.VITE_BACKEND_URL
  //       }/api/movies/sorted/country/sorted/1/${selectedCountry}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const newData = await response.json();
  //     SetMoviesByCountry(newData);
  //     setSortMovieByCountryOrderA("desc");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // REQUEST ALL MOVIES BY COUNTRY (SORTED YEAR ASC)
  // const MovieByCountryOrderYasc = async () => {
  //   try {
  //     const response = await fetch(
  //       `${
  //         import.meta.env.VITE_BACKEND_URL
  //       }/api/movies/sorted/country/sorted/2/${selectedCountry}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const newData = await response.json();
  //     SetMoviesByCountry(newData);
  //     setSortMovieByCountryOrderY("asc");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // REQUEST ALL MOVIES BY COUNTRY (SORTED YEAR DESC)
  // const MovieByCountryOrderYdesc = async () => {
  //   try {
  //     const response = await fetch(
  //       `${
  //         import.meta.env.VITE_BACKEND_URL
  //       }/api/movies/sorted/country/sorted/3/${selectedCountry}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const newData = await response.json();
  //     SetMoviesByCountry(newData);
  //     setSortMovieByCountryOrderY("desc");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // EXPAND SORTED BTN
  // const handleExpandedChange = (value) => {
  //   setExpanded(value);
  // };

  const [selectedKind, setSelectedKind] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [filteredData, setFilteredData] = useState("");
  console.info("filteredData:", filteredData);

  // SEARCH BAR
  const handleTyping = (e) => {
    let { value } = e.target;
    value = value.replace(/-/g, "").toLowerCase();
    setSearch(value);
    setSelectedYear("");
    setSelectedCountry("");
    setSelectedItems(value);
  };

  const searchfilteredMovies = data.filter((dataItem) =>
    dataItem.title
      .toString()
      .toLowerCase()
      .replace(/-/g, "")
      .includes(search.toLowerCase())
  );

  // FILTERS
  useEffect(() => {
    let filteredMovies = initialData;

    if (selectedKind) {
      // Filtrer par genre en utilisant le nom
      filteredMovies = filteredMovies.filter(
        (movie) =>
          movie.genres && movie.genres.split(", ").includes(selectedKind)
      );
    }

    if (selectedYear) {
      // Filtrer par année
      filteredMovies = filteredMovies.filter(
        (movie) => movie.year === selectedYear
      );
    }

    if (selectedCountry) {
      // Filtrer par pays en utilisant le nom
      filteredMovies = filteredMovies.filter(
        (movie) =>
          movie.countries &&
          movie.countries.split(", ").includes(selectedCountry)
      );
    }

    setFilteredData(filteredMovies);
  }, [selectedKind, selectedYear, selectedCountry]);

  const handleKindChange = (selectedKind) => {
    setSearch("");
    setSelectedKind(selectedKind);
  };

  const handleYearChange = (selectedYear) => {
    setSearch("");
    setSelectedYear(selectedYear);
  };

  const handleCountryChange = (selectedCountry) => {
    setSearch("");
    setSelectedCountry(selectedCountry);
  };

  // RESET SEARCH
  const handleResetSearch = () => {
    setSelectedKind("");
    setSelectedCountry("");
    setSearch("");
    setSelectedYear("");
    setExpanded(false);
    setSelectedItems("");
  };

  // MOVIE AMOUNT
  const movieAmount = initialData.length;
  const movieAmountSearchFilter = searchfilteredMovies.length;
  const movieAmountFiltered = filteredData.length;

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
        {/* Affichage lorsque la recherche est non vide */}
        {search !== "" && (
          <div className="MovieThumbnails_container">
            <div className="scroll_zone">
              <div className="MovieThumbnails">
                {searchfilteredMovies.map((movieData) => (
                  <MovieThumbnail key={movieData.id} data={movieData} />
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Affichage lorsque seul un type de filtre est sélectionné */}
        {(selectedKind !== "" ||
          selectedYear !== "" ||
          selectedCountry !== "") && (
          <div className="MovieThumbnails_container">
            <div className="scroll_zone">
              <div className="MovieThumbnails">
                {filteredData.map((movieData) => (
                  <MovieThumbnail key={movieData.id} data={movieData} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="btn_sort_container_search">
          {search === "" &&
            selectedKind === "" &&
            selectedYear === "" &&
            selectedCountry === "" && <MovieCount movieAmount={movieAmount} />}
          {search !== "" && (
            <MovieCount movieAmount={movieAmountSearchFilter} />
          )}
          {(selectedKind !== "" ||
            selectedYear !== "" ||
            selectedCountry !== "") && (
            <MovieCount movieAmount={movieAmountFiltered} />
          )}
        </div>
      </section>

      {/* <section className="search_bear_position">
   
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
      </section> */}
    </main>
  );
}

export default MovieSearch;
