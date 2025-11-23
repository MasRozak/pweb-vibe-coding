const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getRecommendations,
} = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

router.route('/').get(getListings).post(protect, upload.array('images', 5), createListing);
router.route('/recommendations/:id').get(getRecommendations);
router
  .route('/:id')
  .get(getListingById)
  .put(protect, upload.array('images', 5), updateListing)
  .delete(protect, deleteListing);

module.exports = router;
