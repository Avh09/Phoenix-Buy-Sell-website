const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    quantity: { type: Number, required: true }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);