import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./adminFeat.css";
import AdminMovieList from "../../components/AdminFeatures/AdminItemsLists/AdminMovieList";
import AdminDirectorList from "../../components/AdminFeatures/AdminItemsLists/AdminDirectorList";
import AdminCastingList from "../../components/AdminFeatures/AdminItemsLists/AdminCastingList";
import AdminScreenwriterList from "../../components/AdminFeatures/AdminItemsLists/AdminScreenwriterList";
import AdminCompositorList from "../../components/AdminFeatures/AdminItemsLists/AdminCompositorList";
import AdminStudioList from "../../components/AdminFeatures/AdminItemsLists/AdminStudioList";
import AdminGenreList from "../../components/AdminFeatures/AdminItemsLists/AdminGenreList";
import AdminCountryList from "../../components/AdminFeatures/AdminItemsLists/AdminCountryList";
import AdminTagsList from "../../components/AdminFeatures/AdminItemsLists/AdminTagsList";
import AdminLanguagesList from "../../components/AdminFeatures/AdminItemsLists/AdminLanguagesList";

function AdminFeat() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#00d9c0",
      },
      secondary: {
        main: "#ffebaa",
      },
    },
  });

  // ADMIN NAV

  const [selectedItem, setSelectedItem] = useState("FILMS");

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const renderSelectedItem = () => {
    switch (selectedItem) {
      case "FILMS":
        return <AdminMovieList />;
      case "REALISATEURS":
        return <AdminDirectorList />;
      case "CASTING":
        return <AdminCastingList />;
      case "SCENARISTES":
        return <AdminScreenwriterList />;
      case "COMPOSITEURS":
        return <AdminCompositorList />;
      case "STUDIO":
        return <AdminStudioList />;
      case "GENRES":
        return <AdminGenreList />;
      case "PAYS":
        return <AdminCountryList />;
      case "LANGUES":
        return <AdminLanguagesList />;
      case "THEMAS":
        // WORK IN PROGRESS
        return <AdminTagsList />;
      case "TAGS":
        return <AdminTagsList />;
      default:
        return null;
    }
  };

  return (
    <main>
      <section className="AdminFeatNav">
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              "& > *": {
                m: 1,
              },
            }}
          >
            <ButtonGroup
              variant="outlined"
              color="primary"
              aria-label="Basic button group"
            >
              <Button onClick={() => handleItemClick("FILMS")}>FILMS</Button>
              <Button onClick={() => handleItemClick("REALISATEURS")}>
                REALISATEURS
              </Button>
              <Button onClick={() => handleItemClick("CASTING")}>
                CASTING
              </Button>
              <Button onClick={() => handleItemClick("SCENARISTES")}>
                SCENARISTES
              </Button>
              <Button onClick={() => handleItemClick("COMPOSITEURS")}>
                COMPOSITEURS
              </Button>
              <Button onClick={() => handleItemClick("STUDIO")}>STUDIO</Button>
              <Button onClick={() => handleItemClick("GENRES")}>GENRES</Button>
              <Button onClick={() => handleItemClick("PAYS")}>PAYS</Button>
              <Button onClick={() => handleItemClick("LANGUES")}>
                LANGUES
              </Button>
              <Button onClick={() => handleItemClick("THEMAS")}>THEMAS</Button>
              <Button onClick={() => handleItemClick("TAGS")}>TAGS</Button>
            </ButtonGroup>
          </Box>
        </ThemeProvider>
      </section>
      <section className="AdminFeatContainer">
        <div className="AdminFeatContent">{renderSelectedItem()}</div>
      </section>
    </main>
  );
}

export default AdminFeat;
