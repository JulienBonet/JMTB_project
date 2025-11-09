const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

async function resizeImage(type, filename) {
  try {
    const imagePath = path.join(__dirname, "../../public/images", filename);

    if (!fs.existsSync(imagePath)) {
      console.warn(`⚠️ Le fichier ${filename} n'existe pas à ${imagePath}`);
      return;
    }

    // Dimensions selon le type
    let width;
    let height;
    switch (type) {
      case "cover":
        width = 306;
        height = 459;
        break;
      case "director":
      case "casting":
      case "screenwriter":
      case "compositor":
      case "studio":
      case "thema":
        width = 500;
        height = 500;
        break;
      case "country":
        width = 500;
        height = 281;
        break;
      default:
        console.warn(
          `⚠️ Type d'image inconnu (${type}), aucun redimensionnement`
        );
        return;
    }

    // ✅ Crée un fichier temporaire
    const tempPath = path.join(
      __dirname,
      "../../public/images",
      `temp-${filename}`
    );

    await sharp(imagePath)
      .resize(width, height, { fit: "cover", position: "center" })
      .toFile(tempPath);

    // ✅ Remplace le fichier original
    fs.renameSync(tempPath, imagePath);

    console.info(
      `✅ Image ${filename} redimensionnée (${width}x${height}) pour type "${type}"`
    );
  } catch (error) {
    console.error(
      `❌ Erreur lors du redimensionnement de ${filename} (${type}) :`,
      error
    );
  }
}

module.exports = { resizeImage };
