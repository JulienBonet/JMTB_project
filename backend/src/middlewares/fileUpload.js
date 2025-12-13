const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const types = ["image/png", "image/jpeg", "image/jpg"];
  if (types.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Type de fichier non supporté"));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
