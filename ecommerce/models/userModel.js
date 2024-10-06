const db = require('../config/db');

const user = {
    // Get all users with role 'customer'
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE role = ?';
            db.query(query, ['customer'], (err, results) => {
                if (err) return reject(err);
                resolve(results); // Resolve with the results
            });
        });
    },

    // Get user by email
    fEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE email = ?';
            db.query(query, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]); // Resolve with the first result
            });
        });
    },

    // Get user by ID
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE id = ?';
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]); // Resolve with the first result
            });
        });
    },

    // Create a new user and initialize their cart
    createUser: (user) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO users (fName, lName, email, phone, password) VALUES (?, ?, ?, ?, ?)';
            const params = [user.fName, user.lName, user.email, user.phone, user.password];

            db.query(query, params, (err, results) => {
                if (err) return reject(err);

                const userId = results.insertId; // Get the inserted user's ID

                // Create a cart for the user
                const cartQuery = 'INSERT INTO carts (user_id) VALUES (?)';
                db.query(cartQuery, [userId], (cartErr, cartResults) => {
                    if (cartErr) return reject(cartErr);
                    resolve({ userResults: results, cartResults });
                });
            });
        });
    },

    // Update user information
    updateUser: (id, { fName, lName, email, phone }) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET fName = ?, lName = ?, email = ?, phone = ? WHERE id = ?';
            db.execute(query, [fName, lName, email, phone, id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
};

module.exports = user;
