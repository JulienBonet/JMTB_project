/* eslint-disable react/jsx-no-duplicate-props */
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import "./movieSearch.css";
import "../../assets/css/scrollButton.css";
import AlphabeticBtn from "../../components/AlphabeticBtn/AlphabeticBtn";
import ChronologicBtn from "../../components/ChronologicBtn/ChronologicBtn";
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
  const [allMoviesClicked, setAllMoviesClicked] = useState(false);

  const allMovies = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/movies`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      if (Array.isArray(newData)) {
        setData(newData);
        setSearch("");
        setAllMoviesClicked(true);
      } else {
        console.error("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
  };

  const filteredMovies = data.filter((dataItem) =>
    dataItem.title
      .toString()
      .toLowerCase()
      .replace(/-/g, "")
      .includes(search.toLowerCase())
  );

  // MOVIE AMOUNT
  const movieAmount = filteredMovies.length;

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
        </section>
      </section>
      <div className="dashed_secondary_bar" />
      <div className="AllMoviesPosition_seach">
        <div
          role="button"
          className="allMoviesBtn_search"
          onClick={allMovies}
          onKeyDown={allMovies}
          tabIndex={0}
        >
          SELECT ALL MOVIES
        </div>
      </div>
      <section className="search_bear_position">
        {/* Vérifier si la recherche est vide */}
        {search === "" && !allMoviesClicked && (
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
        {search === "" && allMoviesClicked && (
          <div className="MovieThumbnails_container">
            <div className="scroll_zone">
              <div className="MovieThumbnails">
                {data.map((movieData) => (
                  <MovieThumbnail key={movieData.id} data={movieData} />
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Afficher les vignettes des films si une recherche est effectuée */}
        {search !== "" && (
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
            onClick={sortOrderA === "asc" ? movieSortedZ : movieSortedA}
          />
          <MovieCount movieAmount={movieAmount} />
          <ChronologicBtn
            onClick={
              sortOrderY === "asc" ? movieSortedYearDesc : movieSortedYear
            }
          />
          {/* <CountryBtn />
          <DurationBtn /> */}
        </div>
      </section>
    </main>
  );
}

export default MovieSearch;
