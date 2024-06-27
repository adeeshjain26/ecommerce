const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const result = await req.pool.query('SELECT * FROM products');
    console.log('Products retrieved:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error retrieving products:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await req.pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cannot find product' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error finding product:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new product with image upload
router.post('/', upload.array('images', 5), async (req, res) => {
  const { name, brand, price, category, colours, availableSizes, productDetails, description } = req.body;
  const images = req.files.map((file) => ({
    filename: file.filename,
    path: file.path,
    mimetype: file.mimetype,
  }));

  try {
    const result = await req.pool.query(
      'INSERT INTO products (name, brand, price, category, colours, availableSizes, productDetails, images, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, brand, price, category, colours, availableSizes, productDetails, JSON.stringify(images), description]
    );
    console.log('New product created:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  const { name, brand, price, category, colours, availableSizes, productDetails, images, description } = req.body;

  try {
    const result = await req.pool.query(
      'UPDATE products SET name = $1, brand = $2, price = $3, category = $4, colours = $5, availableSizes = $6, productDetails = $7, images = $8, description = $9 WHERE id = $10 RETURNING *',
      [name, brand, price, category, colours, availableSizes, productDetails, images, description, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cannot find product' });
    }
    console.log('Product updated:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const result = await req.pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cannot find product' });
    }
    console.log('Product deleted:', result.rows[0]);
    res.json({ message: 'Deleted Product' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
