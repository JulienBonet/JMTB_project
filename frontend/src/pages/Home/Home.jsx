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
  // const data = useLoaderData();
  const initialData = useLoaderData();
  const [movies, setMovies] = useState(initialData);
  const [moviesToShow, setMoviesToShow] = useState(10);

  const isDevelopment = import.meta.env.MODE === "development";

  const backendUrl = isDevelopment
    ? "http://localhost:3310"
    : "https://jmtbproject-production.up.railway.app";

  const updateMoviesToShow = () => {
    // 👉 1) Si hauteur trop faible ET largeur desktop, on force 4 images
    if (window.innerHeight < 850 && window.innerWidth >= 1024) {
      setMoviesToShow(4);
      return;
    }

    // 👉 2) Sinon, logique habituelle basée sur la largeur
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
      setMoviesToShow(4);
    } else if (window.matchMedia("(min-width: 1741px)").matches) {
      setMoviesToShow(10);
    } else {
      setMoviesToShow(4);
    }
  };

  useEffect(() => {
    updateMoviesToShow();
    window.addEventListener("resize", updateMoviesToShow);
    return () => window.removeEventListener("resize", updateMoviesToShow);
  }, []);

  const handleShuffle = async () => {
    const res = await fetch(`${backendUrl}/api/movies/sorted/nox`);
    const newMovies = await res.json();
    setMovies(newMovies);
  };

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
    <main className="main_HomePage">
      <section className="home_title_container">
        <section className="home_title_position">
          <h1 className="home_Main_Title">J M D B</h1>
        </section>
      </section>
      <div className="dashed_secondary_bar" />
      <section className="welcome_container">
        <div className="welcome_content">
          <div className="ShuffleThumbnails_welcome">
            <div className="MovieThumbnails_welcome">
              {movies.slice(0, moviesToShow).map((movie) => (
                <MovieThumbnail key={movie.id} data={movie} />
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
