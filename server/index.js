const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    createTables();
  }
});

// Create tables
function createTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      min_quantity INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      total_amount INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      total_amount INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS purchase_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      purchase_id INTEGER,
      product_id INTEGER,
      quantity INTEGER NOT NULL,
      price_per_unit INTEGER NOT NULL,
      FOREIGN KEY (purchase_id) REFERENCES purchases (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )`,
    `CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER,
      product_id INTEGER,
      quantity INTEGER NOT NULL,
      price_per_unit INTEGER NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )`
  ];

  tables.forEach(table => {
    db.run(table, err => {
      if (err) {
        console.error('Error creating table:', err);
      }
    });
  });
  
  // Create default admin user if not exists
  db.get('SELECT * FROM users WHERE username = ?', ['admin'], async (err, user) => {
    if (err) {
      console.error('Error checking for admin user:', err);
      return;
    }
    
    if (!user) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        db.run(
          'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
          ['admin', hashedPassword, 'admin'],
          function(err) {
            if (err) {
              console.error('Error creating admin user:', err);
            } else {
              console.log('Default admin user created successfully');
            }
          }
        );
      } catch (error) {
        console.error('Error hashing admin password:', error);
      }
    }
  });
}

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Inventory Management System API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 