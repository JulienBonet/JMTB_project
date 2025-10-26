/* eslint-disable react/prop-types */
import { ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "../../pages/MovieArtist/movieArtist.css";
import "../../assets/css/common_elements.css";
import "../../assets/css/scrollButton.css";
import AlphabetDropdown from "../AlphabetOption/AlphabetDropdown";
import Counter from "../Counters/Counters";

function ArtistList({
  handleLetterChange,
  search,
  theme,
  selectedByLetter,
  filteredArtist,
  handleArtistClick,
  origin,
  artistAmount,
  selectedArtistAmount,
}) {
  return (
    <section className="artists_groups">
      {search === "" && <Counter origin={origin} countAmount={artistAmount} />}
      {search !== "" && (
        <Counter origin={origin} countAmount={selectedArtistAmount} />
      )}
      <AlphabetDropdown
        onLetterChange={handleLetterChange}
        origin="artistlist"
        search={search}
      />
      {search === "" && (
        <div className="artists_groups_content">
          <ThemeProvider theme={theme}>
            <Stack spacing={2} direction="row" className="artists_list">
              {selectedByLetter.map((artist) => (
                <Button
                  key={artist.id}
                  variant="text"
                  color="artists_list"
                  size="small"
                  className="artists_button"
                  onClick={() => handleArtistClick(artist)}
                >
                  {artist.name}
                </Button>
              ))}
            </Stack>
          </ThemeProvider>
        </div>
      )}
      {search !== "" && (
        <div className="artists_groups_content">
          <ThemeProvider theme={theme}>
            <Stack spacing={2} direction="row" className="artists_list">
              {filteredArtist.map((artist) => (
                <Button
                  key={artist.id}
                  variant="text"
                  color="primary"
                  size="small"
                  className="artists_button"
                  onClick={() => handleArtistClick(artist)}
                >
                  {artist.name}
                </Button>
              ))}
            </Stack>
          </ThemeProvider>
        </div>
      )}
    </section>
  );
}
export default ArtistList;
