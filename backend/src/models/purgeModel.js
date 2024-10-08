const db = require("../../database/client");

// Recherche réalisateurs orphelins
async function findOrphanedDirectors() {
  const query = `
      SELECT d.id 
      FROM director d 
      LEFT JOIN movie_director md ON d.id = md.directorId 
      WHERE md.movieId IS NULL;
    `;

  const [orphanedDirectors] = await db.execute(query);
  return orphanedDirectors.map((director) => director.id);
}

// Recherche casting orphelins
async function findOrphanedCasting() {
  const query = `
      SELECT c.id 
      FROM casting c 
      LEFT JOIN movie_casting mc ON c.id = mc.castingId 
      WHERE mc.movieId IS NULL;
    `;

  const [orphanedCasting] = await db.execute(query);
  return orphanedCasting.map((cast) => cast.id);
}

// Recherche scénaristes orphelins
async function findOrphanedScreenwriters() {
  const query = `
      SELECT s.id 
      FROM screenwriter s 
      LEFT JOIN movie_screenwriter ms ON s.id = ms.screenwriterId 
      WHERE ms.movieId IS NULL;
    `;

  const [orphanedScreenwriters] = await db.execute(query);
  return orphanedScreenwriters.map((screenwriter) => screenwriter.id);
}

// Recherche compositeurs orphelins
async function findOrphanedMusic() {
  const query = `
      SELECT m.id 
      FROM music m 
      LEFT JOIN movie_music mm ON m.id = mm.musicId 
      WHERE mm.movieId IS NULL;
    `;

  const [orphanedMusic] = await db.execute(query);
  return orphanedMusic.map((music) => music.id);
}

// Recherche studios orphelins
async function findOrphanedStudios() {
  const query = `
      SELECT st.id 
      FROM studio st 
      LEFT JOIN movie_studio ms ON st.id = ms.studioId 
      WHERE ms.movieId IS NULL;
    `;

  const [orphanedStudios] = await db.execute(query);
  return orphanedStudios.map((studio) => studio.id);
}

// Recherche langues orphelins
async function findOrphanedLanguages() {
  const query = `
      SELECT l.id 
      FROM language l 
      LEFT JOIN movie_language ml ON l.id = ml.languageId 
      WHERE ml.movieId IS NULL;
    `;

  const [orphanedLanguages] = await db.execute(query);
  return orphanedLanguages.map((language) => language.id);
}

// Recherche pays orphelins
async function findOrphanedCountries() {
  const query = `
      SELECT c.id 
      FROM country c 
      LEFT JOIN movie_country mc ON c.id = mc.countryId 
      WHERE mc.movieId IS NULL;
    `;

  const [orphanedCountries] = await db.execute(query);
  return orphanedCountries.map((country) => country.id);
}

// Recherche genres orphelins
async function findOrphanedGenres() {
  const query = `
      SELECT g.id 
      FROM genre g 
      LEFT JOIN movie_genre mg ON g.id = mg.genreId 
      WHERE mg.movieId IS NULL;
    `;

  const [orphanedGenres] = await db.execute(query);
  return orphanedGenres.map((genre) => genre.id);
}

// Recherche des tags orphelins
async function findOrphanedTags() {
  const query = `
    SELECT t.id 
    FROM tag t 
    LEFT JOIN movie_tag mt ON t.id = mt.tagId 
    WHERE mt.movieId IS NULL;
  `;

  const [orphanedTags] = await db.execute(query);
  return orphanedTags.map((tag) => tag.id);
}

// Nouvelle fonction pour trouver tous les orphelins
async function findOrphanedRecords() {
  const orphanedTags = await findOrphanedTags();
  const orphanedGenres = await findOrphanedGenres();
  const orphanedDirectors = await findOrphanedDirectors();
  const orphanedCasting = await findOrphanedCasting();
  const orphanedScreenwriters = await findOrphanedScreenwriters();
  const orphanedMusic = await findOrphanedMusic();
  const orphanedStudios = await findOrphanedStudios();
  const orphanedCountries = await findOrphanedCountries();
  const orphanedLanguages = await findOrphanedLanguages();

  return {
    orphanedTags,
    orphanedGenres,
    orphanedDirectors,
    orphanedCasting,
    orphanedScreenwriters,
    orphanedMusic,
    orphanedStudios,
    orphanedCountries,
    orphanedLanguages,
  };
}

