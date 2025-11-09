// UTILITAIRES DE TRADUCTION DE NOMS PAYS //

// Tableau de correspondance ISO 639-1 → nom français
export const languagesMap = {
  en: "Anglais",
  fr: "Français",
  es: "Espagnol",
  de: "Allemand",
  it: "Italien",
  ja: "Japonais",
  ko: "Coréen",
  zh: "Chinois",
  ru: "Russe",
  pt: "Portugais",
  ar: "Arabe",
  hi: "Hindi",
  tr: "Turc",
  nl: "Néerlandais",
  sv: "Suédois",
  no: "Norvégien",
  da: "Danois",
  fi: "Finnois",
  pl: "Polonais",
  cs: "Tchèque",
  ro: "Roumain",
  hu: "Hongrois",
  el: "Grec",
  th: "Thaï",
  vi: "Vietnamien",
  id: "Indonésien",
  ms: "Malais",
  he: "Hébreu",
  ur: "Ourdou",
  bn: "Bengali",
  fa: "Persan",
  // ajoutez ici toutes les langues
};

/**
 * Traduit un code ISO 639-1 en nom français.
 * @param {string} isoCode - Code ISO 639-1
 * @param {string} fallbackName - Nom alternatif si le code n'existe pas dans la map
 * @returns {string} Nom de la langue en français
 */
export function translateLanguage(isoCode, fallbackName = "") {
  return languagesMap[isoCode] || fallbackName;
}
