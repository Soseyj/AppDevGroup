const db = require('../config/db');
const db1 = require('../config/db1');

const addressModel = {
getAddressByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM address WHERE user_id = ? ORDER BY is_default DESC';
            db.query(query, [userId], (err, results) => {
                if (err) {
                    console.error('Error fetching addresses:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

 getUserById: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE id = ?';
            db.query(query, [id], (err, results) => {
                if (err) {
                    console.error('Database query error:', err);
                    return reject(err);
                }
                console.log('Fetched user data:', results[0]);
                resolve(results[0]);
            });
        });
    },

    getAddressByIdAndUserId: (addressId, userId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM address WHERE id = ? AND user_id = ?';
            db.query(query, [addressId, userId], (err, results) => {
                if (err) {
                    console.error('Error fetching address:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    addAddress: (addressData) => {
        const { user_id, province, city, barangay, addressline, postal, is_default } = addressData;
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO address (user_id, province, city, barangay, addressline, postal, is_default) 
                           VALUES (?, ?, ?, ?, ?, ?, ?)`;
            db.query(query, [user_id, province, city, barangay, addressline, postal, is_default], (err, result) => {
                if (err) {
                    console.error('Error adding address:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    async updateAddress(addressId, userId, addressData) {
        const { province, city, barangay, addressline, postal } = addressData;

        try {
            const [currentAddress] = await db1.query(
                'SELECT * FROM address WHERE id = ? AND user_id = ?',
                [addressId, userId]
            );

            if (currentAddress.length === 0) {
                throw new Error('Address not found.');
            }

            const existingAddress = currentAddress[0];
            const updates = [];
            const params = [];
            const fields = { province, city, barangay, addressline, postal };

            for (const [key, value] of Object.entries(fields)) {
                if (value !== undefined && value !== existingAddress[key]) {
                    updates.push(`${key} = ?`);
                    params.push(value);
                }
            }

            if (updates.length === 0) {
                throw new Error("No changes detected to update.");
            }

            params.push(addressId, userId);
            const updateQuery = `UPDATE address SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`;
            const [result] = await db1.query(updateQuery, params);

            return result;
        } catch (error) {
            console.error('Error updating address:', error);
            throw error;
        }
    },

    unsetDefaultAddress: async (addressId) => {
        await db.query('UPDATE address SET is_default = 0 WHERE id = ?', [addressId]);
    },

    countUserAddresses: async (userId) => {
        const query = 'SELECT COUNT(*) AS addressCount FROM address WHERE user_id = ?';
        const [rows] = await db1.query(query, [userId]);
        return rows[0].addressCount;
    },

    getDefaultAddress: async (userId) => {
        const [rows] = await db1.query('SELECT * FROM address WHERE user_id = ? AND is_default = 1', [userId]);
        return rows.length > 0 ? rows[0] : null;
    },

    UnsetDefault: async (userId) => {
        const sql = 'UPDATE address SET is_default = 0 WHERE user_id = ? AND is_default = 1';
        await db1.query(sql, [userId]);
    },

    async setDefaultAddress(userId, addressId) {
        const connection = await db1.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query(
                'UPDATE address SET is_default = 0 WHERE user_id = ? AND is_default = 1',
                [userId]
            );

            await connection.query(
                'UPDATE address SET is_default = 1 WHERE id = ? AND user_id = ?',
                [addressId, userId]
            );

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = addressModel;

