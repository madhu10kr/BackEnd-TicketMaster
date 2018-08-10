const mongoose = require('mongoose');//it returns object
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/ticketmaster');//we are calling methods on mongoose

module.exports = mongoose;