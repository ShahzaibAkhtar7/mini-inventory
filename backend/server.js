import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Product from './models/Product.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    
    try {
      const count = await Product.countDocuments();
      if (count === 0) {
        await Product.insertMany([
          { name: 'Wireless Mouse', price: 25.99, stock: 5 },
          { name: 'Mechanical Keyboard', price: 79.99, stock: 3 },
          { name: 'USB-C Hub', price: 15.50, stock: 10 }
        ]);
        console.log('Sample products seeded successfully!');
      }
    } catch (seedErr) {
      console.error('Error seeding products:', seedErr);
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));



app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching products', error: error.message });
  }
});



app.post('/api/products', async (req, res) => {
  try {
   
    const apiKey = req.headers['x-admin-key'];
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ message: 'Access denied. Invalid or missing admin API key.' });
    }

    const { name, price, stock } = req.body;

  
    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Please provide name, price, and stock.' });
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json({ message: 'Price and stock cannot be negative.' });
    }

    const newProduct = new Product({
      name,
      price,
      stock
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    res.status(500).json({ message: 'Server error while creating product', error: error.message });
  }
});



app.post('/api/purchase/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, stock: { $gt: 0 } },
      { $inc: { stock: -1 } },
      { returnDocument: 'after'}
    );

    if (!updatedProduct) {
      return res.status(400).json({ message: 'Purchase failed. Out of stock or invalid product ID.' });
    }

    res.status(200).json({
      message: 'Purchase successful!',
      product: updatedProduct
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error during purchase', error: error.message });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});