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

// Handle profile updates
app.post('/profile', upload.single('profilePic'), async (req, res) => {
    const { description, username } = req.body;  // Extract username and description from the request body
    const profilePic = req.file ? req.file.filename : null;  // Get the file name of the uploaded image

    // Validate the username is provided
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        console.log('Updating profile...');
        const result = await pool.query(
            'UPDATE users SET profilepic = $1, description = $2 WHERE username = $3 RETURNING profilepic, description',
            [profilePic, description, username]
        );
        console.log('Query result:', result);  // Log the result to verify if the update was successful

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

// Serve static files for profile pictures
app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});