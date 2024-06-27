const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // Fetch all cart items
  router.get('/', async (req, res) => {
    try {
      const query = `
        SELECT cart.id, cart.quantity, product.id as productId, product.name, product.price
        FROM cart
        INNER JOIN product ON cart.product_id = product.id
      `;
      const { rows } = await pool.query(query);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add a new item to the cart
  router.post('/', async (req, res) => {
    const { productId, quantity } = req.body;
    try {
      const productQuery = 'SELECT * FROM product WHERE id = $1';
      const productResult = await pool.query(productQuery, [productId]);
      
      if (productResult.rows.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      const insertQuery = 'INSERT INTO cart (product_id, quantity) VALUES ($1, $2) RETURNING *';
      const insertValues = [productId, quantity];
      const insertedItem = await pool.query(insertQuery, insertValues);

      res.status(201).json(insertedItem.rows[0]);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update a cart item
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
      const updateQuery = 'UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *';
      const updateValues = [quantity, id];
      const updatedItem = await pool.query(updateQuery, updateValues);

      if (updatedItem.rows.length === 0) {
        return res.status(404).json({ message: 'Cart item not found' });
      }

      res.json(updatedItem.rows[0]);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Remove an item from the cart
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deleteQuery = 'DELETE FROM cart WHERE id = $1';
      await pool.query(deleteQuery, [id]);

      res.json({ message: 'Cart item removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};
