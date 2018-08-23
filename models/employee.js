const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    name: {
        type: String,
        required: true,

        //custom validations
        //validator return true/false
        validate: {
            validator: function(value) {
                return /^[a-zA-Z ]*$/.test(value);
            },
            message:function(props) {
                return `${props.path} must contain alphabets`
            }
        }
    },
    email:{
        type: String,
        required:true,
        validate:{
            validator:function(value) {
                return  /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
            },
            message:function(props) {
                return `${props.path} is not valid`
            }
        }
    },
    department: {
        type: String,
        enum: ['Technical','Sales','Hr'],
        required: true
    },
    salary: {
        type: Number,
        require:true,
        validate:{
            validator:function(value) {
                return value >= 10000;
            },
            message:function(props) {
                return `salary should >= 10000`
            }
        }
    },
    ageWhileJoining: {
        type: Number,
        min: 18,
        max: 65
    },
    address: {
        street: {
            type: String
        },
        city: {
            type: String
        },
        pinCode: {
            type: Number
        }
    },
    hobbies: [ String ],//['singing','reading','drawing']
    luckyNumbers: [ Number ],//[4,6,77,2]
    mobileNumbers: [
        {
            numType: {
                type: String
            },
            mobileNumber: {
                type: String
            }
        }
    ]
});

//static methods

//employeeSchema.statics.method name

//object methods
//this refers to the object
employeeSchema.methods.shortInfo = function () {
    return {
        _id:this.id,
        name:this.name,
        email:this.email,
        numCount:this.mobileNumbers.length
    };
};
const Employee = mongoose.model('employee', employeeSchema);

module.exports = Employee;