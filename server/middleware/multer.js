import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Use /tmp on Vercel, local uploads/ folder otherwise
const uploadFolder = process.env.VERCEL ? "/tmp" : "uploads/";

// ✅ Only create folder locally (Vercel /tmp already exists)
if (!process.env.VERCEL && !fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
export default upload;