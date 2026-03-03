const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json()); // For parsing application/json
app.use(cookieParser());
app.use(session({
    secret: 'userManagementSecretKey', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 * 60 } // 1 hour session
}));

// Serve static files (CSS, JS, Images, etc.) from Weather folder
app.use(express.static(path.join(__dirname, 'Weather')));

// MongoDB connection
mongoose.connect('mongodb://localhost/weather-app')
    .then(() => {
        console.log("MongoDB connected");
        console.log("Virat Creations running...");
    })
    .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Weather', 'index.html')); // Home page
});

app.get('/weather', (req, res) => {
    res.sendFile(path.join(__dirname, 'Weather', 'weather.html')); // Weather page
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'Weather', 'signup.html')); // Registration page
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'Weather', 'signup.html')); // Registration page (alternative route)
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Weather', 'login.html')); // Login page
});

// Dashboard Route with session check
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    // Check if dashboard.html exists, otherwise serve weather.html
    res.sendFile(path.join(__dirname, 'Weather', 'weather.html'));
});

// Profile Route
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    // Send a simple profile page or redirect to weather
    res.sendFile(path.join(__dirname, 'Weather', 'weather.html'));
});

// Settings Route
app.get('/settings', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    res.sendFile(path.join(__dirname, 'Weather', 'weather.html'));
});

// Manage Users Route
app.get('/users', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    res.sendFile(path.join(__dirname, 'Weather', 'weather.html'));
});

// Reports Route
app.get('/reports', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    res.sendFile(path.join(__dirname, 'Weather', 'weather.html'));
});

// Logout Route
app.get('/auth/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard'); // Handle error (redirect to dashboard)
        }
        res.redirect('/login'); // Redirect to login after successful logout
    });
});

// Include authentication routes (login, register, etc.)
app.use('/auth', require('./routes/auth'));

// API endpoint to get current user
app.get('/api/current-user', (req, res) => {
    if (req.session.user) {
        res.json({ username: req.session.user, authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
});

// 404 Route
app.use((req, res) => {
    res.status(404).send('Page not found'); // Simple 404 page
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT}`);
});