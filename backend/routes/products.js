const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // Limit file size to 50MB
});


// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





// Get a product by ID
router.get('/:id', getProduct, (req, res) => {
  res.json(res.product);
});

// Create a new product with image upload
router.post('/', upload.array('images', 5), async (req, res) => {
  const product = new Product({
    name: req.body.name,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    colours: req.body.colours,
    availableSizes: req.body.availableSizes,
    productDetails: req.body.productDetails,
    images: req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
    })),
    description: req.body.description,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a product
router.put('/:id', getProduct, async (req, res) => {
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }
  if (req.body.brand != null) {
    res.product.brand = req.body.brand;
  }
  if (req.body.price != null) {
    res.product.price = req.body.price;
  }
  if (req.body.category != null) {
    res.product.category = req.body.category;
  }
  if (req.body.colours != null) {
    res.product.colours = req.body.colours;
  }
  if (req.body.availableSizes != null) {
    res.product.availableSizes = req.body.availableSizes;
  }
  if (req.body.productDetails != null) {
    res.product.productDetails = req.body.productDetails;
  }
  if (req.body.images != null) {
    // Assuming you handle image updates similarly
    res.product.images = req.body.images;
  }
  if (req.body.description != null) {
    res.product.description = req.body.description;
  }

  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete('/:id', getProduct, async (req, res) => {
  try {
    await res.product.remove();
    res.json({ message: 'Deleted Product' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: 'Cannot find product' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.product = product;
  next();
}

module.exports = router;
