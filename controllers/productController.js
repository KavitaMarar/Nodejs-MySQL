const pool = require('../models/db');

// Get all products with pagination
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;
    
    const [rows] = await pool.query(`
      SELECT p.id AS ProductId, p.name AS ProductName, 
             c.name AS CategoryName, c.id AS CategoryId 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      LIMIT ? OFFSET ?`, 
      [parseInt(pageSize), parseInt(offset)]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, category_id } = req.body;
    await pool.query('INSERT INTO products (name, category_id) VALUES (?, ?)', [name, category_id]);
    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, category_id } = req.body;
    const result = await pool.query('UPDATE products SET name = ?, category_id = ? WHERE id = ?', [name, category_id, req.params.id]);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
