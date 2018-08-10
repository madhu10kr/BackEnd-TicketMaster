const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const mongoose = require('./confg/db');

//middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));

//route handlers

app.get('/',(req,res) => {
    res.send({
        msg:'Welcome to ticket master'
    })
})

app.listen(port,() => {
    console.log('listening to port ',port);
})