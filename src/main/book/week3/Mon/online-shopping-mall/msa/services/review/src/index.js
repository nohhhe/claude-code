const express = require('express');
const app = express();
const PORT = process.env.PORT || 3008;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'review-service' });
});

app.listen(PORT, () => {
  console.log(`review service running on port ${PORT}`);
});
