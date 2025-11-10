const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Payment {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.orderId = data.orderId;
    this.userId = data.userId;
    this.amount = data.amount;
    this.currency = data.currency || 'USD';
    this.paymentMethod = data.paymentMethod;
    this.paymentIntentId = data.paymentIntentId;
    this.status = data.status || 'pending';
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  async save() {
    const query = `
      INSERT INTO payments (id, order_id, user_id, amount, currency, payment_method, payment_intent_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      this.id,
      this.orderId,
      this.userId,
      this.amount,
      this.currency,
      this.paymentMethod,
      this.paymentIntentId,
      this.status
    ];
    
    try {
      const result = await pool.query(query, values);
      return new Payment(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to save payment: ${error.message}`);
    }
  }

  async update() {
    const query = `
      UPDATE payments 
      SET status = $2, payment_intent_id = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const values = [this.id, this.status, this.paymentIntentId];
    
    try {
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        throw new Error('Payment not found');
      }
      return new Payment(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to update payment: ${error.message}`);
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM payments WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return new Payment(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to find payment: ${error.message}`);
    }
  }

  static async findByOrderId(orderId) {
    const query = 'SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC';
    
    try {
      const result = await pool.query(query, [orderId]);
      return result.rows.map(row => new Payment(row));
    } catch (error) {
      throw new Error(`Failed to find payments by order ID: ${error.message}`);
    }
  }

  static async findByUserId(userId, limit = 10, offset = 0) {
    const query = `
      SELECT * FROM payments 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    
    try {
      const result = await pool.query(query, [userId, limit, offset]);
      return result.rows.map(row => new Payment(row));
    } catch (error) {
      throw new Error(`Failed to find payments by user ID: ${error.message}`);
    }
  }

  async logAction(action, status, responseData = null) {
    const query = `
      INSERT INTO payment_logs (payment_id, action, status, response_data)
      VALUES ($1, $2, $3, $4)
    `;
    
    const values = [this.id, action, status, responseData];
    
    try {
      await pool.query(query, values);
    } catch (error) {
      console.error('Failed to log payment action:', error);
    }
  }
}

module.exports = Payment;