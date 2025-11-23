const mongoose = require('mongoose');

const listingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  imageFileNames: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
  },
  availableRooms: {
    type: Number,
    required: true,
    default: 1,
    min: 0,
  },
  totalRooms: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  facilities: {
    type: [String],
    default: [],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

function arrayLimit(val) {
  return val.length <= 5;
}

module.exports = mongoose.model('Listing', listingSchema);
