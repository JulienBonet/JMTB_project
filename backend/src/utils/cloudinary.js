/* eslint-disable consistent-return */
const cloudinary = require("cloudinary").v2;
const { randomUUID } = require("crypto");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBufferToCloudinary = (buffer, folder, prefix = "file") => {
  return new Promise((resolve, reject) => {
    const publicId = `${prefix}-${randomUUID()}`; // préfixe dynamique

    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, overwrite: true },
      (error, result) => {
        if (error) {
          console.error("❌ ERREUR Cloudinary :", error);
          return reject(error);
        }

        resolve({
          publicId: result.public_id,
          url: result.secure_url,
        });
      }
    );

    stream.end(buffer);
  });
};

module.exports = {
  cloudinary,
  uploadBufferToCloudinary,
};
