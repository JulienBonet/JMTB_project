// -----------------/ MOVIE ENTRANCE SEARCH & INSERT FUNC in addNewMovie.jsx/----------------- //
import axios from "axios";

// GENRES SEARCH BY NAME METHOD
const searchGenreInDatabase = async (genreName) => {
  console.info(
    "get in searchGenreInDatabase: ",
    `${import.meta.env.VITE_BACKEND_URL}/api/kind/${encodeURIComponent(
      genreName
    )}`
  );
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/kind/${encodeURIComponent(
        genreName
      )}`
    );

    if (response.status === 200 && response.data) {
      console.info("genre cherché:", response.data);
      return response.data;
    }
    return null;
  } catch (error) {
    throw new Error(`Error searching for genre in database: ${error.message}`);
  }
};

// GENRES NEW INSERT METHOD
const createGenreInDatabase = async (genreName) => {
  console.info(
    "post in createGenreInDatabase: ",
    `${import.meta.env.VITE_BACKEND_URL}/api/kind`
  );
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/kind`,
      { name: genreName }
    );

    console.info("genre crée:", response.data);

    if (response.status === 201 && response.data) {
      return response.data;
    }
    throw new Error("Failed to create genre in database");
  } catch (error) {
    throw new Error(`Error creating genre in database: ${error.message}`);
  }
};

// STUDIO SEARCH BY NAME METHOD
const searchStudioInDatabase = async (studioName) => {
  try {
    // Remplacer les slashes par des tirets
    const regexStudioName = studioName.replace(/\//g, "-");
    const url = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/studio/byname/${encodeURIComponent(regexStudioName)}`;
    const response = await axios.get(url);

    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    throw new Error(`Error searching for studio in database: ${error.message}`);
  }
};

// STUDIO NEW INSERT METHOD
const createStudioInDatabase = async (studioName) => {
  try {
    // Remplacer les slashes par des tirets
    const regexStudioName = studioName.replace(/\//g, "-");

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/studio`,
      { name: regexStudioName }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating studio:", error);
    throw error;
  }
};

// COUNTRY SEARCH BY NAME METHOD
const searchCountryInDatabase = async (countryName) => {
  try {
    const url = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/country/byname/${encodeURIComponent(countryName)}`;
    const response = await axios.get(url);
    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    throw new Error(
      `Error searching for country in database: ${error.message}`
    );
  }
};

// COUNTRY NEW INSERT METHOD
const createCountryInDatabase = async (countryName) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/country`,
      { name: countryName }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating country:", error);
    throw error;
  }
};

// LANGUAGE SEARCH BY NAME METHOD
const searchLanguageInDatabase = async (languageName) => {
  try {
    const url = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/language/byname/${encodeURIComponent(languageName)}`;
    const response = await axios.get(url);

    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    throw new Error(
      `Error searching for language in database: ${error.message}`
    );
  }
};

// LANGUAGE NEW INSERT METHOD
const createLanguageInDatabase = async (languageName) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/language`,
      { name: languageName }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating language:", error);
    throw error;
  }
};

// DIRECTOR SEARCH BY NAME METHOD
const searchDirectorInDatabase = async (directorsNames) => {
  try {
    const url = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/director/byname/${encodeURIComponent(directorsNames)}`;

    const response = await axios.get(url);

    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    throw new Error(
      `Error searching for director in database: ${error.message}`
    );
  }
};

// DIRECTORS NEW INSERT METHOD
const createDirectorInDatabase = async (directorName) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/director`,
      { name: directorName }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating director:", error);
    throw error;
  }
};

// SCREENWRITER SEARCH BY NAME METHOD
const searchScreenwriterInDatabase = async (screenwritersNames) => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/screenwriter/byname/${encodeURIComponent(screenwritersNames)}`
    );

    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    throw new Error(
      `Error searching for screenwriter in database: ${error.message}`
    );
  }
};

// SCREENWRITER NEW INSERT METHOD
const createScreenwriterInDatabase = async (screenwriterName) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/screenwriter`,
      { name: screenwriterName }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating screenwriter:", error);
    throw error;
  }
};

// COMPOSITOR SEARCH BY NAME METHOD
const searchCompositorInDatabase = async (compositorsNames) => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/music/byname/${encodeURIComponent(compositorsNames)}`
    );

    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    throw new Error(
      `Error searching for compositor in database: ${error.message}`
    );
  }
};

// COMPOSITOR NEW INSERT METHOD
const createCompositorInDatabase = async (compositorName) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/compositor`,
      { name: compositorName }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating compositor:", error);
    throw error;
  }
};

// CASTING SEARCH BY NAME METHOD
const searchCastingInDatabase = async (castingsNames) => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/casting/byname/${encodeURIComponent(castingsNames)}`
    );

    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    throw new Error(
      `Error searching for compositor in database: ${error.message}`
    );
  }
};

// CASTINGG NEW INSERT METHOD
const createCastingInDatabase = async (castingName) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/casting`,
      { name: castingName }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating casting:", error);
    throw error;
  }
};

// TAG SEARCH BY NAME METHOD
const searchTagInDatabase = async (tagsNames) => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/tag/byname/${encodeURIComponent(tagsNames)}`
    );

    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    throw new Error(`Error searching for tag in database: ${error.message}`);
  }
};

// TAG NEW INSERT METHOD
const createTagInDatabase = async (TagName) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/tag`,
      { name: TagName }
    );
    return response.data;
  } catch (error) {
    console.error("Error tag casting:", error);
    throw error;
  }
};

export {
  searchGenreInDatabase,
  createGenreInDatabase,
  createStudioInDatabase,
  searchStudioInDatabase,
  searchCountryInDatabase,
  createCountryInDatabase,
  searchLanguageInDatabase,
  createLanguageInDatabase,
  searchDirectorInDatabase,
  createDirectorInDatabase,
  searchScreenwriterInDatabase,
  createScreenwriterInDatabase,
  searchCompositorInDatabase,
  createCompositorInDatabase,
  searchCastingInDatabase,
  createCastingInDatabase,
  searchTagInDatabase,
  createTagInDatabase,
};
