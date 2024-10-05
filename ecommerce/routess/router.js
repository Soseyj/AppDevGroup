const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const main = require('../controller/Main');
const productModel = require('../models/productModel');
const { getAddressByUserId } = require('../models/addressModel');

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

module.exports = router;
