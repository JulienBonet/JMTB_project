/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import "./alphabeticBtn.css";

function AlphabeticBtn({ onClick, origin, selectedItems }) {
  const theme = createTheme({
    palette: {
      sortedBtn: {
        main: "#ffebcd",
        light: "#ffa500",
        dark: "#e59100",
        contrastText: "#242105",
      },
    },
  });

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (selectedItems !== "") {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [selectedItems]);

  return (
    <ThemeProvider theme={theme}>
      <Button
        variant="outlined"
        color="sortedBtn"
        className={`${
          origin !== "artists" ? "alphabetic_btn" : "alphabetic_btn_artists"
        } ${expanded ? "expanded" : ""}`}
        style={{
          height: expanded ? "37px" : "0",
          fontSize: expanded ? "1rem" : "0",
          padding: expanded ? "10px 0" : "0",
          border: expanded ? "solid 1px var(--color-primary)" : "0",
          borderTop: expanded ? "0" : "none",
          transition: "height 0.3s ease-in",
        }}
        onClick={onClick}
      >
        TRI ALPHABÉTIQUE
      </Button>
    </ThemeProvider>
  );
}

export default AlphabeticBtn;
