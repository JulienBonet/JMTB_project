/* eslint-disable no-plusplus */
import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "../../assets/css/common_elements.css";
import "./home.css";
import MovieThumbnail from "../../components/MovieThumbnail3/MovieThumbnail3";

function Home() {
  const data = useLoaderData();

  // SHUFFLE DE FILMS
  const [shuffledData, setShuffledData] = useState([]);

  // Fonction pour mélanger un tableau de données aléatoirement
  const shuffleArray = (array) => {
    const shuffled = array.slice(); // Créer une copie du tableau d'origine
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[i],
      ];
    } // end boucle for
    return shuffled;
  }; // end const shuffleArray = (array)

  // Méthode pour déclencher le mélange des données
  const handleShuffle = () => {
    if (data && data.length > 0) {
      const newShuffledData = shuffleArray(data).slice(0, 10); // Prendre les 10 premiers films
      setShuffledData(newShuffledData);
    } else {
      console.error("No movies data available to shuffle.");
    }
  };

  // Effectuer le premier mélange au chargement initial
  useEffect(() => {
    handleShuffle();
  }, []);

  // BTN STYLE ------------------------------------------/
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
      JmdbColorKindNav3: {
        main: "#FFFFFF",
        light: "#ffa500",
        dark: "#e59100",
        contrastText: "#242105",
      },
    }, // end palette
  }); // const theme = createTheme

  return (
    <main>
      <section className="home_title_position">
        <h1 className="home_Main_Title">J M D B</h1>
      </section>
      <div className="dashed_secondary_bar" />
      <section className="welcome_container">
        <div className="welcome_content">
          {/* <img
            src={CameraBear}
            alt="A groovy bear on a camera in a cinema"
            className="camera_bear_welcome"
          /> */}
          <div className="ShuffleThumbnails_welcome">
            <div className="MovieThumbnails_welcome">
              {shuffledData.map((movieData) => (
                <MovieThumbnail
                  key={movieData.id}
                  data={movieData}
                  className="thumbs_welcome"
                />
              ))}
            </div>

            <ThemeProvider theme={theme}>
              <Stack spacing={2} direction="row" className="New_shuffle_stack">
                <Button
                  value="New Shuffle"
                  onClick={handleShuffle}
                  variant="outlined"
                  color="JmdbColorKindNav3"
                  size="medium"
                  className="New_shuffle_btn"
                >
                  Un film au hasard ?
                </Button>
              </Stack>
            </ThemeProvider>
          </div>
        </div>
      </section>
    </main>
  ); // end return
} // function Home()

export default Home;
