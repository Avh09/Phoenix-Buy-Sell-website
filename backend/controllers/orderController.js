const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const Order = require('../models/order');
const Cart = require('../models/cart');
const Item = require('../models/product');

const createdOrders = new Map(); // In-memory storage for plain OTPs

const createOrder = asyncHandler(async (req, res) => {
  const { cartItems, totalAmount } = req.body;
  const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(plainOtp, 10);

  const order = await Order.create({
    userId: req.user._id,
    items: cartItems,
    totalAmount,
    otp: {
      value: hashedOtp,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    status: 'pending',
  });

  // Store the plain OTP temporarily in memory
  createdOrders.set(order._id, plainOtp);

  res.json({ orderId: order._id, plainOtp }); // Return the plain OTP in the response
});

const verifyOrder = asyncHandler(async (req, res) => {
  const { orderId, otp } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOtpValid = await bcrypt.compare(otp, order.otp.value);
  if (!isOtpValid) {
    res.status(400);
    throw new Error('Invalid OTP');
  }

  order.status = 'verified';
  await order.save();

  res.json({ success: true });
});

// orderController.js
const getOrderHistory = asyncHandler(async (req, res) => {
  const { type } = req.query;
  let orders;

  if (type === 'bought') {
    orders = await Order.find({
      userId: req.user._id,
      status: 'verified'
    })
    .populate('items.productId')
    .populate('userId', 'firstName lastName email')  // Updated fields
    .populate({
      path: 'items.productId',
      populate: {
        path: 'sellerId',
        select: 'firstName lastName email'  // Updated fields
      }
    });
  } else if (type === 'sold') {
    const sellerProducts = await Item.find({ sellerId: req.user._id }).select('_id');
    const sellerProductIds = sellerProducts.map(p => p._id);

    orders = await Order.find({
      'items.productId': { $in: sellerProductIds },
      status: 'verified'
    })
    .populate('userId', 'firstName lastName email')  // Updated fields
    .populate({
      path: 'items.productId',
      populate: {
        path: 'sellerId',
        select: 'firstName lastName email'  // Updated fields
      }
    });

    orders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.filter(item => 
        sellerProductIds.some(id => id.equals(item.productId._id))
      )
    }));
  }

  res.json(orders || []);
});

const getPendingOrders = asyncHandler(async (req, res) => {
  const pendingOrders = await Order.find({
    userId: req.user._id,
    status: 'pending'
  })
  .populate('userId', 'firstName lastName email')  // Updated fields
  .populate({
    path: 'items.productId',
    populate: {
      path: 'sellerId',
      select: 'firstName lastName email'  // Updated fields
    }
  })
  .lean();

  const ordersWithOtpFlag = pendingOrders.map(order => ({
    ...order,
    otpAvailable: createdOrders.has(order._id)
  }));

  res.json(ordersWithOtpFlag);
});

const getOrderOtp = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const plainOtp = createdOrders.get(orderId);

  if (!plainOtp) {
    return res.status(404).json({ message: 'OTP not available' });
  }

  // Remove the OTP from in-memory storage after retrieval
  createdOrders.delete(orderId);

  res.json({ otp: plainOtp });
});

const getDeliverOrders = async (req, res) => {
  try {
    const sellerId = req.user._id; // Extract seller's ID from authenticated user
    // Find products that belong to this seller
    const sellerProducts = await Item.find({ sellerId }).select('_id');
    const sellerProductIds = sellerProducts.map(p => p._id);

    // Find orders that include products from this seller
    const orders = await Order.find({
      'items.productId': { $in: sellerProductIds },
      status: 'pending'
    })
    .populate('userId', 'firstName lastName email') // Add buyer information
    .populate('items.productId', 'title price'); // Populate product details

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders for seller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllOrders = asyncHandler(async (req, res) => {
  // Retrieve all orders from the database and populate user and product details
  console.log('Fetching all orders...');
  const orders = await Order.find({})
    .populate('userId', 'firstName lastName email')
    .populate({
      path: 'items.productId',
      populate: {
        path: 'sellerId',
        select: 'firstName lastName email'
      }
    });

  res.json(orders);
});

module.exports = {
  createOrder,
  verifyOrder,
  getOrderHistory,
  getPendingOrders,
  getDeliverOrders,
  getOrderOtp,
  getAllOrders,
};