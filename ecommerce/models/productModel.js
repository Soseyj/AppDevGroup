const db = require('../config/db');
const db1 = require('../config/db1');

const productModel = {
    getAllProducts: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM products', (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getProductById: (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM products WHERE id = ?', [id], (error, results) => {
                if (error) return reject(error);
                if (results.length === 0) return resolve(null);
                resolve(results[0]);
            });
        });
    },

    addProduct: (newProduct, callback) => {
        db.query('INSERT INTO products SET ?', newProduct, callback);
    },

    updateProduct: (id, updatedProduct, callback) => {
        db.query('UPDATE products SET ? WHERE id = ?', [updatedProduct, id], callback);
    },

    deleteProduct: (id, callback) => {
        db.query('DELETE FROM products WHERE id = ?', [id], callback);
    },


    createCart: async (userId) => {
        const [result] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
        return result.insertId;
    },

    addToCart: async (userId, productId, quantity) => {
        const [cart] = await db1.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
        let cartId;

        if (cart.length === 0) {
            const [newCart] = await db1.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
            cartId = newCart.insertId;
        } else {
            cartId = cart[0].id;
        }

        const [existingItem] = await db1.query('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);

        if (existingItem.length > 0) {
            const currentQuantity = Number(existingItem[0].quantity);
            const newQuantity = currentQuantity + Number(quantity);
            await db1.query('UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?', [newQuantity, cartId, productId]);
            return { message: 'Product quantity updated successfully!' };
        } else {
            await db1.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, productId, quantity]);
            return { message: 'Product added to cart successfully!' };
        }
    },

    getCartItems: async (userId) => {
        const [cartItems] = await db1.query(
            `SELECT ci.quantity, p.id, p.name, p.price, p.image_url 
             FROM cart_items ci 
             JOIN products p ON ci.product_id = p.id 
             JOIN carts c ON ci.cart_id = c.id 
             WHERE c.user_id = ?`,
            [userId]
        );
        return cartItems;
    },

    clearUserCart: async (userId) => {
        try {
            const [cart] = await db.execute('SELECT id FROM carts WHERE user_id = ?', [userId]);
            if (cart.length === 0) return;

            const cartId = cart[0].id;

            const deleteItemsQuery = 'DELETE FROM cart_items WHERE cart_id = ?';
            await db.execute(deleteItemsQuery, [cartId]);
        } catch (error) {
            throw error;
        }
    },

    removeItemFromCart: async (userId, itemId) => {
        try {
            const [cart] = await db1.execute('SELECT id FROM carts WHERE user_id = ?', [userId]);
            if (cart.length === 0) return { affectedRows: 0 };

            const cartId = cart[0].id;
            const deleteItemQuery = 'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?';
            const [deleteItemResult] = await db1.execute(deleteItemQuery, [cartId, itemId]);

            return deleteItemResult;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = productModel;
