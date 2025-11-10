const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

/**
 * @route POST /api/users
 * @description Create a new user
 * @access Public
 * @param {string} email - User email (required)
 * @param {string} name - User name (required)
 * @param {string} password - User password (required, min 8 chars)
 * @returns {User} 201 - User created successfully
 * @returns {Error} 400 - Invalid request data
 * @returns {Error} 500 - Internal server error
 */
router.post('/',
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
    body('name')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters')
      .trim(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.mapped()
        });
      }

      const { email, name, password } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          error: 'Email already exists',
          code: 'EMAIL_EXISTS'
        });
      }

      const user = await User.create({ email, name, password });
      
      // Remove password from response
      const { password: _password, ...userResponse } = user;
      
      res.status(201).json(userResponse);
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * @route GET /api/users/:id
 * @description Get user by ID
 * @access Private
 * @param {string} id - User ID (UUID format)
 * @returns {User} 200 - User found
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 404 - User not found
 * @security Bearer Token
 */
router.get('/:id',
  authMiddleware,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid user ID format')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.mapped()
        });
      }

      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Remove password from response
      const { password: _password, ...userResponse } = user;
      
      res.json(userResponse);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * @route PUT /api/users/:id
 * @description Update user information
 * @access Private
 * @param {string} id - User ID (UUID format)
 * @param {string} [name] - User name (optional)
 * @param {string} [email] - User email (optional)
 * @returns {User} 200 - User updated successfully
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 403 - Forbidden (can only update own profile)
 * @returns {Error} 404 - User not found
 * @security Bearer Token
 */
router.put('/:id',
  authMiddleware,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid user ID format'),
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters')
      .trim(),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.mapped()
        });
      }

      const userId = req.params.id;
      
      // Check if user can update this profile (own profile or admin)
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Forbidden: Can only update own profile',
          code: 'FORBIDDEN'
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Check email uniqueness if email is being updated
      if (req.body.email && req.body.email !== user.email) {
        const existingUser = await User.findByEmail(req.body.email);
        if (existingUser) {
          return res.status(400).json({
            error: 'Email already exists',
            code: 'EMAIL_EXISTS'
          });
        }
      }

      const updatedUser = await User.update(userId, req.body);
      
      // Remove password from response
      const { password: _password, ...userResponse } = updatedUser;
      
      res.json(userResponse);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * @route DELETE /api/users/:id
 * @description Delete user account (admin only)
 * @access Private (Admin only)
 * @param {string} id - User ID (UUID format)
 * @returns 204 - User deleted successfully
 * @returns {Error} 401 - Unauthorized
 * @returns {Error} 403 - Forbidden (admin only)
 * @returns {Error} 404 - User not found
 * @security Bearer Token
 */
router.delete('/:id',
  authMiddleware,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid user ID format')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.mapped()
        });
      }

      // Only admin can delete users
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Forbidden: Admin access required',
          code: 'ADMIN_REQUIRED'
        });
      }

      const userId = req.params.id;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      await User.delete(userId);
      
      res.status(204).send();
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

module.exports = router;