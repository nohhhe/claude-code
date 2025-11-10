const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit'); // TODO: Actually implement rate limiting

// FIXME: No proper configuration management
const JWT_SECRET = 'super-secret-key-that-should-be-in-env';

// TODO: Move to separate middleware file
// DEPRECATED: Using old callback-style middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // FIXME: Token verification is synchronous
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// TODO: Add input validation
// FIXME: No rate limiting implemented
const login = async (req, res) => {
    try {
        const { username, password, rememberMe } = req.body;
        
        // TODO: Add request validation
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password required' 
            });
        }

        // FIXME: Should extract device info properly
        const deviceInfo = {
            userAgent: req.headers['user-agent'],
            platform: 'unknown', // TODO: Parse user agent
            browser: 'unknown'    // TODO: Parse user agent
        };

        const result = await userService.authenticateUser(
            username, 
            password, 
            rememberMe,
            deviceInfo,
            req.ip,
            req.headers['user-agent'],
            null // TODO: Get location from IP
        );

        if (result.success) {
            res.json(result);
        } else {
            res.status(401).json(result);
        }

    } catch (error) {
        console.error('Login error:', error); // FIXME: Should use proper logger
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// TODO: Add validation middleware
const register = async (req, res) => {
    try {
        const userData = req.body;
        
        // FIXME: No input sanitization
        const result = await userService.createUser(userData);

        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// FIXME: No proper session management
const logout = async (req, res) => {
    try {
        // TODO: Invalidate token in database
        // TODO: Clear user session
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// TODO: Implement refresh token logic
const refreshToken = async (req, res) => {
    try {
        // FIXME: Not implemented
        res.status(501).json({ message: 'Not implemented' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    login,
    register,
    logout,
    refreshToken,
    authMiddleware
};