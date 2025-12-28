import crypto from "crypto";
import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDir = process.env.UPLOAD_DIR || "./uploads";
const resolvedUploadDir = path.resolve(process.cwd(), uploadDir);

fs.mkdirSync(resolvedUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resolvedUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${crypto.randomUUID()}${ext}`;
    cb(null, filename);
  }
});

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP files are allowed."));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxFileSize }
});
