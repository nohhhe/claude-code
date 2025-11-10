const amqp = require('amqplib');

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();

    // Declare exchanges and queues
    await channel.assertExchange('payment.events', 'topic', { durable: true });
    await channel.assertQueue('payment.process', { durable: true });
    await channel.assertQueue('payment.notifications', { durable: true });

    console.log('RabbitMQ connected successfully');

    // Set up message consumers
    await setupConsumers();

    return { connection, channel };
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    throw error;
  }
};

const setupConsumers = async () => {
  if (!channel) return;

  // Listen for payment processing requests
  await channel.consume('payment.process', async (msg) => {
    if (msg) {
      try {
        const data = JSON.parse(msg.content.toString());
        console.log('Received payment processing request:', data);
        
        // Process the payment (mock implementation)
        await processPaymentMessage(data);
        
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing payment message:', error);
        channel.nack(msg, false, false);
      }
    }
  });
};

const processPaymentMessage = async (data) => {
  // This would integrate with the payment processing logic
  console.log(`Processing payment for order ${data.orderId}, amount: ${data.amount}`);
};

const publishEvent = async (exchange, routingKey, data) => {
  if (!channel) {
    throw new Error('RabbitMQ channel not available');
  }
  
  const message = Buffer.from(JSON.stringify(data));
  return channel.publish(exchange, routingKey, message, { persistent: true });
};

const closeConnection = async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
};

module.exports = {
  connectRabbitMQ,
  publishEvent,
  closeConnection,
  getChannel: () => channel
};