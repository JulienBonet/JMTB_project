/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import "./chronologicBtn.css";

function ChronologicBtn({ onClick, origin, selectedItems }) {
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
    setExpanded(selectedItems !== "");
  }, [selectedItems]);

  return (
    <ThemeProvider theme={theme}>
      <Button
        variant="outlined"
        color="sortedBtn"
        className={
          origin !== "artists"
            ? `chronologic_btn ${expanded ? "active" : ""}`
            : `chronologic_btn_artists ${expanded ? "active" : ""}`
        }
        onClick={onClick}
        disabled={!expanded}
      >
        <AccessTimeFilledIcon />
      </Button>
    </ThemeProvider>
  );
}

export default ChronologicBtn;
