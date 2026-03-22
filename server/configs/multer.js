import multer from 'multer';

// Use memoryStorage for serverless compatibility (Vercel, etc.).
// Do not perform any synchronous fs operations here.
const storage = multer.memoryStorage();

// Add strict validation: Allow specified image files and web-ready videos!
const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];

const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File format ${file.mimetype} is not allowed!`), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Max 20MB per file (handles video sizes). 
  fileFilter
});
