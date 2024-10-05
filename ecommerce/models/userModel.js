const db = require('../config/db');

const user = {
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE role = ?';
            db.query(query, ['customer'], (err, results) => {
                if (err) return reject(err);
                resolve(results); // Resolve with the results
            });
        });
    },
};
module.exports = user;
