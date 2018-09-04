const express = require('express');

const Employee = require('../models/employee');

const router = express.Router();
const _ = require('lodash');




router.get('/',(req,res) => {
    Employee.find().then(employee => res.send(employee)).catch(err => res.send(err));
});

router.post('/',(req,res) => {
    let employee = new Employee(req.body);
    employee.save().then(employee => res.send(employee)).catch(err => res.send(err));
});

router.get('/list',(req,res) => {
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

router.get('/listByAge',(req,res) => {
    let min = req.query.min;
    let max = req.query.max;
    Employee.where('ageWhileJoining').gte(max).lte(min).then(employee => res.send(employee)).catch(err => res.send(err));
})

router.get('/:id',(req,res) => {
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

router.get('/:id/shortinfo',(req,res) => {
    Employee.findById(req.params.id).then(employee => {
        res.send(employee.shortInfo());
    })
});

////*********/performing instance/object method in array
router.get('/show/short_info',(req,res) => {
    Employee.find().then(employees => {
        // let result =[];
        // for(let emp of employees){
        //     result.push(emp.shortInfo())
        // }
        // res.send(result);
        res.send(employees.map(emp => emp.shortInfo()));
    }).catch(err => res.send(err))
});

//nested route handles
router.get('/:id/mobile_numbers',(req,res) => {
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

router.post('/:id/mobile_numbers',(req,res) => {
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


/////custom validations on put*****
//we have to use **runValidators
router.put('/:id',(req,res) => {
    let id = req.params.id;
    let body = req.body;
    Employee.findByIdAndUpdate(id,{ $set: body},{new:true, runValidators: true})
    .then(employee => {
        res.send(employee);
    }).catch(err => res.send(err));
})

router.post('/:id/mobile_numbers',(req,res) =>{
    let id = req.params.id;
    let body = _.pick(req.body,['numType','mobileNumber']);

    Employee.findById(id).then(employee => {
        
        if(employee){
            employee.mobileNumbers.push(body);
            return employee.save()
        }
        res.send({
            notice:'employee not found'
        })
    }).then(employee => {
        res.send({
            mobileNumber: employee.mobileNumbers,
            notice: 'successfully updated'
        })
    }).catch(err => res.send(err))
})


router.put('/:id/mobile_numbers/:mobile_id',(req,res) => {
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

router.delete('/:id/mobile_numbers/:mobile_id',(req,res) => {
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
});

// router.delete('/:id/mobile_numbers/:moble_number',(req,res) => {
//     let id = req.params.id;
//     let num = req.params.mobile_number;
//     Employee.findById(id).then((employee) => {
//         if(employee){
//             employee.mobileNumbers.remove(num);
//             return employee.save()
//         }
//         res.send({
//             notice:'employee not found'
//         })
//     }).then(employee => {
//         res.send({
//             notice: 'successfully deleted'
//         })
//     }).catch(err => res.send(err))
// });

router.put('/:id',(req,res) => {
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

router.delete('/:id',(req,res) => {
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

module.exports = {
    employeeRouter:router
};