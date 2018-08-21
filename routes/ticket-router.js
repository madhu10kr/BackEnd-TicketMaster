const express = require('express');

const {Ticket} = require('../models/ticket');

const router = express.Router();

const _ = require('lodash');

router.get('/',(req,res) => {
    Ticket.find().then((tickets) => {
        res.send(tickets);
    })
    .catch((err) => {
        res.send(err);
    })
});

router.post('/',(req,res) => {
    let body = _.pick(req.body,['name','department','message','priority']);
    let ticket = new Ticket(body);//req.body is an obj
    ticket.save().then((ticket) => {
        res.send(ticket);
    })
    .catch((err) => {
        res.send(err);
    })
});

router.get('/:id',(req,res) => {
    //it is checking for valid id or not

    // if(!ObjectId.isValid(req.params.id)) {
    //     res.send({
    //         notice:'Invlaid id'
    //     });
    // }
    Ticket.findById(req.params.id)
    //it is checking wheather the ticket is truely available or not
    .then((ticket) => {
        if(ticket){
            res.send(ticket);
        } else{
            res.send({
                notice:'Ticket not found'
            });
        }
    })
    .catch((err) => {
        res.send(err);
    })
});

router.put('/:id',(req,res) => {

    //strong parameters= we are eliminating/ignoring some parameters for security or unnecessary errors
    let body = _.pick(req.body,['name','department','message','priority','status']);
    //findByIdAndUpdate takes 3 arguments(id,{$set: },{new: })
    //$set: is an operator for updating new fields also
    //new: is used to get updated object
    Ticket.findByIdAndUpdate(req.params.id,{ $set: body},{ new: true})
    .then((ticket) => {
         if(ticket){
            res.send({
                ticket,
                msg:'sucessfully updated'
            });
        } else{
            res.send({
                notice:'Ticket not found'
            });
        }
    })
    .catch((err) => {
        res.send(err);
    })
});

router.delete('/:id',(req,res) => {
    Ticket.findByIdAndRemove(req.params.id)
    .then((ticket) => {
        if(ticket){
            res.send({
                ticket,
                msg:'sucessfully deleted'
            });
        } else{
            res.send({
                notice:'Ticket not found'
            });
        }
    })
    .catch((err) => {
        res.send(err);
    })
});

module.exports = {
    ticketRouter:router
};
