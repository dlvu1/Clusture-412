const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'clusture_db',
    user: 'clusture_user',
    password: 'yourpassword'
});

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
        // Check if user already exists
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
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
        // Find the user by username
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(400).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
