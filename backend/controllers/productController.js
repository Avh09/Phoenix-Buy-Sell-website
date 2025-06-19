const Item = require('../models/product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

// Create a new product
// const createProduct = asyncHandler(async (req, res) => {
//     const { title, slug, description, price, category, brand, quantity, images, color, ratings, sellerId } = req.body;

//     // Create a new product instance
//     const product = new Product({
//         title,
//         slug,
//         description,
//         price,
//         category,
//         brand,
//         quantity,
//         images,
//         color,
//         ratings,
//         sellerId,
//     });

//     // Save the product to the database
//     const createdProduct = await product.save();

//     console.log('Product ID:', createdProduct._id);

//     // Respond with the created product
//     res.status(201).json({
//         message: 'Product created successfully',
//         product: createdProduct,
//     });
// });

const createProduct = asyncHandler(async (req, res) => {
  try {
    const productData = {
      ...req.body,
      slug: slugify(req.body.title)
    };
    const newProduct = await Item.create(productData);
    res.json(newProduct);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
// Get a product by ID
const getAproduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Item.findById(id).populate('sellerId', 'name');
    if (findProduct) {
      res.json(findProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(404);
    throw new Error('Product not found');
  }
});


  // fid all products
    const getAllProducts = asyncHandler(async (req, res) => {
        try {
          const products = await Item.find({});
          res.json(products);
        }catch{
          res.status(404);
          throw new Error('Product not found');
        }
    });


    const searchProducts = asyncHandler(async (req, res) => {
        const { query, categories } = req.query;
        let searchCriteria = {};
      
        // If no query and no categories, return all products
        if (!query && (!categories || categories.trim() === '')) {
          const products = await Item.find({}).populate('sellerId', 'name');
          return res.json(products);
        }
      
        // Handle search query
        if (query) {
          searchCriteria.$or = [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
          ];
        }
      
        // Handle category filtering
        if (categories) {
          const categoryArray = categories.split(',').map(cat => cat.trim());
          searchCriteria.category = { $in: categoryArray };
        }
      
        const products = await Item.find(searchCriteria).populate('sellerId', 'name');
        res.json(products);
      });

      const getSellerProducts = asyncHandler(async (req, res) => {
        const { sellerId } = req.params;
        try {
          const products = await Item.find({ sellerId });
          res.json(products);
        } catch (error) {
          res.status(404);
          throw new Error('Products not found');
        }
      });
      

module.exports = { createProduct, getAproduct, getAllProducts, searchProducts, getSellerProducts };