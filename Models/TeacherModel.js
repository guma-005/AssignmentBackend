const string = require('@hapi/joi/lib/types/string');
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:6,
        max:10,
        },
    password:{
         type:String, 
         required:true,
         min:6,
         max:10, 
        }
    }
);

module.exports = mongoose.model("Teachers",teacherSchema);