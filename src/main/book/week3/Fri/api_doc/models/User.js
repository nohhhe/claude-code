const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/**
 * User model - Mock implementation
 * In a real application, this would connect to a database
 */
class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.email = data.email;
    this.name = data.name;
    this.password = data.password;
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Mock database storage
  static users = [];

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<User>} Created user
   */
  static async create(userData) {
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    const user = new User({
      ...userData,
      password: hashedPassword
    });

    this.users.push(user);
    return user;
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<User|null>} Found user or null
   */
  static async findById(id) {
    return this.users.find(user => user.id === id) || null;
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<User|null>} Found user or null
   */
  static async findByEmail(email) {
    return this.users.find(user => user.email === email) || null;
  }

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<User|null>} Updated user or null
   */
  static async update(id, updateData) {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }

    // Update user data
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return this.users[userIndex];
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }

  /**
   * Get all users
   * @returns {Promise<User[]>} All users
   */
  static async findAll() {
    return this.users;
  }

  /**
   * Verify password
   * @param {string} password - Plain text password
   * @returns {Promise<boolean>} Password match result
   */
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

module.exports = User;