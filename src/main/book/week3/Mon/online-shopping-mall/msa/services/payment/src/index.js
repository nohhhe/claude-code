const express = require('express');
const { initDatabase } = require('./config/database');
const { connectRabbitMQ } = require('./config/rabbitmq');
const apiRoutes = require('./api');
const { errorHandler } = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'payment-service',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', apiRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize service
const initializeService = async () => {
  try {
    console.log('Initializing payment service...');
    
    // Initialize database
    await initDatabase();
    
    // Connect to RabbitMQ
    await connectRabbitMQ();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Payment service running on port ${PORT}`);
      console.log(`Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to initialize payment service:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down payment service...');
  const { closeConnection } = require('./config/rabbitmq');
  await closeConnection();
  process.exit(0);
});

initializeService();
