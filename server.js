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
    port: 8888,
    database: 'clusture_db',
    user: 'postgres',
    password: '27012002Ik'
});

const SECRET_KEY = '8f2d3ae8f0c47f8e4b84d9425a715cdbdddc70ee6d7f647f730f258c6e87f7e5';
app.use(express.static('public'));
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
        const hashedEnteredPassword = await bcrypt.hash(password, 10);
        const isPasswordValid = await bcrypt.compare(password, hashedEnteredPassword);
        console.log('User data:', result.rows[0]);
        console.log('Entered password:', password);
        console.log('Stored password:', user.password);
        console.log('Password Match Result:', isPasswordValid);

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
/*
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const user = result.rows[0];
        console.log('Entered password:', password);
        console.log('Stored password:', user.password);

        // Compare passwords directly
        if (password === user.password) {
            const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            return res.status(200).json({ message: 'Login successful', token, username: user.username });
        } else {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Login failed', error: error.message });
    }
});
*/
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
app.get('/boards', async (req, res) => {
    try {
        const query = `
            SELECT board.boardid, board.boardname, board.description, users.username, board.imageurl 
            FROM board 
            INNER JOIN users ON board.userid = users.userid
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching boards:', error);
        res.status(500).json({ message: 'Failed to fetch boards', error: error.message });
    }
});

app.post('/boards', async (req, res) => {
    const { boardname, description, userid, imageurl } = req.body;

    try {
        const query = `
            INSERT INTO board (boardname, description, userid, imageurl, createdat, isprivate) 
            VALUES ($1, $2, $3, $4, NOW(), FALSE) RETURNING *;
        `;
        const values = [boardname, description, userid, imageurl || '/images/default.jpg'];
        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Board added successfully', board: result.rows[0] });
    } catch (error) {
        console.error('Error adding board:', error);
        res.status(500).json({ message: 'Failed to add board', error: error.message });
    }
});


app.delete('/boards/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM board WHERE boardid = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Board not found' });
        }

        res.status(200).json({ message: 'Board deleted successfully', board: result.rows[0] });
    } catch (error) {
        console.error('Error deleting board:', error);
        res.status(500).json({ message: 'Failed to delete board', error: error.message });
    }
});

// Serve static files for profile pictures
app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});