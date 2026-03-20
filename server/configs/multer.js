import multer from 'multer';

// Use memoryStorage for serverless compatibility (Vercel, etc.).
// Do not perform any synchronous fs operations here.
const storage = multer.memoryStorage();

// Add strict validation: Allow only image files!
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

// Export simple multer instance; files will be available as Buffer on
// req.file.buffer (single) or req.files[...].buffer (array/fields).
export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file
  fileFilter
});
