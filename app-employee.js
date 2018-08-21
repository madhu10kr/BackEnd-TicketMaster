const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const _ = require('lodash');

const { ObjectId} = require('mongodb');

const mongoose = require('./confg/db-employee');

const Employee = require('./models/employee');

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

//route handlers

app.get('/',(req,res) => {
    res.send({
        msg:'Welcome to Employee details'
    })
});

app.get('/employees',(req,res) => {
    Employee.find().then(employee => res.send(employee)).catch(err => res.send(err));
});

app.post('/employees',(req,res) => {
    let employee = new Employee(req.body);
    employee.save().then(employee => res.send(employee)).catch(err => res.send(err));
});

app.get('/employees/list',(req,res) => {
    let sort = req.query.sort;
    let order = req.query.order;


    let params ={};
    let orderBy = order == 'ASC' ? 1:-1;
    params[sort] = orderBy;
    Employee.find().sort(params).then(employee => res.send(employee)).catch(err => res.send(err));


    // if(order == 'ASC'){
    //     Employee.find().sort({sort:1}).then(employee => res.send(employee)).catch(err => res.send(err));
    // } else if(order == 'DESC'){
    //     Employee.find().sort({sort:-1}).then(employee => res.send(employee)).catch(err => res.send(err));
    // }
    
});

app.get('/employees/listByAge',(req,res) => {
    let min = req.query.min;
    let max = req.query.max;
    Employee.where('ageWhileJoining').gte(max).lte(min).then(employee => res.send(employee)).catch(err => res.send(err));
})

app.get('/employees/:id',(req,res) => {
    Employee.findById(req.params.id).then((employee) => {
        if(employee){
            res.send(employee);
        } else{
            res.send({
                notice:'employee not found'
            });
        }
    }).catch(err => res.send(err));
});

//nested route handles
app.get('/employees/:id/mobile_numbers',(req,res) => {
    let id = req.params.id;
    Employee.findById(id).select(['name','_id','mobileNumbers']).then(employee => {
        if(employee){
            res.send(employee);
        }
        res.send({
            notice: 'Employess not found'
        })
    }).catch(err => res.send(err))
});

app.post('/employees/:id/mobile_numbers',(req,res) => {
    let id = req.params.id;
    let body = req.body;
    Employee.findById(id).then(employee => {
        if(employee){
            let newMobile = body;
            employee.mobileNumbers.push(body);//it is pushing from express level
            employee.save().then(employee => {//now it is saving in db level
                res.send({
                    newMobile,
                    notice:'Sucessfully created'
                })
            })
        } else {
            res.send({
                notice:'Employee not found'
            })
        }
    })
});

app.put('/employees/:id/mobile_numbers/:mobile_id',(req,res) => {
    let id = req.params.id;
    let mobileId = req.params.mobile_id;
    let body = _.pick(req.body,['numType','mobileNumber']);
    Employee.findById(id).then((employee) => {
        if(employee){
            let mobileDetails = employee.mobileNumbers.id(mobileId);
            mobileDetails.numType = body.numType ? body.numType : mobileDetails.numType;
            mobileDetails.mobileNumber = body.mobileNumber ? body.mobileNumber : mobileDetails.mobileNumber;
            return employee.save()
        }
        res.send({
            notice:'employee not found'
        })
    }).then(employee => {
        res.send({
            mobileNumber: employee.mobileNumbers.id(mobileId),
            notice: 'successfully updated'
        })
    }).catch(err => res.send(err))
})

app.delete('/employees/:id/mobile_numbers/:mobile_id',(req,res) => {
    let id = req.params.id;
    let mobileId = req.params.mobile_id;
    Employee.findById(id).then((employee) => {
        if(employee){
            employee.mobileNumbers.remove(mobileId);
            return employee.save()
        }
        res.send({
            notice:'employee not found'
        })
    }).then(employee => {
        res.send({
            notice: 'successfully deleted'
        })
    }).catch(err => res.send(err))
})

app.put('/employees/:id',(req,res) => {
    Employee.findByIdAndUpdate(req.params.id,{$set: req.body},{new: true}).then((employee) => {
        if(employee){
            res.send({
                employee,
                notice:'sucessfully updated'
            });
        } else{
            res.send({
                notice:'employee not found'
            });
        }
    }).catch(err => res.send(err));
});

app.delete('/employees/:id',(req,res) => {
    Employee.findByIdAndRemove(req.params.id).then((employee) => {
        if(employee){
            res.send({
                employee,
                notice:'sucessfully deleted'
            });
        } else{
            res.send({
                notice:'employee not found'
            });
        }
    }).catch(err => res.send(err));
});



app.listen(port,() => {
    console.log('listening to port ',port);
})