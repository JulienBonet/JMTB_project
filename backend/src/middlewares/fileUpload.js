const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/images"));
  },
  filename: (req, file, cb) => {
    const type = req.multerType || ""; // Obtenir le type à partir de req.multerType
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    const newName = `${Date.now()}-${type}-${baseName}${extension}`;
    cb(null, newName);
  },
});

const fileFilter = (req, file, cb) => {
  const types = ["image/png", "image/jpeg", "image/jpg"];
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("file type is not appropriate"));
  }
};

const fileUpload = multer({
  storage,
  fileFilter,
});

// Middleware personnalisé pour définir le type
const setType = (type) => (req, res, next) => {
  req.multerType = type;
  next();
};

module.exports = { fileUpload, setType };
