import axios from "axios";

function AdminExportStats() {
  const handleExportCsv = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/export-csv`,
        {
          responseType: "blob", // important pour télécharger le fichier
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "movies_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Erreur export CSV", err);
    }
  };
  return (
    <main>
      <div>
        <button onClick={handleExportCsv}>Exporter CSV</button>;
      </div>
    </main>
  );
}

export default AdminExportStats;
