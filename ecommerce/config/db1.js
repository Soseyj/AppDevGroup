const mysql = require('mysql2/promise'); // Use the promise wrapper

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerceFinal',
    waitForConnections: true, // Allow waiting for connections
    connectionLimit: 10, // Set a limit for the pool
    queueLimit: 0 // No limit for queued connections
});

module.exports = db;
