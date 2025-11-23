const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Listing',
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Message', messageSchema);
