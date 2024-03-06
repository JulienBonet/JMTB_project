import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import "./NavBar.css";

export default function BasicButtons() {
  const theme = createTheme({
    palette: {
      JmdbColorNav: {
        main: "#f5f5f5",
        light: "#ffc45e",
        dark: "#e59100",
        contrastText: "#242105",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Stack spacing={2} direction="row" className="navBar_container">
        <Link to="/">
          <Button
            variant="outlined"
            color="JmdbColorNav"
            className="navBar_btn"
          >
            HOME
          </Button>
        </Link>
        <Link to="/movie_search">
          <Button variant="outlined" color="JmdbColorNav">
            RECHERCHE
          </Button>
        </Link>
        <Link to="/movie_kind">
          <Button variant="outlined" color="JmdbColorNav">
            GENRES
          </Button>
        </Link>
        <Link to="/movie_directors">
          <Button variant="outlined" color="JmdbColorNav">
            REALISATEURS
          </Button>
        </Link>
        <Link to="/movie_casting">
          <Button variant="outlined" color="JmdbColorNav">
            CASTING
          </Button>
        </Link>
        <Link to="/movie_screenwriters">
          <Button variant="outlined" color="JmdbColorNav">
            SCENARISTES
          </Button>
        </Link>
        <Link to="/movie_music">
          <Button variant="outlined" color="JmdbColorNav">
            COMPOSITEURS
          </Button>
        </Link>
        <Link to="/movie_studio">
          <Button variant="outlined" color="JmdbColorNav">
            STUDIOS
          </Button>
        </Link>
      </Stack>
    </ThemeProvider>
  );
}
