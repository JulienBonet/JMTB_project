/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
import * as React from "react";
import axios from "axios";
import { createTheme, useTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect } from "react";
import { FixedSizeList } from "react-window";
import Grid from "@mui/material/Grid";
import { Modal, Box, Container } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import CreateItemCard from "../CreateItemCard/CreateItemCard";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList({
  items,
  selectedKinds,
  onSelectedKindsUpdate,
  selectedDirectors,
  onSelectedDirectorsUpdate,
  selectedScreenwriters,
  onSelectedScreenwritersUpdate,
  selectedMusic,
  onSelectedMusicUpdate,
  selectedCasting,
  onSelectedCastingUpdate,
  selectedStudios,
  onSelectedStudiosUpdate,
  selectedCountries,
  onSelectedCountriesUpdate,
  selectedLanguages,
  onSelectedLanguagesUpdate,
  selectedTags,
  onSelectedTagsUpdate,
  selectedFocus,
  onSelectedFocusUpdate,
  dataType,
}) {
  let selectedItems;
  let onSelectedItemsUpdate;

  switch (dataType) {
    case "kinds":
      selectedItems = selectedKinds || [];
      onSelectedItemsUpdate = onSelectedKindsUpdate || (() => {});
      break;
    case "directors":
      selectedItems = selectedDirectors || [];
      onSelectedItemsUpdate = onSelectedDirectorsUpdate || (() => {});
      break;
    case "screenwriters":
      selectedItems = selectedScreenwriters || [];
      onSelectedItemsUpdate = onSelectedScreenwritersUpdate || (() => {});
      break;
    case "music":
      selectedItems = selectedMusic || [];
      onSelectedItemsUpdate = onSelectedMusicUpdate || (() => {});
      break;
    case "casting":
      selectedItems = selectedCasting || [];
      onSelectedItemsUpdate = onSelectedCastingUpdate || (() => {});
      break;
    case "studio":
    case "studios":
      selectedItems = selectedStudios || [];
      onSelectedItemsUpdate = onSelectedStudiosUpdate || (() => {});
      break;
    case "country":
    case "countries":
      selectedItems = selectedCountries || [];
      onSelectedItemsUpdate = onSelectedCountriesUpdate || (() => {});
      break;
    case "languages/sorted_id":
    case "languages":
      selectedItems = selectedLanguages || [];
      onSelectedItemsUpdate = onSelectedLanguagesUpdate || (() => {});
      break;
    case "tags/sorted_id":
    case "tags":
      selectedItems = selectedTags || [];
      onSelectedItemsUpdate = onSelectedTagsUpdate || (() => {});
      break;
    case "focus":
      selectedItems = selectedFocus || [];
      onSelectedItemsUpdate = onSelectedFocusUpdate || (() => {});
      break;
    default:
      selectedItems = [];
      onSelectedItemsUpdate = () => {};
  }

  const getOriginFromDataType = (dataType) => {
    switch (dataType) {
      case "directors":
        return "director";
      case "casting":
        return "casting";
      case "screenwriters":
        return "screenwriter";
      case "music":
        return "compositor";
      case "studio":
        return "studio";
      case "country":
        return "country";
      case "kinds":
        return "kind";
      case "languages/sorted_id":
        return "language";
      case "tags/sorted_id":
        return "tag";
      case "focus":
        return "focus";
      default:
        return "";
    }
  };

  // État pour la barre de recherche dans la liste de droite
  const [searchTermRight, setSearchTermRight] = useState("");

  // Modal createdItemCard
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
    setSearchTermRight("");
  };

  // Item List
  const [checked, setChecked] = useState([]);

  const [left, setLeft] = useState(selectedItems || []);
  const [right, setRight] = useState(
    (items || []).filter(
      (item) => !(selectedItems || []).some((kind) => kind.id === item.id)
    )
  );

  useEffect(() => {
    setRight(
      (items || []).filter(
        (item) =>
          !(selectedItems || []).some(
            (selectedItem) => selectedItem.id === item.id
          )
      )
    );
  }, [items, selectedItems]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));

    const updatedSelectedItems = selectedItems.filter(
      (item) => !leftChecked.some((checkedItem) => checkedItem.id === item.id)
    );
    onSelectedItemsUpdate(updatedSelectedItems);
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(
      not(right, rightChecked).filter(
        (item) =>
          !selectedItems.some((selectedItem) => selectedItem.id === item.id)
      )
    );
    setChecked(not(checked, rightChecked));
    onSelectedItemsUpdate(left.concat(rightChecked));
  };

  // Fonction pour filtrer les items de droite en fonction de la recherche
  const filteredRightItems = right.filter((item) =>
    item.name.toLowerCase().includes(searchTermRight.toLowerCase())
  );

  // Fonction pour gérer l'ajout d'un nouvel élément
  const handleNewItem = async (name) => {
    try {
      console.info(
        "axios dans handleNewItem:",
        `${import.meta.env.VITE_BACKEND_URL}/api/${getOriginFromDataType(dataType)}/byname/${name}`
      );
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${getOriginFromDataType(dataType)}/byname/${name}`
      );
      const newItem = response.data;
      console.info(newItem);

      // Vérifie si l'item n'est pas déjà présent dans right
      if (!right.some((item) => item.id === newItem.id)) {
        setRight((prevRight) => [...prevRight, newItem]);
      } else {
        console.info("L'élément existe déjà dans right.");
      }
      setSearchTermRight(newItem.name);
      console.info("right in handleNewItem", right);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'élément :", error);
    }
  };

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0, // smartphones
        sm: 769, // tablettes
        md: 1100, // laptops
        lg: 1650, // desktop
        xl: 2000, // très grands écrans
      },
    },
  });

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const listHeight = isSmall ? 220 : 460;

  const customList = (
    items,
    showSearch = false,
    searchTerm = "",
    onSearchChange = () => {}
  ) => (
    <Paper
      sx={{
        width: 350,
        height: { listHeight },
        overflow: "auto",
        overflowX: "hidden",
        overflowY: "hidden",
        border: "solid 1px var(--color-04)",
      }}
    >
      {showSearch && (
        <TextField
          sx={{ m: 1, width: "95%" }}
          fullWidth
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={onSearchChange}
        />
      )}
      <FixedSizeList
        height={listHeight}
        width={350}
        itemCount={items.length}
        itemSize={50}
        style={{ overflowX: "hidden", overflowY: "auto" }}
      >
        {({ index, style }) => (
          <ListItemButton
            key={index}
            role="listitem"
            onClick={handleToggle(items[index])}
            style={style}
          >
            <ListItemIcon>
              <Checkbox
                checked={checked.indexOf(items[index]) !== -1}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary={items[index].name} />
          </ListItemButton>
        )}
      </FixedSizeList>
    </Paper>
  );

  return (
    <>
      <Grid
        container
        spacing={0}
        justifyContent="center"
        alignItems="center"
        sx={{
          width: "95%",
          maxWidth: "100%",
          margin: "0 auto",
          padding: "0",
          flexWrap: "nowrap",
          flexDirection: "row",
          gap: 2,
          "@media (max-width: 768px)": {
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        {/* Liste de gauche */}
        <Grid
          item
          sx={{
            flexShrink: 1,
            flexGrow: 1,
            minWidth: { xs: "90%", sm: "40%", md: "40%", lg: "350px" },
            maxWidth: 500,
            display: "flex",
            justifyContent: "center",
            paddingLeft: "10px",
            "@media (max-width: 768px)": {
              paddingLeft: 0,
            },
          }}
        >
          {customList(left)}
        </Grid>
        {/* Colonne centrale avec les boutons */}
        <Grid item>
          <Grid
            container
            direction={{ xs: "row", sm: "row", md: "column" }}
            alignItems="center"
            justifyContent="center"
            gap="0 1rem"
          >
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              {isSmall ? "↓" : ">"}
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => openModal()}
              aria-label="add new item"
            >
              +
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              {isSmall ? "↑" : "<"}
            </Button>
          </Grid>
        </Grid>
        {/* Liste de droite */}
        <Grid
          item
          sx={{
            flexShrink: 1,
            flexGrow: 1,
            minWidth: { xs: "90%", sm: "40%", md: "40%", lg: "350px" },
            maxWidth: 500,
            display: "flex",
            justifyContent: "center",
            paddingRight: "10px",
            "@media (max-width: 768px)": {
              paddingRight: 0,
            },
          }}
        >
          {customList(filteredRightItems, true, searchTermRight, (e) =>
            setSearchTermRight(e.target.value)
          )}
        </Grid>
      </Grid>
      <Modal open={showModal} onClose={closeModal} className="Movie_Modal">
        <Box>
          <Container maxWidth="sm">
            <div
              onClick={closeModal}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  closeModal();
                }
              }}
              role="button"
              tabIndex={0}
              className="modal_closed_btn"
            >
              X Fermer
            </div>
            {/* Composant CreateItemCard */}
            <CreateItemCard
              origin={getOriginFromDataType(dataType)}
              onUpdate={(newItemName) => {
                setShowModal(false);
                handleNewItem(newItemName);
              }}
              closeModal={closeModal}
            />
          </Container>
        </Box>
      </Modal>
    </>
  );
}
