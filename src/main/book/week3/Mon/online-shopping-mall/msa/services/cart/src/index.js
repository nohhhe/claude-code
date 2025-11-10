const express = require('express');
const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'cart-service' });
});

app.listen(PORT, () => {
  console.log(`cart service running on port ${PORT}`);
});
