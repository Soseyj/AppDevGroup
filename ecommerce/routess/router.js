const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const main = require('../controller/Main');
const productModel = require('../models/productModel');
const { getAddressByUserId } = require('../models/addressModel');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets/images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
router.get('/admin', main.admin);
router.get('/admin/users', main.viewUsers);
router.get('/admin/products', main.viewProducts);
router.post('/admin/addProduct', upload.fields([{ name: 'imageFile' }]), main.addProduct);
router.post('/admin/product/:id', upload.fields([{ name: 'imageFile' }]), main.editProduct);
router.post('/admin/deleteProduct/:id', main.deleteProduct);
router.get('/shop/:id', main.shop);
router.get('/cart/:userid', main.viewCart);
router.post('/addCart/', main.addToCart);
router.post('/removeProd/:itemId', main.removeFromCart);
router.get('/checkout/:id', main.checkout);
router.get('/ty/:id', main.ty);
router.get('/product/:productId', main.product);
router.get('/index/:id', main.index);
router.get('/services/:id', main.services);
router.get('/about/:id', main.about);

router.get('/search', main.searchProducts);
router.get('/user/:id', main.userPage);
router.post('/editProf/:id', main.editUser);
router.get('/address/:addressId', main.address);
router.post('/addAdd/', main.addAddress);
router.post('/updateAdd/:id', main.updateAddress);
router.post('/setDefault/:addressId', main.setDefaultAddress);


module.exports = router;
