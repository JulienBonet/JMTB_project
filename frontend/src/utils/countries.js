// UTILITAIRE DE TRADUCTION DE NOMS PAYS //

import countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";

countries.registerLocale(frLocale);

// Dictionnaire de corrections spécifiques
const countryCorrections = {
  "États-Unis d'Amérique": "États-Unis",
  //   "Royaume-Uni de Grande-Bretagne et d'Irlande du Nord": "Royaume-Uni",
  // ajoutez ici toutes les corrections
};

/**
 * Traduit un code ISO de pays en français et applique les corrections.
 * @param {string} isoCode - code ISO 3166-1
 * @param {string} fallbackName - nom alternatif si la traduction échoue
 * @returns {string} Nom du pays en français corrigé
 */
export function translateCountry(isoCode, fallbackName = "") {
  let countryNameFr = countries.getName(isoCode, "fr") || fallbackName;

  if (countryCorrections[countryNameFr]) {
    countryNameFr = countryCorrections[countryNameFr];
  }

  return countryNameFr;
}

/**
 * Permet d'ajouter dynamiquement une correction
 */
export function addCountryCorrection(original, corrected) {
  countryCorrections[original] = corrected;
}
