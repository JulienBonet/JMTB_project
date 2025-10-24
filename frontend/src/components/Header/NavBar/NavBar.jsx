import { useState } from "react";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./NavBar.css";

export default function BasicButtons() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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

          {/* Bouton RECHERCHE PAR avec flèche déroulante */}
          <div>
            <Button
              variant="outlined"
              color="JmdbColorNav"
              onClick={handleClick}
              endIcon={<ArrowDropDownIcon />}
            >
              RECHERCHE PAR
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                component={Link}
                to="/movie_directors"
                onClick={handleClose}
              >
                RÉALISATEURS
              </MenuItem>
              <MenuItem
                component={Link}
                to="/movie_casting"
                onClick={handleClose}
              >
                CASTING
              </MenuItem>
              <MenuItem
                component={Link}
                to="/movie_screenwriters"
                onClick={handleClose}
              >
                SCÉNARISTES
              </MenuItem>
              <MenuItem
                component={Link}
                to="/movie_music"
                onClick={handleClose}
              >
                COMPOSITEURS
              </MenuItem>
              <MenuItem
                component={Link}
                to="/movie_studio"
                onClick={handleClose}
              >
                STUDIOS
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
