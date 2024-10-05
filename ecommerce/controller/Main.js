const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const addressModel = require('../models/addressModel');
const db = require('../config/db')
const path = require('path');
const bcrypt = require('bcrypt');
const { error } = require('console');

const main = {
    ty: (req, res) => {
        res.render('ty');
    },

    checkout: async (req, res) => {
        const userId = req.params.id; 
        try {
            const user = await userModel.getUserById(userId); 
            res.render('checkout', { user }); 
        } catch (error) {}
    },
    
    viewCart: async (req, res) => {
        const userId = req.session.userid; 
        const user = await userModel.getUserById(userId);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const cartItems = await productModel.getCartItems(userId);
            if (!cartItems || cartItems.length === 0) {
                return res.status(404).json({ message: 'No items in the cart' });
            }
            res.render('cart', { cartItems, user });
        } catch (error) {
            console.error('Error fetching cart items:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    about: async (req, res) => {
        const userId = req.params.id; 
        try {
            const user = await userModel.getUserById(userId); 
            res.render('about', { user }); 
        } catch (error) {}
    },

    product: async (req, res) => {
        const userId = req.session.userid;  
        const productId = req.params.productId;  
        try {
            const user = await userModel.getUserById(userId);
            if (!user) {
                return res.status(404).send('User not found');
            }
            const product = await productModel.getProductById(productId);
            if (!product) {
                return res.status(404).send('Product not found');
            }
            res.render('product', { user, product });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    services: async (req, res) => {
        const userId = req.params.id; 
        try {
            const user = await userModel.getUserById(userId); 
            res.render('services', { user }); 
        } catch (error) {}
    },
    
    shop: async (req, res) => {
        const userId = req.session.userid; 
        try {
            const products = await productModel.getAllProducts(); 
            const successMessage = req.session.message ? req.session.message.success : null;
            req.session.message = null; 
            res.render('shop', { products, successMessage, user: { id: userId } }); 
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    addToCart: async (req, res) => {
        const userId = req.session.userid; 
        const productId = req.body.productId;
        const quantity = req.body.quantity;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated.' });
        }
        try {
            const result = await productModel.addToCart(userId, productId, quantity);
            req.session.message = { success: 'Successfully added to cart' };
            res.redirect('/shop/' + userId); 
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ error: 'An error occurred while adding to the cart.' });
        }
    },
 
    addAddress: async (req, res) => {
        const userId = req.session.userid; 
        const { province, city, barangay, addressline, postal, is_default } = req.body;
        const isDefault = is_default === '1';
        if (!userId) {
            return res.status(400).json({ message: 'User not found. Please log in.' });
        }
    
        if (!province || !city || !barangay || !addressline || !postal) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        try {
            const user = await userModel.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            const existingDefaultAddress = await addressModel.getDefaultAddress(userId);
            if (isDefault && existingDefaultAddress) {
                await addressModel.unsetDefaultAddress(existingDefaultAddress.id);
            }
            await addressModel.addAddress({
                user_id: userId, 
                province,
                city,
                barangay,
                addressline,
                postal,
                is_default: isDefault
            });
            res.redirect('/user/' + userId); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    },

    removeFromCart: async (req, res) => {
        const userId = req.session.userid; 
        const itemId = req.params.itemId; 
        console.log(`User ID: ${userId}, Item ID to remove: ${itemId}`);
        try {
            if (!userId || !itemId) {
                console.error('Invalid parameters:', { userId, itemId });
                return res.status(400).json({ message: 'Invalid parameters' });
            }
            const result = await productModel.removeItemFromCart(userId, itemId);
            console.log('Delete result:', result);
            if (result.affectedRows > 0) {
                console.log('Item successfully removed from cart');
                return res.redirect('/cart/' + userId);
            } else {
                console.log('No item found to remove or already removed');
                return res.status(404).json({ message: 'Item not found in cart' });
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

module.exports = main;
