const multer = require('multer')

// Define file size limit (5 MB for example)
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Define allowed file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

// Memory storage configuration
const storage = multer.memoryStorage()

// Custom file filter to ensure only allowed file types are uploaded
const fileFilter = (req, file, cb) => {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(
      new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.'),
      false
    )
  }
  cb(null, true)
}

// Multer configuration with storage, file size limit, and file filter
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE }, // Set file size limit
  fileFilter // Use the custom file filter
})

module.exports = upload
