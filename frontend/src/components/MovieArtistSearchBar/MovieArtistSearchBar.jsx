// /* eslint-disable react/prop-types */
// import ToggleSortedButton from "../ToggleSortedBtn/ToggleSortedButton";
// import "./movieArtistSearchBar.css";

// function MovieArtistSearchBar({
//   placeholder,
//   search,
//   onSearchChange,
//   openSideBar,
//   setOpenSideBar,
//   selectedItem,
// }) {
//   return (
//     <section className="MovieArtist_Search_bar_position ">
//       <div className="MovieArtist_Search_bar_container">
//         <input
//           value={search}
//           onChange={onSearchChange}
//           className="MovieArtist_search_bar"
//           placeholder={placeholder}
//         />
//       </div>
//       <ToggleSortedButton
//         active={!!selectedItem}
//         onClick={() => setOpenSideBar(!openSideBar)}
//       />
//     </section>
//   );
// }

// export default MovieArtistSearchBar;

/* eslint-disable react/prop-types */
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
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
    <section className="MovieArtist_Search_bar_position">
      <div className="MovieArtist_Search_bar_container">
        <TextField
          value={search}
          onChange={onSearchChange}
          placeholder={placeholder}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#aaa" }} />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => onSearchChange({ target: { value: "" } })}
                  size="small"
                >
                  <ClearIcon sx={{ color: "#888" }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            borderRadius: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "#f5f5f5",
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "var(--color-02)" },
              "&.Mui-focused fieldset": {
                borderColor: "var(--color-02)",
                boxShadow: "0 0 8px rgba(0,0,0,0.1)",
              },
            },
            input: {
              color: "#333",
              "&::placeholder": { color: "#aaa", opacity: 1 },
            },
          }}
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
