const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    department:{
        type: String,
        required: true
    },
    code:{
        type: String
    },
    priority:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    status:{
        type: String,
        default: 'open'
    },
    createdAt:{
        type: Date,
        dafault: Date.now
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'employee'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

//don't define static or instance methods using arrow functions
//because this keyword is not available in es6/arrrow functions

//static methods
//this is model/class
ticketSchema.statics.openTickets = function () {
    return this.find({status: 'open'});
};

ticketSchema.statics.completedTickets = function () {
    return this.find({status: 'completed'});
};

ticketSchema.statics.findByPriority = function (priority) {
    return this.find({priority: priority});
};

//call back functions
//pre/post is a method calls based on 'save' before/after
ticketSchema.pre('save',function(next) {
    if(!this.code){
        this.code = 'DCT-'+this._id.toString().slice(12);
    }
    next();
});

const Ticket = mongoose.model('Tickets',ticketSchema);//this moongoose model makes Ticket a class with ticketSchema blueprint on Tickets collection

module.exports = {
    Ticket//class
};