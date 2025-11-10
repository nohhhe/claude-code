// User Service - Before Refactoring
// This code demonstrates multiple refactoring opportunities

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

class UserService {
    constructor(db, config) {
        this.db = db;
        this.config = config;
        this.users = [];
        this.activeUsers = new Map();
    }

    // Long function that needs to be extracted into smaller functions
    async createUser(userData) {
        // Validate input
        if (!userData || !userData.email || !userData.password) {
            throw new Error('Invalid user data');
        }
        if (!userData.email.includes('@')) {
            throw new Error('Invalid email format');
        }
        if (userData.password.length < 8) {
            throw new Error('Password too short');
        }
        if (!userData.password.match(/[A-Z]/)) {
            throw new Error('Password must contain uppercase letter');
        }
        if (!userData.password.match(/[0-9]/)) {
            throw new Error('Password must contain number');
        }
        
        // Check if user exists
        const existingUser = await this.db.findOne('users', { email: userData.email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        // Create user object
        const user = {
            id: uuidv4(),
            email: userData.email,
            password: hashedPassword,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            lastLogin: null,
            loginAttempts: 0,
            isLocked: false,
            profile: {
                avatar: userData.avatar || null,
                bio: userData.bio || '',
                preferences: {
                    theme: 'light',
                    notifications: true,
                    language: 'en'
                }
            }
        };

        // Save to database
        try {
            await this.db.insert('users', user);
            console.log('User created successfully:', user.id);
            
            // Send welcome email
            const emailData = {
                to: user.email,
                subject: 'Welcome to our platform!',
                template: 'welcome',
                data: {
                    firstName: user.firstName,
                    email: user.email
                }
            };
            
            // This should be extracted to a separate service
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransporter({
                service: 'gmail',
                auth: {
                    user: this.config.email.user,
                    pass: this.config.email.password
                }
            });
            
            await transporter.sendMail(emailData);
            
            return { success: true, userId: user.id, message: 'User created successfully' };
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user');
        }
    }

    // Duplicated login logic - should be extracted
    async authenticateUser(email, password) {
        const user = await this.db.findOne('users', { email: email });
        if (!user) {
            throw new Error('User not found');
        }
        
        if (user.isLocked) {
            throw new Error('Account is locked');
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            user.loginAttempts++;
            if (user.loginAttempts >= 5) {
                user.isLocked = true;
            }
            await this.db.update('users', { id: user.id }, user);
            throw new Error('Invalid credentials');
        }
        
        user.lastLogin = new Date();
        user.loginAttempts = 0;
        await this.db.update('users', { id: user.id }, user);
        
        const token = jwt.sign({ userId: user.id, email: user.email }, this.config.jwtSecret, { expiresIn: '24h' });
        
        return { token: token, user: { id: user.id, email: user.email, firstName: user.firstName } };
    }

    // More duplicated login logic
    async adminLogin(email, password, adminCode) {
        const user = await this.db.findOne('users', { email: email });
        if (!user) {
            throw new Error('User not found');
        }
        
        if (user.isLocked) {
            throw new Error('Account is locked');
        }
        
        if (!user.isAdmin) {
            throw new Error('Not an admin user');
        }
        
        if (adminCode !== this.config.adminCode) {
            throw new Error('Invalid admin code');
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            user.loginAttempts++;
            if (user.loginAttempts >= 5) {
                user.isLocked = true;
            }
            await this.db.update('users', { id: user.id }, user);
            throw new Error('Invalid credentials');
        }
        
        user.lastLogin = new Date();
        user.loginAttempts = 0;
        await this.db.update('users', { id: user.id }, user);
        
        const token = jwt.sign({ userId: user.id, email: user.email, isAdmin: true }, this.config.jwtSecret, { expiresIn: '24h' });
        
        return { token: token, user: { id: user.id, email: user.email, firstName: user.firstName, isAdmin: true } };
    }

    // Complex conditional logic that needs simplification
    async getUserPermissions(userId, resourceType, action) {
        const user = await this.db.findOne('users', { id: userId });
        
        if (!user) {
            return false;
        }
        
        if (user.isAdmin) {
            if (resourceType === 'user' && action === 'delete' && user.id === userId) {
                return false; // Admin can't delete themselves
            } else if (resourceType === 'system' && action === 'shutdown' && !user.isSuperAdmin) {
                return false;
            } else {
                return true;
            }
        } else {
            if (resourceType === 'profile' && action === 'read' && user.id === userId) {
                return true;
            } else if (resourceType === 'profile' && action === 'write' && user.id === userId) {
                return true;
            } else if (resourceType === 'post' && action === 'create' && user.isActive) {
                return true;
            } else if (resourceType === 'post' && action === 'read') {
                return true;
            } else if (resourceType === 'post' && action === 'write' && user.id === userId) {
                return true;
            } else if (resourceType === 'comment' && action === 'create' && user.isActive) {
                return true;
            } else {
                return false;
            }
        }
    }

    // REFACTORED: Variables renamed for clarity and readability
    async processUserData(u, t, opts) {
        const d = new Date();
        const ts = d.getTime();
        
        if (t === 1) {
            // Update user
            if (opts.e) {
                u.email = opts.e;
            }
            if (opts.fn) {
                u.firstName = opts.fn;
            }
            if (opts.ln) {
                u.lastName = opts.ln;
            }
        } else if (t === 2) {
            // Delete user
            u.isDeleted = true;
            u.deletedAt = d;
        } else if (t === 3) {
            // Activate user
            u.isActive = true;
            u.activatedAt = d;
        }
        
        u.updatedAt = d;
        await this.db.update('users', { id: u.id }, u);
        
        return u;
    }

    // Missing error handling
    async bulkCreateUsers(usersData) {
        const results = [];
        
        for (let i = 0; i < usersData.length; i++) {
            const userData = usersData[i];
            const result = await this.createUser(userData);
            results.push(result);
        }
        
        return results;
    }

    // Performance issues - no caching, inefficient queries
    async getActiveUserCount() {
        const allUsers = await this.db.findAll('users');
        let count = 0;
        for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i].isActive && !allUsers[i].isDeleted) {
                count++;
            }
        }
        return count;
    }

    // Poor readability - no comments, complex nested logic
    async cleanupInactiveUsers() {
        const users = await this.db.findAll('users');
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        
        for (const user of users) {
            if (user.lastLogin < thirtyDaysAgo && !user.isAdmin) {
                if (user.createdAt < new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000))) {
                    await this.db.update('users', { id: user.id }, { isActive: false, deactivatedAt: now, reason: 'inactive' });
                }
            }
        }
    }
}

module.exports = UserService;