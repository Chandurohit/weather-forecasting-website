// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path as necessary
const router = express.Router();

// routes/auth.js
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).send('Username or email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).send('Error registering user');
    }
});


// Add the login route
router.post('/login', async (req, res) => {
    const { login, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ username: login }, { email: login }]
        });

        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Invalid credentials');
        }

        // Store user session information
        req.session.user = user.username; // Adjust to store any necessary user data

        // Send a success message
        res.status(200).send('Login successful');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Error logging in');
    }
});


module.exports = router;