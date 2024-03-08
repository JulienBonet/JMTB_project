/* eslint-disable react/prop-types */
import MovieCount from "../MovieCount/MovieCount";
import AlphabeticBtn from "../AlphabeticBtn/AlphabeticBtn";
import ChronologicBtn from "../ChronologicBtn/ChronologicBtn";
import MovieThumbnail from "../MovieThumbnail/MovieThumbnail";
import DirectorBear from "../../assets/ico/director_bear_01.jpeg";
import ActorBear from "../../assets/ico/actor-bear.jpg";
import ScreenwriterBear from "../../assets/ico/screenwiter-bear.jpeg";
import MusicBear from "../../assets/ico/compositor-bear.jpeg";
import StudioBear from "../../assets/ico/studio_bear.jpeg";

function ArtistFilmo({
  selectedArtist,
  origin,
  data,
  sortOrderA,
  movieSortedZ,
  movieSortedA,
  sortOrderY,
  movieSortedYearDesc,
  movieSortedYear,
  movieAmount,
}) {
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
          </section>
        </section>
      )}
      {selectedArtist !== "" && (
        <section className="artists_filmo">
          <div className="scroll_zone scroll_zone_2">
            <div className="artists_filmo_thumbs">
              {data.map((filmo) => (
                <MovieThumbnail key={filmo.id} data={filmo} />
              ))}
            </div>
          </div>
        </section>
      )}
      <div className="btn_sort_container_search">
        <AlphabeticBtn
          selectedItems={selectedArtist}
          origin="artists"
          onClick={sortOrderA === "asc" ? movieSortedZ : movieSortedA}
        />
        <MovieCount movieAmount={movieAmount} />
        <ChronologicBtn
          selectedItems={selectedArtist}
          origin="artists"
          onClick={sortOrderY === "asc" ? movieSortedYearDesc : movieSortedYear}
        />
      </div>
    </section>
  );
}

export default ArtistFilmo;
