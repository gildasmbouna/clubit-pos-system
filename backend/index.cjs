const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/orders', require('./routes/orders'));
app.use('/inventory', require('./routes/inventory'));

app.get('/', (req, res) => {
  res.send('✅ Club IT POS Backend is running');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
