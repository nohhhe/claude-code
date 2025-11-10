const express = require('express');
const userService = require('../services/userService');
const { authMiddleware } = require('../controllers/authController');

const router = express.Router();

// TODO: Add proper validation middleware
// FIXME: No rate limiting

// Get user profile
router.get('/profile/:id', authMiddleware, async (req, res) => {
    try {
        // FIXME: No input validation
        const userId = req.params.id;
        const requestingUserId = req.user.userId;
        const requestingUserRole = req.user.role;

        const result = await userService.getUserProfile(
            userId, 
            requestingUserId, 
            requestingUserRole
        );

        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Get profile error:', error); // FIXME: Use proper logger
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update user profile
router.put('/profile/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        const requestingUserId = req.user.userId;
        const requestingUserRole = req.user.role;

        // TODO: Add request body validation
        const result = await userService.updateUser(
            userId, 
            updateData, 
            requestingUserId, 
            requestingUserRole
        );

        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get user list (admin only)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const requestingUserId = req.user.userId;
        const requestingUserRole = req.user.role;
        
        // TODO: Parse query parameters properly
        const filters = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await userService.getUserList(
            requestingUserId,
            requestingUserRole,
            filters,
            page,
            limit
        );

        if (result.success) {
            res.json(result);
        } else {
            res.status(403).json(result);
        }
    } catch (error) {
        console.error('Get user list error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Delete user (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        const requestingUserId = req.user.userId;
        const requestingUserRole = req.user.role;
        
        // TODO: Add confirmation parameter
        const hardDelete = req.query.hard === 'true';

        const result = await userService.deleteUser(
            userId,
            requestingUserId,
            requestingUserRole,
            hardDelete
        );

        if (result.success) {
            res.json(result);
        } else {
            res.status(403).json(result);
        }
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;