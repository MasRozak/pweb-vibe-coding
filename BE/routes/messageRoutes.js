const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getAllConversations,
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, sendMessage).get(protect, getAllConversations);
router.route('/:listingId/:userId').get(protect, getConversation);
router.route('/:id').delete(protect, deleteMessage);

module.exports = router;
