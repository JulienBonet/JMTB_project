const { purgeOrphanedRecords } = require("../models/purgeModel");

const purgeControllers = {
  async purgeDatabase(req, res) {
    try {
      await purgeOrphanedRecords();
      res.status(200).json({ message: "Purge terminée avec succès ✅" });
    } catch (error) {
      console.error("Erreur lors de la purge :", error);
      res.status(500).json({ message: "Erreur lors de la purge ❌", error });
    }
  },
};

module.exports = purgeControllers;
