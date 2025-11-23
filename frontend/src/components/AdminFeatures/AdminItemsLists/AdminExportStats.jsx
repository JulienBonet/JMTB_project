import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function AdminExportStats() {
  // --------------
  // STATS
  // --------------
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`
        );
        setStats(res.data);
      } catch (err) {
        console.error("Erreur stats:", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Chargement des stats...</p>;

  // --------------
  // EXPORT CSV
  // --------------
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

  // --------------
  // EXPORT SQL
  // --------------
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

  // --------------
  // SX
  // --------------
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

  const infoStatsSX = () => ({
    fontSize: "x-large",
    fontFamily: "var(--font-02)",
    color: "var(--color-05)",
    marginBottom: "0.5rem",
  });

  const accordionSX = () => ({
    backgroundColor: "aliceblue",
    border: "solid 1px var(--color-04)",
    borderRadius: "10px",
  });

  // --------------
  // RETURN
  // --------------
  return (
    <main className="main_Admin_export_List">
      {/* EXPORT BUTTONS */}
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
      {/* STATS */}
      <secion className="stats_container_Admin_export_List">
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: "var(--font-01)",
            textAlign: "center",
            marginBottom: 3,
          }}
        >
          Statistiques générales
        </Typography>

        {/* info stats */}
        <div className="infoStats_container_Admin_export_List">
          <Typography sx={infoStatsSX()}>
            <span className="infoStatWeight">Total films:</span>{" "}
            {stats.totalMovies}
          </Typography>
          <Typography sx={infoStatsSX()}>
            <span className="infoStatWeight">Total poids fichiers (MB):</span>{" "}
            {Number(stats.totalSizeMB || 0).toFixed(2)}
          </Typography>
          <Typography sx={infoStatsSX()}>
            <span className="infoStatWeight">Total durée (min):</span>{" "}
            {stats.totalDuration}
          </Typography>
          <Typography sx={infoStatsSX()}>
            <span className="infoStatWeight">Total réalisateurs:</span>{" "}
            {stats.totalDirectors}
          </Typography>
          <Typography sx={infoStatsSX()}>
            <span className="infoStatWeight">Total scénaristes:</span>{" "}
            {stats.totalScreenwriters}
          </Typography>
          <Typography sx={infoStatsSX()}>
            <span className="infoStatWeight">Total compositeurs:</span>{" "}
            {stats.totalComposers}
          </Typography>
          <Typography sx={infoStatsSX()}>
            <span className="infoStatWeight">Total studios:</span>{" "}
            {stats.totalStudios}
          </Typography>
          <Typography sx={infoStatsSX()}>
            <span className="infoStatWeight">Total tags:</span>{" "}
            {stats.totalTags}
          </Typography>
        </div>

        {/* Accordions */}
        <div className="accordion_container_Admin_export_List">
          <Accordion sx={accordionSX}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={infoStatsSX()}>
                <span className="infoStatWeight">Total genres:</span>{" "}
                {stats.totalGenres}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {stats.genresByCount.map((g) => (
                <Typography key={g.name} sx={infoStatsSX()}>
                  <span className="infoStatWeight">{g.name}:</span>{" "}
                  {g.movieCount}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>

          <Accordion sx={accordionSX}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={infoStatsSX()}>
                <span className="infoStatWeight">Total focus:</span>{" "}
                {stats?.totalFocus || 0}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {stats?.focusByCategory?.length > 0 ? (
                stats.focusByCategory.map((fc) => (
                  <Typography key={fc.categoryName} sx={infoStatsSX()}>
                    <span className="infoStatWeight">{fc.categoryName}:</span>{" "}
                    {fc.focusCount}
                  </Typography>
                ))
              ) : (
                <Typography sx={infoStatsSX()}>
                  Aucun focus disponible
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
      </secion>
    </main>
  );
}

export default AdminExportStats;
