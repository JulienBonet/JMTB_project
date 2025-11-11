/* eslint-disable react/prop-types */
import ToggleSortedButton from "../ToggleSortedBtn/ToggleSortedButton";
import "./movieArtistSearchBar.css";

function MovieArtistSearchBar({
  placeholder,
  search,
  onSearchChange,
  openSideBar,
  setOpenSideBar,
  selectedItem,
}) {
  return (
    <section className="MovieArtist_Search_bar_position ">
      <div className="MovieArtist_Search_bar_container">
        <input
          value={search}
          onChange={onSearchChange}
          className="MovieArtist_search_bar"
          placeholder={placeholder}
        />
      </div>
      <ToggleSortedButton
        active={!!selectedItem}
        onClick={() => setOpenSideBar(!openSideBar)}
      />
    </section>
  );
}

export default MovieArtistSearchBar;
