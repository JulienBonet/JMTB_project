import axios from "axios";
import { Button, Stack } from "@mui/material";

function AdminExportStats() {
  const handleExportCsv = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/export-csv`,
        { responseType: "blob" }
      );

      const disposition = response.headers["content-disposition"];
      let fileName = "movies_export.csv";
      if (disposition && disposition.includes("filename=")) {
        fileName = disposition.split("filename=")[1].replace(/"/g, "");
      } else {
        const dateStr = new Date().toISOString().replace(/[:.]/g, "-");
        fileName = `movies_export_${dateStr}.csv`;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Erreur export CSV", err);
    }
  };

  const handleExportSql = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/export-sql`,
        { responseType: "blob" }
      );

      const disposition = response.headers["content-disposition"];
      let fileName = "jmdb2_backup.sql";
      if (disposition && disposition.includes("filename=")) {
        fileName = disposition.split("filename=")[1].replace(/"/g, "");
      } else {
        const dateStr = new Date().toISOString().replace(/[:.]/g, "-");
        fileName = `jmdb2_backup_${dateStr}.sql`;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Erreur export SQL", err);
    }
  };

  const buttonSx = (bgColor, hoverColor) => ({
    backgroundColor: bgColor,
    color: "#fff",
    fontWeight: 400,
     fontFamily: "var(--font-01)",
    "&:hover": {
      backgroundColor: hoverColor,
    },
    padding: "8px 24px",
    borderRadius: 2,
    textTransform: "none",
  });

  return (
    <main>
      <section className="export_button_container_Admin_export_List">
        <Stack direction="column" spacing={3}>
          <Button
            sx={buttonSx("#1976d2", "#115293")} // bleu pour CSV
            onClick={handleExportCsv}
          >
            Exporter CSV
          </Button>
          <Button
            sx={buttonSx("#9c27b0", "#6d1b7b")} // violet pour SQL
            onClick={handleExportSql}
          >
            Exporter SQL
          </Button>
        </Stack>
      </section>
    </main>
  );
}

export default AdminExportStats;
