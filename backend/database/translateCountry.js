// UTILITAIRE DE TRADUCTION DE NOMS PAYS //

const countries = require("i18n-iso-countries");
const frLocale = require("i18n-iso-countries/langs/fr.json");

countries.registerLocale(frLocale);

// Dictionnaire de corrections spécifiques
const countryCorrections = {
  "États-Unis d'Amérique": "USA",
  //   "Royaume-Uni de Grande-Bretagne et d'Irlande du Nord": "Royaume-Uni",
  // ajoutez ici toutes les corrections
};

/**
 * Traduit un code ISO de pays en français et applique les corrections.
 * @param {string} isoCode - code ISO 3166-1
 * @param {string} fallbackName - nom alternatif si la traduction échoue
 * @returns {string} Nom du pays en français corrigé
 */
function translateCountry(isoCode, fallbackName = "") {
  let countryNameFr = countries.getName(isoCode, "fr") || fallbackName;

  if (countryCorrections[countryNameFr]) {
    countryNameFr = countryCorrections[countryNameFr];
  }

  return countryNameFr;
}

/**
 * Permet d'ajouter dynamiquement une correction
 */
function addCountryCorrection(original, corrected) {
  countryCorrections[original] = corrected;
}

module.exports = { translateCountry, addCountryCorrection };
