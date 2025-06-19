const express = require('express');
const router = express.Router();
const { createProduct } = require('../controllers/productController');
const { getAproduct } = require('../controllers/productController');
const { getAllProducts } = require('../controllers/productController');
const { searchProducts } = require('../controllers/productController');
const { getSellerProducts } = require('../controllers/productController');

// const { 
//     createItem, 
//     getAllItems, 
//     getItemById,
//     searchItems,
//     getItemsByCategory,
//     deleteItem,
//     updateItem
// } = require('../controllers/itemController');
// const { protect } = require('../middleware/authMiddleware');

router.post('/', createProduct);
router.get('/:id', getAproduct);
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/seller/:sellerId', getSellerProducts);
// router.get('/', getAllItems);    
// router.get('/search', searchItems);
// router.get('/category', getItemsByCategory);
// router.get('/:id', getItemById);
// router.delete('/:id', protect, deleteItem);
// router.put('/:id', protect, updateItem);

module.exports = router;