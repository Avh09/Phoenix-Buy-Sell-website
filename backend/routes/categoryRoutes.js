const express = require('express');
const router = express.Router();

// Example categories, you can replace this with a database call
const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home Appliances',
  'Furniture',
  'Stationery'
];

// GET /api/categories
router.get('/', (req, res) => {
  res.json(categories);
});

module.exports = router;