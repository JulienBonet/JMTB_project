import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Pagination, Stack, Button } from "@mui/material";
import "./MovieSearchKind.css";
import "../../assets/css/scrollButton.css";
import data from "../../data/data.json";
import MovieCount from "../../components/MovieCount/MovieCount";
import MovieThumbail3 from "../../components/MovieThumbnail3/MovieThumbnail3";
import BearKinds from "../../assets/ico/camera_Bear_03.jpeg";
import AlphabeticBtn from "../../components/AlphabeticBtn/AlphabeticBtn";
import ChronologicBtn from "../../components/ChronologicBtn/ChronologicBtn";
// import CountryBtn from "../../components/CountryBtn/CountryBtn";
// import DurationBtn from "../../components/DurationBtn/DurationBtn";

function MovieSearchKind() {
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedButton, setSelectedButton] = useState("");

  const handleChoice = (genre) => {
    setSelectedGenre(genre);
    setSelectedButton(genre);
  };

  // TRI PAR GENRES----------------------------------//
  const filteredMovies = selectedGenre
    ? data.filter((dataItem) => dataItem.genre.includes(selectedGenre))
    : [];

  const ignoredPrefixes = [
    "The",
    "Le",
    "La",
    "L'",
    "Les",
    "De",
    "Het",
    "D'",
    "Sa",
    "Un",
    "Une",
    "Der",
    "Nos",
  ];

  const sortedMovies = filteredMovies.slice().sort((a, b) => {
    const extractTitle = (title) => {
      if (typeof title !== "string") {
        return title;
      }

      for (const prefix of ignoredPrefixes) {
        const prefixWithSpace = prefix + " ";
        if (title.startsWith(prefixWithSpace)) {
          return title.slice(prefixWithSpace.length);
        }
      }
      return title;
    };

    const titleA = extractTitle(a.title);
    const titleB = extractTitle(b.title);

    const compareTitles =
      typeof titleA === "string" && typeof titleB === "string"
        ? titleA.toLowerCase().localeCompare(titleB.toLowerCase(), "fr")
        : 0; // Si l'un des titres n'est pas une chaîne, renvoie 0 pour conserver l'ordre initial

    return compareTitles;
  });

  // RECUPERER LISTE DES GENRES + SORTED + Btn KIND CHOICE DESIGN--------//
  const uniqueGenres = [
    ...new Set(
      data.flatMap((film) => film.genre.split(",").map((genre) => genre.trim()))
    ),
  ];

  const customOrder = [
    "Drame",
    "Comédie",
    "Romantique",
    "Policier",
    "Suspense",
    "Mystère",
    "Fantastique",
    "Horreur",
    "Science-fiction",
    "Aventures",
    "Action",
    "Séries",
    "Séries Animées",
    "Biopic",
    "Histoire",
    "Guerre",
    "Western",
    "Péplum",
    "Heroic Fantasy",
    "Super-Héros",
    "Comics",
    "Manga",
    "Animation",
    "Dessin animé",
    "Familial",
    "Sport",
    "Musical",
    "Concert",
    "Spectacle",
    "Documentaire",
    "Court-métrage",
    "Film noir",
    "Blackploitation",
    "Asia",
    "Yakuzas",
    "Chanbara",
    "Wu Xa Pian",
    "Adulte",
  ];
  const orderedGenres = customOrder.filter((genre) =>
    uniqueGenres.includes(genre)
  );

  // STYLE Btn KIND ----------------------------------//
  const theme = createTheme({
    palette: {
      JmdbColorKindNav: {
        main: "#00D9C0",
        light: "#ffc45e",
        dark: "#e59100",
        contrastText: "#242105",
      },
      JmdbColorKindNav2: {
        main: "#ffa500",
        light: "#ffa500",
        dark: "#e59100",
        contrastText: "#242105",
      },
      primary: {
        main: "#00d9c0",
      },
    },
  });
  // PAGINATION Btn KIND ----------------------------------//

  const itemsPerRow = 13;

  const totalRows = Math.ceil(orderedGenres.length / itemsPerRow);

  const [currentRow, setCurrentRow] = useState(1);

  const startRowIndex = (currentRow - 1) * itemsPerRow;

  const endRowIndex = startRowIndex + itemsPerRow;

  const genresForRow = orderedGenres.slice(startRowIndex, endRowIndex);

  const handlePageChange = (event, value) => {
    setCurrentRow(value);
  };

  // TRI CHRONOLOGIQUE ----------------------------------//
  const [isSortedChronologic, setIsSortedChronologic] = useState(false);
  const [isChronologicAscending, setIsChronologicAscending] = useState(false);

  const sortChronologic = () => {
    const sortedChronologic = sortedMovies.slice().sort((a, b) => {
      const dateA = new Date(a.year).getTime();
      const dateB = new Date(b.year).getTime();

      if (isChronologicAscending) {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    return sortedChronologic;
  };

  //- Gestion 'ChronologicBtn'
  const handleChronologicClick = () => {
    setIsSortedChronologic(true);
    setIsChronologicAscending(!isChronologicAscending);
  };

  const handleAlphabeticClick = () => {
    setIsSortedChronologic(false); // Mettre à jour l'état pour revenir au tri alphabétique
  };

  // SELECTION FILM EN FONCTION DU BTN sorted ----------------------------------//
  const moviesToDisplay = isSortedChronologic
    ? sortChronologic()
    : sortedMovies;

  // AFFICHER LE NOMBRE DE FILMS ----------------------------------//
  const movieAmount = data.length;
  const movieAmountKind = sortedMovies.length;
  return (
    <main>
      <section className="search_kind_contents">
        <section className="search_kind_position">
          <div className="search_kind_container">
            <ThemeProvider theme={theme}>
              <Stack spacing={2} direction="row" className="Kind_Choice">
                {genresForRow.map((genre) => (
                  <Button
                    key={genre}
                    value={genre}
                    onClick={() => handleChoice(genre)}
                    variant={
                      selectedButton === genre ? "contained" : "outlined"
                    }
                    color="JmdbColorKindNav"
                    size="medium"
                    className="btn_Kind_Choice"
                  >
                    {genre}
                  </Button>
                ))}
              </Stack>
            </ThemeProvider>
          </div>
        </section>
      </section>
      <div className="dashed_secondary_bar" />
      <div className="Kinds_btn_rows_pagination">
        <Stack spacing={2} className="pagination_content">
          <Pagination
            count={totalRows}
            page={currentRow}
            onChange={handlePageChange}
            shape="rounded"
            size="small"
          />
        </Stack>
      </div>
      <section className="kinds_bloc_position">
        {selectedGenre == "" && (
          <section className="kinds_bear_position">
            <div className="kinds_bear_container">
              <div className="kinds_pitch_container">
                <p className="kinds_pitch">
                  QUEL STYLE DE FILMS CHERCHONS NOUS ?
                </p>
              </div>
              <img
                src={BearKinds}
                alt="Bear Kinds on camera"
                className="kinds_bear_illustr"
              />
            </div>
          </section>
        )}
        {selectedGenre !== "" && (
          <section className="MovieThumbnails_Kind_container">
            <div className="scroll_zone">
              <div className="MovieThumbnails_kind">
                {moviesToDisplay.map((movieData) => (
                  <MovieThumbail3 key={movieData.id} data={movieData} />
                ))}
              </div>
            </div>
          </section>
        )}
        <div className="btn_sort_container_kind">
          <AlphabeticBtn onClick={handleAlphabeticClick} />
          <ChronologicBtn onClick={handleChronologicClick} />
          {/* <CountryBtn />
          <DurationBtn /> */}
        </div>
      </section>
      {selectedGenre === "" && <MovieCount movieAmount={movieAmount} />}
      {selectedGenre !== "" && <MovieCount movieAmount={movieAmountKind} />}
    </main>
  );
}

export default MovieSearchKind;
