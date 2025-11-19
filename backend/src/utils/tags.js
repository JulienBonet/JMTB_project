// -----------------------------
// CLEAN DES TAGS VENANT DE TMDB
// -----------------------------

function cleanTags(rawTags) {
  return rawTags
    .flatMap((tag) => {
      if (!tag) return [];
      // si tag est un objet { name: "..." }
      if (typeof tag === "object" && tag.name) {
        return tag.name.split(",");
      }
      // si tag est une string directement
      if (typeof tag === "string") {
        return tag.split(",");
      }
      return [];
    })
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 1) // ignore empty or single char tags
    .filter((t, i, arr) => arr.indexOf(t) === i); // dédoublonnage
}

module.exports = { cleanTags };
