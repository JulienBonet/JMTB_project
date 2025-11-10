/* eslint-disable no-dupe-keys */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import AlphabeticBtn from "../AlphabeticBtn/AlphabeticBtn";
import ChronologicBtn from "../ChronologicBtn/ChronologicBtn";

export default function SideActionBar({
  onAlphabeticClick,
  onChronologicClick,
  onResetClick,
  selectedItems,
  origin,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // lancement progressif de l’animation
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        backgroundColor: "rgba(18,18,18,0.85)",
        border: 1,
        borderRadius: 4,
        padding: 1.5,
        boxShadow: 3,
        zIndex: 1200,
        opacity: visible ? 1 : 0,
        transformOrigin: "left center",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        transform: visible
          ? "translateY(-50%) translateX(0)"
          : "translateY(-50%) translateX(-30px)",
      }}
    >
      <Tooltip title="Trier alphabétiquement" placement="right">
        <Box>
          <AlphabeticBtn
            onClick={onAlphabeticClick}
            selectedItems={selectedItems}
            origin={origin}
          />
        </Box>
      </Tooltip>

      <Tooltip title="Trier chronologiquement" placement="right">
        <Box>
          <ChronologicBtn
            onClick={onChronologicClick}
            selectedItems={selectedItems}
            origin={origin}
          />
        </Box>
      </Tooltip>

      <Tooltip title="Réinitialiser la recherche" placement="right">
        <IconButton
          onClick={onResetClick}
          sx={{
            color: "#ffebcd",
            backgroundColor: "#242105",
            "&:hover": { backgroundColor: "#3a3205" },
          }}
        >
          <CachedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
