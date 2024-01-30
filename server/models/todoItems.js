//import mongooes to create new schema
const mongoose = require('mongoose');

//create Schema
const TodoItemSchema = new mongoose.Schema({
    item:{
        type:String,
        required: true
    },
    description: {
        type: String,
        // required: true
        // Add any additional validation or options if needed
    },
    
})


//export this Schema
module.exports = mongoose.model('todo', TodoItemSchema, );