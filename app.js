const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const mongoose = require('./confg/db');
const {Ticket} = require('./models/ticket');

const app = express();
const port = 3000;


//middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));

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
    let ticket = new Ticket(req.body);
    ticket.save().then((ticket) => {
        res.send(ticket);
    })
    .catch((err) => {
        res.send(err);
    })
});

app.get('/tickets/:id',(req,res) => {
    Ticket.findById(req.params.id)
    .then((ticket) => {
        res.send(ticket);
    })
    .catch((err) => {
        res.send(err);
    })
});

app.put('/tickets/:id',(req,res) => {
    Ticket.findByIdAndUpdate(req.params.id,req.body)
    .then((ticket) => {
        res.send(ticket);
    })
    .catch((err) => {
        res.send(err);
    })
});

app.delete('/tickets/:id',(req,res) => {
    Ticket.findByIdAndRemove(req.params.id)
    .then((ticket) => {
        res.send({
            ticket,
            msg:'sucessfully deleted'
        });
    })
    .catch((err) => {
        res.send(err);
    })
});

app.listen(port,() => {
    console.log('listening to port ',port);
})