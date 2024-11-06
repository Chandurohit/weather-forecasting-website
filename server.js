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
    cookie: { secure: false, maxAge: 60000 } // Use secure: true when in production with HTTPS
}));

// Serve static files (CSS, JS, Images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://localhost/weather-app')
    .then(() => {
        console.log("MongoDB connected");
        console.log("Virat Creations running...");
    })
    .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html')); // Public static HTML page
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html')); // Registration page
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html')); // Login page
});

// Dashboard Route with session check
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    const username = req.session.user; // Get the username from session
    // Serve dashboard HTML file instead of rendering
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html')); // Adjust to your dashboard HTML file
});

// Profile Route
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    const username = req.session.user; // Get the username from session
    res.sendFile(path.join(__dirname, 'public', 'profile.html')); // Serve the profile HTML file
});

// Settings Route
app.get('/settings', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    const username = req.session.user; // Get the username from session
    res.sendFile(path.join(__dirname, 'public', 'settings.html')); // Serve the settings HTML file
});

// Manage Users Route
app.get('/users', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    const username = req.session.user; // Get the username from session
    res.sendFile(path.join(__dirname, 'public', 'Users.html')); // Serve the manage users HTML file
});

// Reports Route
app.get('/reports', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    const username = req.session.user; // Get the username from session
    res.sendFile(path.join(__dirname, 'public', 'reports.html')); // Serve the reports HTML file
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

// 404 Route
app.use((req, res) => {
    res.status(404).send('Page not found'); // Simple 404 page
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
});