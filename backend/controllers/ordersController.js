const { inventory } = require('./inventoryController');

let orders = [];

const getOrders = (req, res) => {
  res.json(orders);
};

const createOrder = (req, res) => {
  const newOrder = req.body;

  const item = inventory.find(i => i.name.toLowerCase() === newOrder.item.toLowerCase());

  if (!item) {
    return res.status(404).json({ error: 'Item not found in inventory' });
  }

  if (item.stock < newOrder.quantity) {
    return res.status(400).json({ error: 'Not enough stock available' });
  }

  item.stock -= newOrder.quantity;

  newOrder.id = orders.length + 1;
  orders.push(newOrder);

  res.status(201).json(newOrder);
};

module.exports = { getOrders, createOrder };
