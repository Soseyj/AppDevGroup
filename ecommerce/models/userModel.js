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
