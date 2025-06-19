// cartController.js
const Cart = require('../models/cart');
const asyncHandler = require('express-async-handler');

const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id })
    .populate('items.productId');
  
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [] });
  }
  
  res.json(cart);
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  
  let cart = await Cart.findOne({ userId: req.user._id });
  
  if (!cart) {
    cart = await Cart.create({
      userId: req.user._id,
      items: [{ productId, quantity }]
    });
  } else {
    // Check if product exists in cart
    const itemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    
    await cart.save();
  }
  
  cart = await cart.populate('items.productId');
  res.json(cart);
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  
  cart.items = cart.items.filter(
    item => item.productId.toString() !== req.params.productId
  );
  
  await cart.save();
  
  const updatedCart = await cart.populate('items.productId');
  res.json(updatedCart);
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  
  cart.items = [];
  await cart.save();
  
  res.json(cart);
});

module.exports = { getCart, addToCart, removeFromCart, clearCart };