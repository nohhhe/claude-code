const express = require('express');
const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'shipping-service' });
});

app.listen(PORT, () => {
  console.log(`shipping service running on port ${PORT}`);
});
