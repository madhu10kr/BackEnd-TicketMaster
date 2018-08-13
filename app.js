const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { ObjectId} = require('mongodb');

const mongoose = require('./confg/db');
const {Ticket} = require('./models/ticket');

const app = express();
const port = 3000;


//middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/tickets/:id',(req,res,next) => {
    if(!ObjectId.isValid(req.params.id)) {
        res.send({
            notice:'Invlaid id'
        });
    } else {
        next();
    }
});

//route handlers

app.get('/',(req,res) => {
    res.send({
        msg:'Welcome to ticket master'
    })
});

app.get('/tickets',(req,res) => {
    Ticket.find().then((tickets) => {
        res.send(tickets);
    })
    .catch((err) => {
        res.send(err);
    })
});

app.post('/tickets',(req,res) => {
    let ticket = new Ticket(req.body);//req.body is an obj
    ticket.save().then((ticket) => {
        res.send(ticket);
    })
    .catch((err) => {
        res.send(err);
    })
});

app.get('/tickets/:id',(req,res) => {
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

app.put('/tickets/:id',(req,res) => {
    //findByIdAndUpdate takes 3 arguments(id,{$set: },{new: })
    //$set: is an operator for updating new fields also
    //new: is used to get updated object
    Ticket.findByIdAndUpdate(req.params.id,{ $set: req.body},{ new: true})
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

app.delete('/tickets/:id',(req,res) => {
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

app.listen(port,() => {
    console.log('listening to port ',port);
})