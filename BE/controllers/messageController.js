const Message = require('../models/Message');
const Listing = require('../models/Listing');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiver, listing, message } = req.body;

    if (!receiver || !listing || !message) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if listing exists
    const listingExists = await Listing.findById(listing);
    if (!listingExists) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Prevent sending message to yourself
    if (receiver === req.user.id) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    // Prevent sending message if you are the owner
    if (listingExists.owner.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot send message to your own listing' });
    }

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver,
      listing,
      message,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'username email')
      .populate('receiver', 'username email')
      .populate('listing', 'title');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get conversation between two users for a specific listing
// @route   GET /api/messages/:listingId/:userId
// @access  Private
const getConversation = async (req, res) => {
  try {
    const { listingId, userId } = req.params;

    const messages = await Message.find({
      listing: listingId,
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    })
      .populate('sender', 'username email')
      .populate('receiver', 'username email')
      .populate('listing', 'title')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        listing: listingId,
        sender: userId,
        receiver: req.user.id,
        read: false,
      },
      { read: true }
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations for the logged-in user
// @route   GET /api/messages
// @access  Private
const getAllConversations = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            listing: '$listing',
            user: {
              $cond: [
                { $eq: ['$sender', userId] },
                '$receiver',
                '$sender',
              ],
            },
          },
          lastMessage: { $first: '$message' },
          lastMessageDate: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', userId] },
                    { $eq: ['$read', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { lastMessageDate: -1 },
      },
    ]);

    // Populate user and listing details
    const populatedConversations = await Message.populate(messages, [
      { path: '_id.user', select: 'username email' },
      { path: '_id.listing', select: 'title imageFileNames' },
    ]);

    res.status(200).json(populatedConversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender can delete the message
    if (message.sender.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await message.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getAllConversations,
  deleteMessage,
};
