// -----------------/ PURGE ALL ORPHANS RECORDS IN BDD backend /----------------- //

const purgeOrphanRecords = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/purge`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur serveur :", errorData);
      throw new Error(errorData.message || "Erreur lors de la purge");
    }

    const data = await response.json();
    console.info("✅ Purge réussie :", data.message);
    return data; // tu peux récupérer message + détails si ton backend les envoie
  } catch (error) {
    console.error("❌ Erreur dans purgeOrphanRecords :", error);
    throw error;
  }
};

export default purgeOrphanRecords;
