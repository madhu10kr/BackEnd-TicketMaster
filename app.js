const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const _ = require('lodash');

const { ObjectId} = require('mongodb');

const mongoose = require('./confg/db');
const {Ticket} = require('./models/ticket');

const Employee = require('./models/employee');

const {User} = require('./models/user')
const {employeeRouter} = require('./routes/employee-router');

//user router

const {usersRouter} = require('./routes/user');



const {ticketRouter} = require('./routes/ticket-router')



const app = express();
const port = 3000;


//middlewares


app.use(bodyParser.json());
app.use(morgan('dev'));
//app.param is also middleware
app.param('id',(req,res,next) => {
    if(!ObjectId.isValid(req.params.id)) {
            res.send({
                notice:'Invalid id'
            });
        }
    next();
    
});

app.use('/tickets',ticketRouter);
app.use('/employees',employeeRouter);
app.use('/users',usersRouter);





app.listen(port,() => {
    console.log('listening to port ',port);
})