const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const addressModel = require('../models/addressModel');
const db = require('../config/db')
const path = require('path');
const bcrypt = require('bcrypt');
const { error } = require('console');


const main = {
    // Index page handler
    index: (req, res) => {
        const userId = req.session.userid;
        let user = null;

        if (userId) {
            userModel.getUserById(userId).then(fetchedUser => {
                user = fetchedUser;
                res.render('index', { user });
            }).catch(err => {
                console.error(err);
                res.render('index', { user });
            });
        } else {
            res.render('index', { user });
        }
    },

    // Admin page handler
    admin: (req, res) => {
        res.render('admin');
    },

    // View users handler
    viewUsers: async (req, res) => {
        try {
            const users = await userModel.getAllUsers();
            res.render('viewUsers', { users });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const User = await userModel.fEmail(email);
            if (!User) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
    
            const isMatch = await bcrypt.compare(password, User.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            req.session.userid = User.id;
            req.session.role = User.role; 
            if (User.role === 'admin') {
                return res.redirect('/admin'); 
            } else {
                return res.redirect('/index/' + User.id); 
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    isAdmin: (req, res, next) => {
        if (req.session.role === 'admin') {
            return next(); 
        } else {
            return res.status(403).json({ message: 'Access denied' }); 
        }
    },
        register: (req, res) => {
        res.render('register');
    },
        register1: async (req, res) => {
        const { fName, lName, email, phone, password, confirmpassword } = req.body;
        if (!fName || !lName || !phone || !password || !confirmpassword) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        if (password !== confirmpassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }
        try {
            const existingUser = await userModel.fEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email already exists.' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await userModel.createUser({
                fName,
                lName,
                email,
                phone,
                password: hashedPassword
            });
            res.redirect('/');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    },

    viewProducts: async (req, res) => {
        try {
            const products = await productModel.getAllProducts();
            const product1 = await productModel.getAllProducts();
            res.render('viewProducts', { products, product1 });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    addProduct: (req, res) => {
        const newProduct = {
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            image_url: `/public/assets/images/${req.files.imageFile[0].filename}`
        };
        productModel.addProduct(newProduct, (err) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.redirect('/admin/products');
            }
        });
    },

    editProduct: (req, res) => {
        const productId = req.params.id;
        const updatedProduct = {
            name: req.body.name,
            price: req.body.price,
            image_url: req.files.imageFile ? `/assets/images/${req.files.imageFile[0].filename}` : req.body.oldImage,
        };
        productModel.updateProduct(productId, updatedProduct, (err) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.redirect('/admin/products');
            }
        });
    },

    deleteProduct: (req, res) => {
        const productId = req.params.id;
        productModel.deleteProduct(productId, (err) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.redirect('/admin/products');
            }
        });
    },


    ty: (req, res) => {
        res.render('ty');
    },

    checkout: async (req, res) => {
        const userId = req.params.id;
        try {
            const user = await userModel.getUserById(userId);
            res.render('checkout', { user });
        } catch (error) { }
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
        } catch (error) { }
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
        } catch (error) { }
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
    },

    address: async (req, res) => {
        const userId = req.session.userid;  
        const addressId = req.params.addressId;  
    
        try {
            console.log("User ID from params:", userId);
            console.log("Address ID from params:", addressId);
            const address = await addressModel.getAddressByIdAndUserId(addressId, userId);
            console.log("Fetched address data:", address);
            if (address.length > 0) {
                res.render('address', { address: address[0] }); 
            } else {
                res.status(404).send('Address not found');
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    editUser: (req, res) => {
        const userId = req.params.id;   
        const updatedUser = {
            fName: req.body.fName,
            lName: req.body.lName,
            phone: req.body.phone,
            email: req.body.email
        };
       if (userModel.updateUser(userId, updatedUser, (err) => {
        }))
        res.redirect('/user/' + userId);
        else {
            console.error(error);
        }
    },

    userPage: (req, res) => {
        const userId = req.session.userid;
        if (!userId) {
            return res.redirect('/');
        }
        Promise.all([
            userModel.getUserById(userId),
            addressModel.getAddressByUserId(userId),
        ])
        .then(([user, addresses]) => {
            if (!user) {
                return res.status(404).send('User not found');
            }
            if (!addresses || addresses.length === 0) {
                console.warn('No addresses found for user:', userId); 
            }
            res.render('user', { user, addresses });
        })
        .catch(err => {
            console.error('Error fetching user or addresses:', err);
            res.status(500).send('Internal Server Error');
        });
    },
 updateAddress: async (req, res) => {
        const userId = req.session.userid;
        const addressId = req.params.id; 
        const { province, city, barangay, addressline, postal, is_default } = req.body;
        console.log('Received address data:', {
            province,
            city,
            barangay,
            addressline,
            postal,
            is_default
        }); 
        try {
            const result = await addressModel.updateAddress(addressId, userId, {
                province,
                city,
                barangay,
                addressline,
                postal,
                is_default: is_default === 'true' 
            });
            console.log('Update result:', result);
            if (result.affectedRows === 0) {
                console.log('No rows updated. Check if address ID and user ID are correct.');
            } else {
                console.log('Address updated successfully.');
            }
        } catch (error) {
            console.error('Error updating address:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    },
    async  setDefaultAddress(req, res) {
        const userId = req.session.userid; 
        console.log(`Received userId: ${userId}, addressId: ${addressId}`); 
        if (!userId || !addressId) {
            return res.status(400).send({ error: "userId and addressId are required." });
        }
        try {
            await addressModel.setDefaultAddress(userId, addressId);
            res.redirect('/user/' + userId);
        } catch (error) {
            console.error("Error setting default address:", error);
            res.status(500).send({ error: "Failed to set default address." });
        }
    },

    async searchProducts(req, res) {
        const userId = req.session.userid;
        const query = req.query.query;
        try {
            if (!query) {
                return res.status(400).send({ error: "Search query is required." });
            }
            const products = await productModel.searchProducts(query);
            res.render('shop', { products, user: req.user }); 
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).send({ error: "An error occurred while searching for products." });
        }
    },

};

module.exports = main;
