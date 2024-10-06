const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const routess = require('./routess/router');
const main = require('./controller/Main');
const mysql = require('mysql2/promise');
const path = require('path');
const flash = require('connect-flash');
const app = express();
const db = require('./config/db');
const { getUserById } = require('./models/userModel');

app.use(bodyParser.json());
app.use(flash());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'Soseyj',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));
app.use((req, res, next) => {
    res.locals.userId = req.session.userId; 
    next();
});
app.use('/', routess);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/public/images', express.static('public/images'));
app.listen(6969, () => {
    console.log('Server running on http://localhost:6969');
});
