const express = require('express');
const dotenv = require('dotenv').config();
const dbConnect = require('./config/dbConnect');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const chatRoutes = require('./routes/chatRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const { protect } = require('./middleware/authMiddleware');



const app = express();

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to your frontend URL
  credentials: true,
}));

dbConnect();

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/orders', protect, orderRoutes);
app.use('/api/cart', protect, cartRoutes);
app.use('/api/categories', categoryRoutes); 
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', chatRoutes);
app.use('/api/reviews', reviewRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});