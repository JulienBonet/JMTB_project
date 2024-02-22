import { useState, useEffect } from "react";
import "./movieSearch.css";
import "../../assets/css/scrollButton.css";
import MovieThumbnail from "../../components/MovieThumbnail/MovieThumbnail";
import MovieCount from "../../components/MovieCount/MovieCount";
import data from "../../data/data.json";
import BearSearch from "../../assets/ico/search_Bear_02.jpeg";

function MovieSearch() {
  const [search, setSearch] = useState("");
  const [showButton, setShowButton] = useState(false);

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

  // Afficher nombre de films
  const movieAmount = filteredMovies.length;

  // SCROLLBUTTON ----------------------------------//
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Afficher le bouton quand on fait défiler la page
    const handleScroll = () => {
      if (document.documentElement.scrollTop > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Retirer l'écouteur d'événement lors du démontage du composant
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main>
      <section className="search_bar_contents">
        <section className="search_bar_position">
          <div className="search_bar_container">
            <span className="material-symbols-outlined">search</span>
            <input
              value={search}
              onChange={handleTyping}
              className="search_bar"
            />
          </div>
        </section>
      </section>
      <div className="dashed_secondary_bar" />
      <section className="search_bear_position">
        {/* Vérifier si la recherche est vide */}
        {search === "" && (
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
      </section>
      <MovieCount movieAmount={movieAmount} />
      {showButton && (
        // eslint-disable-next-line react/button-has-type
        <button className="scrollToTopButton" onClick={scrollToTop}>
          Remonter en haut
        </button>
      )}
    </main>
  );
}

export default MovieSearch;
