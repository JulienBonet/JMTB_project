/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable import/no-unresolved */
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import LogoJmdb from "../../assets/ico/logo_jmdb.png";
import NavBar from "./NavBar/NavBar";
import NavBarBurger from "./NavBarBurger/NavBarBurger";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const isDesktop = useMediaQuery("(min-width:1024px)");

  function handleClick() {
    navigate("/");
  }

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
          <div className="header_03" />
        </>
      ) : (
        <NavBarBurger />
      )}
    </header>
  );
}

export default Header;
