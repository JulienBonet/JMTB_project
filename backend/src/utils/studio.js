// --------------------------------------
// CLEAN DES STUDIOS NAME VENANT DE TMDB
// --------------------------------------

function cleanStudioName(name) {
  if (!name || typeof name !== "string") return "";

  // Remplace les slashs par un tiret
  let cleaned = name.replace(/\//g, "-");

  // Supprime les espaces au début et à la fin
  cleaned = cleaned.trim();

  // Optionnel : supprimer les doubles espaces restants
  cleaned = cleaned.replace(/\s{2,}/g, " ");

  return cleaned;
}

module.exports = { cleanStudioName };
