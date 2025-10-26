import * as React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "../../../assets/css/var_font_color.css";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div>
      <Button
        id="burgerMenuButton"
        aria-controls={open ? "burgerMenu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {open ? (
          <CloseIcon sx={{ fontSize: 30, color: "var(--color-01)" }} />
        ) : (
          <MenuIcon sx={{ fontSize: 30, color: "var(--color-01)" }} />
        )}
      </Button>

      <Menu
        id="burgerMenu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "burgerMenuButton",
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "var(--color-05)",
              color: "var(--color-01)",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid var(--color-02)",
              borderRadius: "8px",
              minWidth: 240,
              paddingY: 1,
            },
          },
        }}
      >
        {/* RECHERCHE GÉNÉRALE */}
        <MenuItem
          onClick={handleClose}
          component={Link}
          to="/movie_search"
          sx={{ justifyContent: "center" }}
        >
          RECHERCHE FILMS
        </MenuItem>

        <Divider sx={{ backgroundColor: "var(--color-02)", marginY: 1 }} />

        {/* TITRE : RECHERCHE PAR (non cliquable) */}
        <Box sx={{ px: 2, textAlign: "center" }}>
          <Typography
            sx={{
              fontWeight: 700,
              color: "var(--color-02)",
              letterSpacing: 0.6,
              marginBottom: 1,
            }}
            aria-hidden="true"
          >
            - RECHERCHE PAR -
          </Typography>
        </Box>

        {/* LISTE DES RECHERCHES PAR */}
        <MenuItem
          onClick={handleClose}
          component={Link}
          to="/movie_directors"
          sx={{ justifyContent: "center" }}
        >
          RÉALISATEUR
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          component={Link}
          to="/movie_casting"
          sx={{ justifyContent: "center" }}
        >
          CASTING
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          component={Link}
          to="/movie_screenwriters"
          sx={{ justifyContent: "center" }}
        >
          SCÉNARISTE
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          component={Link}
          to="/movie_music"
          sx={{ justifyContent: "center" }}
        >
          COMPOSITEUR
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          component={Link}
          to="/movie_studio"
          sx={{ justifyContent: "center" }}
        >
          STUDIO
        </MenuItem>

        <Divider sx={{ backgroundColor: "var(--color-02)", marginY: 1 }} />

        {/* ADMIN */}
        <MenuItem
          onClick={handleClose}
          component={Link}
          to="/admin_feat"
          sx={{ justifyContent: "center" }}
        >
          ADMIN
        </MenuItem>
      </Menu>
    </div>
  );
}
