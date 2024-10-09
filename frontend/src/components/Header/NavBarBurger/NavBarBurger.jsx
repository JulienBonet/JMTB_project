import * as React from "react";
import { Link } from "react-router-dom"; // Pour la navigation
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "../../../assets/css/var_font_color.css";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="bugerMenuButton"
        aria-controls={open ? "burgerMenu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {/* Icônes avec stylisation */}
        {open ? (
          <CloseIcon sx={{ fontSize: 30, color: "var(--color-01)" }} /> // Croix stylisée
        ) : (
          <MenuIcon sx={{ fontSize: 30, color: "var(--color-01)" }} /> // Burger stylisé
        )}
      </Button>

      {/* Menu stylisé */}
      <Menu
        id="burgerMenu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "bugerMenuButton",
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "var(--color-05)",
              color: "var(--color-01)",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid var(--color-02)",
              borderRadius: "8px",
            },
          },
        }}
      >
        {/* Navigation organisée */}
        <MenuItem
          onClick={handleClose}
          component={Link}
          to="/"
          sx={{ width: "100%", justifyContent: "center" }}
        >
          HOME
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component={Link}
          to="/movie_search"
          sx={{ width: "100%", justifyContent: "center" }}
        >
          RECHERCHE
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component={Link}
          to="/admin_feat"
          sx={{ width: "100%", justifyContent: "center" }}
        >
          ADMIN
        </MenuItem>
      </Menu>
    </div>
  );
}
