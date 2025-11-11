/* eslint-disable react/prop-types */
import { IconButton, Tooltip } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";

export default function ToggleSortedButton({
  active,
  onClick,
  tooltip = "Afficher les options de tri",
}) {
  return (
    <Tooltip title={tooltip}>
      <IconButton
        onClick={onClick}
        sx={{
          color: active ? "#ffebcd" : "#888",
          backgroundColor: active
            ? "rgba(18,18,18,0.85)"
            : "rgba(18,18,18,0.3)",
          border: "1px solid #555",
          "&:hover": {
            backgroundColor: active ? "#3a3205" : "rgba(18,18,18,0.5)",
          },
          zIndex: 1300,
          pointerEvents: active ? "auto" : "none",
        }}
      >
        <TuneIcon />
      </IconButton>
    </Tooltip>
  );
}
