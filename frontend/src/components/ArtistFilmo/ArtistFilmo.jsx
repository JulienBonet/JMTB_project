/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import MovieCountArtistMovie from "../MovieCountArtistMovie/MovieCountArtistMovie";
import MovieThumbnail from "../MovieThumbnail/MovieThumbnail";
import DirectorBear from "../../assets/ico/director_bear_01.jpeg";
import ActorBear from "../../assets/ico/actor-bear.jpg";
import ScreenwriterBear from "../../assets/ico/screenwiter-bear.jpeg";
import MusicBear from "../../assets/ico/compositor-bear.jpeg";
import StudioBear from "../../assets/ico/studio_bear.jpeg";
import TagBear from "../../assets/ico/search_Bear_02.jpeg";
import SideActionBar from "../StickySideBar/StickySideBar";

function ArtistFilmo({
  selectedArtist,
  origin,
  data,
  movieAmount,
  onUpdateMovie,
  onDeleteMovie,
  movieSortedA,
  movieSortedZ,
  movieSortedYear,
  movieSortedYearDesc,
  sortOrderA,
  sortOrderY,
  onReset,
  openSideBar,
}) {
  const [artistMovies, setArtistMovies] = useState(data || []);

  useEffect(() => {
    setArtistMovies(data);
  }, [data]);

  console.info("artistMovies", artistMovies);

  // ---------- Wrappers qui utilisent les fonctions backend si disponibles ----------
  const handleAlphabeticBtnClick = async () => {
    // si le parent a fourni movieSortedA/movieSortedZ et sortOrderA : on les utilise
    if (
      typeof movieSortedA === "function" &&
      typeof movieSortedZ === "function"
    ) {
      try {
        if (sortOrderA === "asc") {
          await movieSortedZ(); // appel parent qui fetch sorted desc
        } else {
          await movieSortedA(); // appel parent qui fetch sorted asc
        }
        // parent mettra à jour `data`, et useEffect propagera dans artistMovies
      } catch (err) {
        console.error("Erreur lors du tri alphabétique remote:", err);
      }
      return;
    }

    // fallback local (si le parent n'a pas fourni les fonctions)
    const sorted = [...artistMovies].sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "accent" })
    );
    setArtistMovies(sorted);
  };

  const handleChronologicBtnClick = async () => {
    if (
      typeof movieSortedYear === "function" &&
      typeof movieSortedYearDesc === "function"
    ) {
      try {
        if (sortOrderY === "asc") {
          await movieSortedYearDesc();
        } else {
          await movieSortedYear();
        }
      } catch (err) {
        console.error("Erreur lors du tri chronologique remote:", err);
      }
      return;
    }

    // fallback local
    const sorted = [...artistMovies].sort((a, b) => a.year - b.year);
    setArtistMovies(sorted);
  };

  const handleResetSearch = () => {
    // Prefer call parent reset if provided (réinitialise lettres/search etc.)
    if (typeof onReset === "function") {
      onReset();
      return;
    }

    // sinon on demande au parent de re-fetch les films (onUpdateMovie)
    if (typeof onUpdateMovie === "function") {
      onUpdateMovie();
      return;
    }
    // Fallback local : on réaffiche les données actuelles
    setArtistMovies(data || []);
  };

  return (
    <section className="filmo_artists">
      {selectedArtist === "" && (
        <section className="artists_bear">
          <section className="artists_bear_position">
            {origin === "directors" && (
              <div className="artists_bear_container">
                <div className="artists_pitch_container">
                  <p className="artists_pitch">
                    QUEL REALISATEUR CHERCHONS NOUS ?
                  </p>
                </div>
                <img
                  src={DirectorBear}
                  alt="a Bear director"
                  className="artists_bear_illustr"
                />
              </div>
            )}
            {origin === "casting" && (
              <div className="artists_bear_container">
                <div className="artists_pitch_container">
                  <p className="artists_pitch">QUEL ACTEUR CHERCHONS NOUS ?</p>
                </div>
                <img
                  src={ActorBear}
                  alt="a Bear actor"
                  className="artists_bear_illustr"
                />
              </div>
            )}
            {origin === "screenwriters" && (
              <div className="artists_bear_container">
                <div className="artists_pitch_container">
                  <p className="artists_pitch">
                    QUEL SCENARISTE CHERCHONS NOUS ?
                  </p>
                </div>
                <img
                  src={ScreenwriterBear}
                  alt="a Bear screenwriter"
                  className="artists_bear_illustr"
                />
              </div>
            )}
            {origin === "music" && (
              <div className="artists_bear_container">
                <div className="artists_pitch_container">
                  <p className="artists_pitch">QUEL MAESTRO CHERCHONS NOUS ?</p>
                </div>
                <img
                  src={MusicBear}
                  alt="a Bear MUSIC COMPOSITOR"
                  className="artists_bear_illustr"
                />
              </div>
            )}
            {origin === "studio" && (
              <div className="artists_bear_container">
                <div className="artists_pitch_container">
                  <p className="artists_pitch">QUEL STUDIO CHERCHONS NOUS ?</p>
                </div>
                <img
                  src={StudioBear}
                  alt="a Bear MUSIC COMPOSITOR"
                  className="artists_bear_illustr"
                />
              </div>
            )}
            {origin === "tags" && (
              <div className="artists_bear_container">
                <div className="artists_pitch_container">
                  <p className="artists_pitch">
                    AVEC QUEL TAG CHERCHONS NOUS ?
                  </p>
                </div>
                <img
                  src={TagBear}
                  alt="a Bear searching movie"
                  className="artists_bear_illustr"
                />
              </div>
            )}
          </section>
        </section>
      )}
      {selectedArtist !== "" && (
        <section className="artists_filmo">
          <SideActionBar
            onAlphabeticClick={handleAlphabeticBtnClick}
            onChronologicClick={handleChronologicBtnClick}
            onResetClick={handleResetSearch}
            selectedItems={selectedArtist}
            origin={origin}
            openSideBar={openSideBar}
          />
          <div className="MovieCountArtistMovie_container">
            <MovieCountArtistMovie movieAmount={movieAmount} />
          </div>
          <div className="artists_filmo_thumbs">
            {data.map((filmo) => (
              <MovieThumbnail
                key={filmo.id}
                data={filmo}
                onUpdateMovie={onUpdateMovie}
                onDeleteMovie={onDeleteMovie}
              />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

export default ArtistFilmo;