// Fonction pour supprimer les enregistrements orphelins
async function deleteOrphanedRecords(ids, table, idColumn) {
  console.info(
    `Tentative de suppression des enregistrements orphelins dans ${table} : ${ids.join(", ")}`
  );
  const deleteQuery = `DELETE FROM ${table} WHERE ${idColumn} IN (${ids.join(",")})`;
  await db.execute(deleteQuery);
  console.info(
    `Enregistrements orphelins supprimés de ${table} : ${ids.join(", ")}`
  );
}

// Fonction pour purger tous les enregistrements orphelins
async function purgeOrphanedRecords() {
  const orphanedRecords = await findOrphanedRecords();

  if (orphanedRecords.orphanedTags.length > 0) {
    console.info(
      `Tags orphelins trouvés : ${orphanedRecords.orphanedTags.join(", ")}`
    );
    await deleteOrphanedRecords(orphanedRecords.orphanedTags, "tag", "id");
  }

  if (orphanedRecords.orphanedGenres.length > 0) {
    console.info(
      `Genres orphelins trouvés : ${orphanedRecords.orphanedGenres.join(", ")}`
    );
    await deleteOrphanedRecords(orphanedRecords.orphanedGenres, "genre", "id");
  }

  if (orphanedRecords.orphanedDirectors.length > 0) {
    console.info(
      `Directeurs orphelins trouvés : ${orphanedRecords.orphanedDirectors.join(", ")}`
    );
    await deleteOrphanedRecords(
      orphanedRecords.orphanedDirectors,
      "director",
      "id"
    );
  }

  if (orphanedRecords.orphanedCasting.length > 0) {
    console.info(
      `Casting orphelin trouvé : ${orphanedRecords.orphanedCasting.join(", ")}`
    );
    await deleteOrphanedRecords(
      orphanedRecords.orphanedCasting,
      "casting",
      "id"
    );
  }

  if (orphanedRecords.orphanedScreenwriters.length > 0) {
    console.info(
      `Scénaristes orphelins trouvés : ${orphanedRecords.orphanedScreenwriters.join(", ")}`
    );
    await deleteOrphanedRecords(
      orphanedRecords.orphanedScreenwriters,
      "screenwriter",
      "id"
    );
  }

  if (orphanedRecords.orphanedMusic.length > 0) {
    console.info(
      `Compositeurs orphelins trouvés : ${orphanedRecords.orphanedMusic.join(", ")}`
    );
    await deleteOrphanedRecords(orphanedRecords.orphanedMusic, "music", "id");
  }

  if (orphanedRecords.orphanedStudios.length > 0) {
    console.info(
      `Studios orphelins trouvés : ${orphanedRecords.orphanedStudios.join(", ")}`
    );
    await deleteOrphanedRecords(
      orphanedRecords.orphanedStudios,
      "studio",
      "id"
    );
  }

  if (orphanedRecords.orphanedCountries.length > 0) {
    console.info(
      `Pays orphelins trouvés : ${orphanedRecords.orphanedCountries.join(", ")}`
    );
    await deleteOrphanedRecords(
      orphanedRecords.orphanedCountries,
      "country",
      "id"
    );
  }

  if (orphanedRecords.orphanedLanguages.length > 0) {
    console.info(
      `Langues orphelines trouvées : ${orphanedRecords.orphanedLanguages.join(", ")}`
    );
    await deleteOrphanedRecords(
      orphanedRecords.orphanedLanguages,
      "language",
      "id"
    );
  }

  console.info("Purge des enregistrements orphelins terminée.");
}

// Export des fonctions
module.exports = {
  findOrphanedTags,
  findOrphanedGenres,
  findOrphanedDirectors,
  findOrphanedCasting,
  findOrphanedScreenwriters,
  findOrphanedMusic,
  findOrphanedStudios,
  findOrphanedCountries,
  findOrphanedLanguages,
  findOrphanedRecords,
  deleteOrphanedRecords,
  purgeOrphanedRecords,
};
