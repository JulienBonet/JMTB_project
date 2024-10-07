const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/images"));
  },
  filename: (req, file, cb) => {
    const type = req.multerType || "";
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    const newName = `${type}-${baseName}-${uuidv4()}${extension}`;
    cb(null, newName);
  },
});

const fileFilter = (req, file, cb) => {
  const types = ["image/png", "image/jpeg", "image/jpg"];
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Le type de fichier n'est pas supporté"));
  }
};

const fileUpload = multer({
  storage,
  fileFilter,
});

const setType = (type) => (req, res, next) => {
  req.multerType = type;
  next();
};

module.exports = { fileUpload, setType };
