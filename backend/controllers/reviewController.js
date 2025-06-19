const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/order');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  try {
    const { orderId, sellerId, review } = req.body;
    
    // Check if order exists and belongs to the user
    const order = await Order.findOne({ 
      _id: orderId,
      userId: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    // Find seller and add review
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const newReview = {
      reviewerId: req.user._id,
      rating: review.rating,
      comment: review.comment,
      date: new Date(),
    };

    seller.sellerReviews.push(newReview);
    await seller.save();

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get reviews for a seller
// @route   GET /api/reviews/:sellerId
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  try {
    const seller = await User.findById(req.params.sellerId).populate('sellerReviews.reviewerId', 'firstName lastName email');
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json(seller.sellerReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { createReview, getReviews };