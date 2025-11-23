const Listing = require('../models/Listing');
const fs = require('fs');
const path = require('path');

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('owner', 'username');
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'username email');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
  try {
    const { title, description, price, location, availableRooms, totalRooms, facilities } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one image' });
    }

    const imageFileNames = req.files.map(file => file.filename);
    const facilitiesArray = facilities ? JSON.parse(facilities) : [];

    const listing = await Listing.create({
      title,
      description,
      price,
      location,
      imageFileNames,
      availableRooms: availableRooms || totalRooms || 1,
      totalRooms: totalRooms || 1,
      facilities: facilitiesArray,
      owner: req.user.id,
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the listing owner
    if (listing.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedData = { ...req.body };
    
    // Handle facilities if provided
    if (req.body.facilities) {
      updatedData.facilities = JSON.parse(req.body.facilities);
    }
    
    // Handle optional new images upload
    if (req.files && req.files.length > 0) {
      const newImageFileNames = req.files.map(file => file.filename);
      updatedData.imageFileNames = newImageFileNames;
      
      // Optional: Delete old images
      listing.imageFileNames.forEach(filename => {
        const oldImagePath = path.join(__dirname, '../uploads', filename);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Failed to delete old image:', err);
          });
        }
      });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the listing owner
    if (listing.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Delete all image files
    listing.imageFileNames.forEach(filename => {
      const imagePath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Failed to delete image:', err);
        });
      }
    });

    await listing.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get recommended listings
// @route   GET /api/listings/recommendations/:id
// @access  Public
const getRecommendations = async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.id);
    
    if (!currentListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Find similar listings based on location and price range
    const priceRange = currentListing.price * 0.3; // 30% price range
    
    const recommendations = await Listing.find({
      _id: { $ne: currentListing._id },
      $or: [
        { location: currentListing.location },
        {
          price: {
            $gte: currentListing.price - priceRange,
            $lte: currentListing.price + priceRange,
          },
        },
      ],
      availableRooms: { $gt: 0 },
    })
      .populate('owner', 'username')
      .limit(4)
      .sort({ createdAt: -1 });

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getRecommendations,
};
