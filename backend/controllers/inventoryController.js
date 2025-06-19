let inventory = [
  { id: 1, name: "Soda", stock: 30 },
  { id: 2, name: "Coffee", stock: 25 },
  { id: 3, name: "Beer", stock: 50 },
  { id: 4, name: "Wings", stock: 20 },
  { id: 5, name: "Nachos", stock: 20 },
  { id: 6, name: "Salad", stock: 18 },
  { id: 7, name: "Steak", stock: 15 },
  { id: 8, name: "Grilled Chicken", stock: 20 },
  { id: 9, name: "Plantains", stock: 25 },
  { id: 10, name: "Tilapia Fish", stock: 15 }
];

const getInventory = (req, res) => {
  res.json(inventory);
};

const addInventoryItem = (req, res) => {
  const newItem = req.body;
  newItem.id = inventory.length + 1;
  inventory.push(newItem);
  res.status(201).json(newItem);
};

const updateInventoryItem = (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  const item = inventory.find(i => i.id === parseInt(id));

  if (!item) return res.status(404).json({ error: "Item not found" });

  item.stock = stock;
  res.json(item);
};

const deleteInventoryItem = (req, res) => {
  const { id } = req.params;
  const index = inventory.findIndex(i => i.id === parseInt(id));

  if (index === -1) return res.status(404).json({ error: "Item not found" });

  const removed = inventory.splice(index, 1);
  res.json(removed[0]);
};

module.exports = {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  inventory
};
