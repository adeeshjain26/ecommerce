const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');

const app = express();

// PostgreSQL connection setup
const pool = new Pool({
  user: 'ecart_user',
  host: 'localhost',
  database: 'e_cart',
  password: 'yourpassword',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL');
});

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.use('/products', productsRouter);
app.use('/cart', cartRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
