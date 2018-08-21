const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const _ = require('lodash');

const { ObjectId} = require('mongodb');

const mongoose = require('./confg/db-employee');

const Employee = require('./models/employee');
const {employeeRouter} = require('./routes/employee-router')

const app = express();
const port = 3001;


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
app.use('/employees',employeeRouter);





app.listen(port,() => {
    console.log('listening to port ',port);
})