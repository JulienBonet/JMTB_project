/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import "./alphabeticBtn.css";
import "./alphabeticBtnMediaQueries.css";

function AlphabeticBtn({ onClick, origin, selectedItems, onExpandedChange }) {
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
  }, [selectedItems, onExpandedChange]);

  return (
    <ThemeProvider theme={theme}>
      <Button
        variant="outlined"
        color="sortedBtn"
        className={
          origin !== "artists" ? "alphabetic_btn" : "alphabetic_btn_artists"
        }
        onClick={onClick}
        disabled={!expanded}
      >
        TRI ALPHABÉTIQUE
      </Button>
    </ThemeProvider>
  );
}

export default AlphabeticBtn;
