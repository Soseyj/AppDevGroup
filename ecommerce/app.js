const bodyParser = require('body-parser');
const express = require('express');
const routess = require('./routess/router');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use('/', routess);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/images', express.static('public/images'));



app.listen(4000, ()=>{
    console.log('server running on http://localhost:4000');
}); 
