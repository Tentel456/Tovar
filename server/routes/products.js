const express = require('express');
const router = express.Router();
const db = require('../database');
const { auth, adminAuth } = require('../middleware/auth');

// Debugging
router.use((req, res, next) => {
  console.log(`[Products Route] ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

// Get all products (require authentication)
router.get('/', auth, (req, res) => {
  db.all('SELECT * FROM products', (err, products) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    
    res.json({ products });
  });
});

// Get a single product (require authentication)
router.get('/:id', auth, (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ product });
  });
});

// Create a new product (require admin privileges)
router.post('/', adminAuth, (req, res) => {
  const { name, price, quantity, min_quantity } = req.body;
  
  if (!name || !price || quantity === undefined || min_quantity === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  db.run(
    'INSERT INTO products (name, price, quantity, min_quantity) VALUES (?, ?, ?, ?)',
    [name, price, quantity, min_quantity],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
      
      res.status(201).json({
        message: 'Product created successfully',
        product: {
          id: this.lastID,
          name,
          price,
          quantity,
          min_quantity
        }
      });
    }
  );
});

// Update a product (require admin privileges)
router.put('/:id', adminAuth, (req, res) => {
  const { name, price, quantity, min_quantity } = req.body;
  
  if (!name || !price || quantity === undefined || min_quantity === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  db.run(
    'UPDATE products SET name = ?, price = ?, quantity = ?, min_quantity = ? WHERE id = ?',
    [name, price, quantity, min_quantity, req.params.id],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({
        message: 'Product updated successfully',
        product: {
          id: req.params.id,
          name,
          price,
          quantity,
          min_quantity
        }
      });
    }
  );
});

// Delete a product (require admin privileges)
router.delete('/:id', adminAuth, (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  });
});

module.exports = router; 