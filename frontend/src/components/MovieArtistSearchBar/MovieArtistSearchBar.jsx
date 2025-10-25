/* eslint-disable react/prop-types */
import CachedIcon from "@mui/icons-material/Cached";
import AlphabeticBtn from "../AlphabeticBtn/AlphabeticBtn";
import ChronologicBtn from "../ChronologicBtn/ChronologicBtn";
import "./movieArtistSearchBar.css";

function MovieArtistSearchBar({
  placeholder,
  search,
  onSearchChange,
  onReset,
  selectedItem,
  sortOrderA,
  sortOrderY,
  movieSortedA,
  movieSortedZ,
  movieSortedYear,
  movieSortedYearDesc,
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
      <div className="Btn_sorted_container_movieArtistSearchBar">
        <AlphabeticBtn
          selectedItems={selectedItem}
          origin="artists"
          onClick={sortOrderA === "asc" ? movieSortedZ : movieSortedA}
        />
        <ChronologicBtn
          selectedItems={selectedItem}
          origin="artists"
          onClick={sortOrderY === "asc" ? movieSortedYearDesc : movieSortedYear}
        />
        <CachedIcon className="reset_search_btn" onClick={onReset} />
      </div>
    </section>
  );
}

export default MovieArtistSearchBar;
