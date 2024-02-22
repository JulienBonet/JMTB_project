import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import "./chronologicBtn.css";

function ChronologicBtn({ onClick }) {
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
        className="chronologic_btn"
        onClick={onClick}
      >
        TRI CHRONOLOGIQUE
      </Button>
    </ThemeProvider>
  );
}

export default ChronologicBtn;
