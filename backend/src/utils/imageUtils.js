const sharp = require("sharp");

/**
 * Redimensionne un buffer d'image selon une taille max
 * @param {Buffer} buffer - image originale
 * @param {number} width - largeur max
 * @param {number} height - hauteur max
 * @returns {Promise<Buffer>} buffer redimensionné
 */
const resizeBuffer = async (buffer, width = 600, height = 600) => {
  return sharp(buffer).resize(width, height, { fit: "inside" }).toBuffer();
};

const resizeAndCropBuffer = async (buffer, width, height) => {
  return sharp(buffer)
    .resize(width, height, {
      fit: "cover",
      position: "centre",
    })
    .toBuffer();
};

module.exports = { resizeBuffer, resizeAndCropBuffer };
