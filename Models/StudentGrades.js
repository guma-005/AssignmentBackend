const string = require('@hapi/joi/lib/types/string');
const mongoose = require('mongoose');

const studentGradeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:6,
        max:10,
        },
       
    maths:{
         type:Number, 
         required:true,
        
        },
        science:{
            type:Number, 
            required:true,
           
           },
           english:{
            type:Number, 
            required:true,
           
           },
           dutch:{
            type:Number, 
            required:true,
           
           },
           grade:{
            type:Number, 
            required:true,
           
           }
    }
);

module.exports = mongoose.model("StudentGrades",studentGradeSchema);