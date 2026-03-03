const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

// Initialize app and middleware
const app = express();
app.use(bodyParser.json());

// JWT Secret Key
const JWT_SECRET = 'your_jwt_secret_key';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/weatherApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Routes

// Signup Route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });
    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: 'Signup successful!' });
});

// Login Route
app.post('/login', async (req, res) => {    
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: 'Login successful!' });
});

// Middleware to protect routes
function authMiddleware(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
}

// Protected Weather Data Route
app.get('/weather-data', authMiddleware, (req, res) => {
    res.json({ weather: "Weather data for logged-in users." });
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
