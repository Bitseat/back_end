const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/* Defining collection for Employees */ 
let Business = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    mobile_number: {
        type: String
    },
    designation: {
        type: Array
    },
    degree: {
        type: Array
    },
    skills: {
        type: Array
    },
    
    experience: {
        type: Array
    },
    avatar:{
        type: Array
    }
},
    {
        collection: 'users'
    });

    module.exports = mongoose.model('Business', Business);