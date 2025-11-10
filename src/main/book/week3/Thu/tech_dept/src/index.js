const express = require('express');
const userService = require('./services/userService');
const authController = require('./controllers/authController');
const legacyUtils = require('./utils/legacyUtils');

// TODO: Move to environment configuration
const PORT = 3000;

const app = express();

app.use(express.json());

// FIXME: No error handling middleware
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', authController);

// TODO: Add proper logging
// FIXME: This should use a proper logger like winston
console.log(`Server starting on port ${PORT}`);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;