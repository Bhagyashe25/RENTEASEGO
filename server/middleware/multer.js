import multer from "multer";
import path from "path";
import fs from "fs";

// Make sure the uploads folder exists
const uploadFolder = "uploads/";
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder); // save files in "uploads/"
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // keep file extension
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

// Export multer instance
const upload = multer({ storage });
export default upload;