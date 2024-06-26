const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  colours: [String],
  availableSizes: [String],
  productDetails: [String],
  images: [String],
  description: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
