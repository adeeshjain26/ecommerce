const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/e-cart', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increase the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/products', productsRouter);
app.use('/cart', cartRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
