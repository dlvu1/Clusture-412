const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'clusture_db',
    user: 'clusture_user',
    password: 'yourpassword'
});

const SECRET_KEY = '8f2d3ae8f0c47f8e4b84d9425a715cdbdddc70ee6d7f647f730f258c6e87f7e5';

app.use(cors());
app.use(express.json());

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({ message: 'Database connected', time: result.rows[0] });
    } catch (err) {
        console.error('Error connecting to the database:', err);
        res.status(500).json({ message: 'Database connection error', error: err.message });
    }
});

// Handle user sign-up
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

        res.status(201).json({ message: 'Sign up successful' });
    } catch (error) {
        console.error('Error during sign-up', error);
        res.status(500).json({ message: 'Sign-up failed', error: error.message });
    }
});

// Handle user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token, username: user.username });
        } else {
            res.status(400).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Authentication Middleware to validate JWT
function authenticateJWT(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];  // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(403).json({ message: 'Token is required for authentication' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;  // Add user info to the request object
        next();
    });
}

// Handle profile updates
app.post('/profile', authenticateJWT, upload.single('profilePic'), async (req, res) => {
    const { description } = req.body;  // Extract description from the request body
    const profilePic = req.file ? req.file.filename : null;  // Get the file name of the uploaded image

    const username = req.user.username;  // Get the username from the JWT payload

    // Validate the username is provided
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        const result = await pool.query(
            'UPDATE users SET profilepic = $1, description = $2 WHERE username = $3 RETURNING profilepic, description',
            [profilePic, description, username]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            profilepic: result.rows[0].profilepic,
            description: result.rows[0].description
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
});

// Create Pin route (with authentication)
app.post('/create-pin', authenticateJWT, upload.single('image'), async (req, res) => {
    const { tags, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const username = req.user.username;  // Now, req.user contains the authenticated username

    if (!imagePath || !tags || !description) {
        return res.status(400).json({ message: 'Image, description, and tags are required.' });
    }

    try {
        // Fetch the user ID based on the username
        const userResult = await pool.query('SELECT userid FROM users WHERE username = $1', [username]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userId = userResult.rows[0].userid;

        // Create the pin (removed title from query)
        const result = await pool.query(
            'INSERT INTO pin (userid, tags, imageurl, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, tags, imagePath, description]
        );

        res.status(201).json({
            message: 'Pin created successfully',
            pin: result.rows[0],
        });
    } catch (error) {
        console.error('Error creating pin:', error);
        res.status(500).json({ message: 'Failed to create pin', error: error.message });
    }
});

// Serve static files for profile pictures
app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
