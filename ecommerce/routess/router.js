const express = require('express');
const router = express.Router();
const main = require('../controller/Main');

router.get('/', main.login);
router.get('/login', main.login);
router.get('/index', main.index);
router.get('/services', main.services);
router.get('/about', main.about);
router.get('/blog', main.blog);
router.get('/contact', main.contact);
router.get('/shop', main.shop);
router.get('/cart', main.cart);
router.get('/checkout', main.checkout);
router.get('/ty', main.ty);
router.get('/faqs', main.faqs);
router.get('/user', main.user);
router.get('/register', main.register);
module.exports = router;
