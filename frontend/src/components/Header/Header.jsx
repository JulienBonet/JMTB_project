/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable import/no-unresolved */
import { useNavigate } from "react-router-dom";
import "./Header.css";
import LogoJmdb from "../../assets/ico/logo_jmdb.png";
import NavBar from "./NavBar/NavBar";

function Header() {
  const navigate = useNavigate();

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
      <NavBar />
      <div className="header_03" />
    </header>
  );
}

export default Header;
