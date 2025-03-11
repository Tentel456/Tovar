const express = require('express');
const router = express.Router();
const db = require('../database');

// Debugging
router.use((req, res, next) => {
  console.log(`[Products Route] ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

// Get all products
router.get('/', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      console.error('Error getting products:', err);
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single product
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error('Error getting product:', err);
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Create new product
router.post('/', (req, res) => {
  const { name, price, quantity, min_quantity } = req.body;
  console.log('Creating product:', { name, price, quantity, min_quantity });
  
  db.run(
    'INSERT INTO products (name, price, quantity, min_quantity) VALUES (?, ?, ?, ?)',
    [name, price, quantity, min_quantity],
    function(err) {
      if (err) {
        console.error('Error creating product:', err);
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        name,
        price,
        quantity,
        min_quantity
      });
    }
  );
});

// Update product
router.put('/:id', (req, res) => {
  const { name, price, quantity, min_quantity } = req.body;
  console.log('Updating product:', { id: req.params.id, name, price, quantity, min_quantity });
  
  db.run(
    'UPDATE products SET name = ?, price = ?, quantity = ?, min_quantity = ? WHERE id = ?',
    [name, price, quantity, min_quantity, req.params.id],
    function(err) {
      if (err) {
        console.error('Error updating product:', err);
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        id: req.params.id,
        name,
        price,
        quantity,
        min_quantity
      });
    }
  );
});

// Delete product
router.delete('/:id', (req, res) => {
  console.log('Deleting product:', req.params.id);
  
  db.run('DELETE FROM products WHERE id = ?', req.params.id, function(err) {
    if (err) {
      console.error('Error deleting product:', err);
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product deleted', changes: this.changes });
  });
});

module.exports = router; 