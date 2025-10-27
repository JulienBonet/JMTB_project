import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
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
import AdminThemaList from "../../components/AdminFeatures/AdminItemsLists/AdminThemaList";

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
      case "TAGS":
        return <AdminTagsList />;
      case "THEMAS":
        return <AdminThemaList />;
      default:
        return null;
    }
  };

  const navItems = [
    "FILMS",
    "REALISATEURS",
    "CASTING",
    "SCENARISTES",
    "COMPOSITEURS",
    "STUDIO",
    "GENRES",
    "PAYS",
    "LANGUES",
    "TAGS",
    "THEMAS",
  ];

  return (
    <main>
      <section className="AdminFeatNav">
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,
              width: "90%",
              margin: "auto",
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item}
                variant={selectedItem === item ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleItemClick(item)}
                sx={{
                  flex: "1 1 140px", // chaque bouton prend au moins 140px, puis s’ajuste
                  minWidth: "120px",
                  maxWidth: "200px",
                }}
              >
                {item}
              </Button>
            ))}
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
