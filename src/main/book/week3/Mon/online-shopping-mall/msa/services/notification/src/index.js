const express = require('express');
const app = express();
const PORT = process.env.PORT || 3009;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'notification-service' });
});

app.listen(PORT, () => {
  console.log(`notification service running on port ${PORT}`);
});
