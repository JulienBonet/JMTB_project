/* eslint-disable react/prop-types */
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
  openSideBar,
}) {
  const isThema = origin === "focus";
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "10%",
        right: openSideBar ? 20 : -240,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        backgroundColor: "rgba(18,18,18,0.85)",
        border: "1px solid #555",
        borderRadius: 4,
        padding: 1.5,
        boxShadow: 3,
        zIndex: 1200,
        transition: "right 0.4s ease",
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

      {!isThema && (
        <Tooltip title="Trier chronologiquement" placement="right">
          <Box>
            <ChronologicBtn
              onClick={onChronologicClick}
              selectedItems={selectedItems}
              origin={origin}
            />
          </Box>
        </Tooltip>
      )}

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
