import multer from "multer";

// ✅ Memory storage — no disk, file goes straight to ImageKit
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;