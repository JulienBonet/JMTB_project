/* eslint-disable no-plusplus */
import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import "../../assets/css/common_elements.css";
import "./home.css";
import "./homeMediaQueries.css";
import MovieThumbnail from "../../components/MovieThumbnail3/MovieThumbnail3";

function Home() {
  const data = useLoaderData();

  // -----------------
  // SHUFFLE DE FILMS
  // -----------------
  const [shuffledData, setShuffledData] = useState([]);
  const [moviesToShow, setMoviesToShow] = useState(10);

  const shuffleArray = (array) => {
    const shuffled = JSON.parse(JSON.stringify(array));
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[i],
      ];
    }
    return shuffled;
  };

  // Fonction qui gère le mélange et l'affichage des films en fonction de la taille de l'écran
  const handleShuffle = () => {
    if (Array.isArray(data) && data.length > 0) {
      const newShuffledData = shuffleArray(data).slice(0, moviesToShow); // Nombre de films affichés selon moviesToShow
      setShuffledData(newShuffledData);
    } else {
      console.error(
        "No movies data available to shuffle or data is not an array."
      );
    }
  };

  // Fonction pour mettre à jour le nombre de films en fonction de la taille de l'écran
  const updateMoviesToShow = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setMoviesToShow(1);
    } else if (
      window.matchMedia("(min-width: 1024px) and (max-width: 1279px)").matches
    ) {
      setMoviesToShow(4);
    } else if (
      window.matchMedia("(min-width: 1280px) and (max-width: 1439px)").matches
    ) {
      setMoviesToShow(6);
    } else if (
      window.matchMedia("(min-width: 1440px) and (max-width: 1740px)").matches
    ) {
      setMoviesToShow(8);
    } else if (window.matchMedia("(min-width: 1741px)").matches) {
      setMoviesToShow(10);
    } else {
      setMoviesToShow(4);
    }
  };

  // Appeler le premier mélange au chargement initial et mettre à jour le nombre de films à afficher
  useEffect(() => {
    updateMoviesToShow();
    handleShuffle();

    // Ajouter un écouteur d'événements pour détecter le redimensionnement de la fenêtre
    window.addEventListener("resize", updateMoviesToShow);

    // Nettoyage à la suppression du composant
    return () => {
      window.removeEventListener("resize", updateMoviesToShow);
    };
  }, [data, moviesToShow]); // Recalculer à chaque changement de data ou de taille d'écran

  // -----------------
  // BTN STYLE
  // -----------------
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

  // -----------------
  // RETURN
  // -----------------
  return (
    <main>
      <section className="home_title_position">
        <h1 className="home_Main_Title">J M D B</h1>
      </section>
      <div className="dashed_secondary_bar" />
      <section className="welcome_container">
        <div className="welcome_content">
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
              <Stack spacing={2} direction="row">
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
