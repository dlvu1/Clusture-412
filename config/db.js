const { Client } = require('pg');

// Connect to PostgreSQL
const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'clusture_db',
    user: 'clusture_user',
    password: 'yourpassword'
});

client.connect()
    .then(() => console.log('PostgreSQL connected'))
    .catch((err) => console.error('Error connecting to PostgreSQL', err));

module.exports = client;
