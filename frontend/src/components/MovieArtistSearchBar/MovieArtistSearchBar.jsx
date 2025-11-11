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
    <section className="search_bar_position">
      <div className="search_bar_container">
        <input
          value={search}
          onChange={onSearchChange}
          className="search_bar"
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
