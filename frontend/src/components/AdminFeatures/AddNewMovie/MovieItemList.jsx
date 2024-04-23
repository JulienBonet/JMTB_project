/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
import * as React from "react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

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
  dataType,
}) {
  let selectedItems;
  let onSelectedItemsUpdate;

  switch (dataType) {
    case "kinds":
      selectedItems = selectedKinds;
      onSelectedItemsUpdate = onSelectedKindsUpdate;
      break;
    case "directors":
      selectedItems = selectedDirectors;
      onSelectedItemsUpdate = onSelectedDirectorsUpdate;
      break;
    case "screenwriters":
      selectedItems = selectedScreenwriters;
      onSelectedItemsUpdate = onSelectedScreenwritersUpdate;
      break;
    case "music":
      selectedItems = selectedMusic;
      onSelectedItemsUpdate = onSelectedMusicUpdate;
      break;
    case "casting":
      selectedItems = selectedCasting;
      onSelectedItemsUpdate = onSelectedCastingUpdate;
      break;
    case "studio":
      selectedItems = selectedStudios;
      onSelectedItemsUpdate = onSelectedStudiosUpdate;
      break;
    case "country":
      selectedItems = selectedCountries;
      onSelectedItemsUpdate = onSelectedCountriesUpdate;
      break;
    case "languages/sorted_id":
      selectedItems = selectedLanguages;
      onSelectedItemsUpdate = onSelectedLanguagesUpdate;
      break;
    case "tags/sorted_id":
      selectedItems = selectedTags;
      onSelectedItemsUpdate = onSelectedTagsUpdate;
      break;
    default:
      selectedItems = [];
      onSelectedItemsUpdate = () => {};
      break;
  }

  const [checked, setChecked] = useState([]);

  const [left, setLeft] = useState(selectedItems);
  const [right, setRight] = useState(
    items.filter((item) => !selectedItems.some((kind) => kind.id === item.id))
  );

  useEffect(() => {
    setRight(
      items.filter(
        (item) =>
          !selectedItems.some((selectedItem) => selectedItem.id === item.id)
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

  const customList = (items) => (
    <Paper sx={{ width: 350, height: 500, overflow: "auto" }}>
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItemButton
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.name} />{" "}
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList(left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(right)}</Grid>
    </Grid>
  );
}
