import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import "./alphabeticBtn.css";

function AlphabeticBtn({ onClick }) {
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

  return (
    <ThemeProvider theme={theme}>
      <Button
        variant="outlined"
        color="sortedBtn"
        className="alphabetic_btn"
        onClick={onClick}
      >
        TRI ALPHABÉTIQUE
      </Button>
    </ThemeProvider>
  );
}

export default AlphabeticBtn;
