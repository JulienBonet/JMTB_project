import { useState } from "react";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./NavBar.css";

export default function navBar() {
  // Menu 1 : Recherche par
  const [anchorSearch, setAnchorSearch] = useState(null);
  const openSearch = Boolean(anchorSearch);

  // Menu 2 : Ciné-club
  const [anchorCine, setAnchorCine] = useState(null);
  const openCine = Boolean(anchorCine);

  const theme = createTheme({
    palette: {
      JmdbColorNav: {
        main: "#ffebcd",
        light: "#ffc45e",
        dark: "#e59100",
        contrastText: "#242105",
      },
    },
  });

  return (
    <section>
      <ThemeProvider theme={theme}>
        <Stack spacing={2} direction="row" className="navBar_container">
          {/* Bouton RECHERCHE FILMS */}
          <Link to="/movie_search">
            <Button variant="outlined" color="JmdbColorNav">
              RECHERCHE FILMS
            </Button>
          </Link>

          {/* Menu : RECHERCHE PAR */}
          <div>
            <Button
              variant="outlined"
              color="JmdbColorNav"
              onClick={(e) => setAnchorSearch(e.currentTarget)}
              endIcon={<ArrowDropDownIcon />}
            >
              RECHERCHE PAR
            </Button>

            <Menu
              anchorEl={anchorSearch}
              open={openSearch}
              onClose={() => setAnchorSearch(null)}
            >
              <MenuItem
                component={Link}
                to="/movie_directors"
                onClick={() => setAnchorSearch(null)}
              >
                RÉALISATEURS
              </MenuItem>
              <MenuItem
                component={Link}
                to="/movie_casting"
                onClick={() => setAnchorSearch(null)}
              >
                CASTING
              </MenuItem>
              <MenuItem
                component={Link}
                to="/movie_screenwriters"
                onClick={() => setAnchorSearch(null)}
              >
                SCÉNARISTES
              </MenuItem>
              <MenuItem
                component={Link}
                to="/movie_music"
                onClick={() => setAnchorSearch(null)}
              >
                COMPOSITEURS
              </MenuItem>
              <MenuItem
                component={Link}
                to="/movie_studio"
                onClick={() => setAnchorSearch(null)}
              >
                STUDIOS
              </MenuItem>
              <MenuItem
                component={Link}
                to="/movie_tag"
                onClick={() => setAnchorSearch(null)}
              >
                TAGS
              </MenuItem>
            </Menu>
          </div>

          {/* Menu : CINE CLUB */}
          <div>
            <Button
              variant="outlined"
              color="JmdbColorNav"
              onClick={(e) => setAnchorCine(e.currentTarget)}
              endIcon={<ArrowDropDownIcon />}
            >
              CINE-CLUB
            </Button>

            <Menu
              anchorEl={anchorCine}
              open={openCine}
              onClose={() => setAnchorCine(null)}
            >
              <MenuItem
                component={Link}
                to="/movie_thema"
                onClick={() => setAnchorCine(null)}
              >
                THEMAS
              </MenuItem>
              <MenuItem
                component={Link}
                to="/movie_thema_festival"
                onClick={() => setAnchorCine(null)}
              >
                FESTIVALS
              </MenuItem>

              <MenuItem
                component={Link}
                to="/movie_thema_directors"
                onClick={() => setAnchorCine(null)}
              >
                LES GRANDS MAÎTRES
              </MenuItem>
              <MenuItem
                component={Link}
                to="/movie_thema_casting"
                onClick={() => setAnchorCine(null)}
              >
                LES STARS
              </MenuItem>
            </Menu>
          </div>

          {/* Bouton ADMIN */}
          <Link to="/admin_feat">
            <Button variant="outlined" color="JmdbColorNav">
              ADMIN
            </Button>
          </Link>
        </Stack>
      </ThemeProvider>
    </section>
  );
}
