/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable import/no-unresolved */
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import LogoJmdb from "../../assets/ico/logo_jmdb.png";
import NavBar from "./NavBar/NavBar";
import NavBarBurger from "./NavBarBurger/NavBarBurger";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const isDesktop = useMediaQuery("(min-width:1280px)");

  function handleClick() {
    navigate("/");
  }

  // Fonction logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login"); // redirection vers login
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
    <header className="Header_container">
      <div className="header_01">
        <img
          src={LogoJmdb}
          alt="Logo - Home"
          className="LogoJmdb"
          onClick={handleClick}
          onKeyDown={handleClick}
          role="button"
        />
      </div>
      {isDesktop ? (
        <>
          <NavBar />
          <div className="header_03">
            <ThemeProvider theme={theme}>
              <Button
                // variant="outlined"
                color="JmdbColorNav"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              />
            </ThemeProvider>
          </div>
        </>
      ) : (
        <NavBarBurger />
      )}
    </header>
  );
}

export default Header;
