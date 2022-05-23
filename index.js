const express = require("express");
const cors = require('cors');
const app =express();
app.use(cors());

const PORT = 7000;

const AuthRoutes = require('./Routes/AuthRoutes');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

mongoose.connect(
    process.env.DB_CONNECTION,{
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    ()=>{console.log('connected to DB')}
);

//middleware 
app.use(express.json());
app.use('/api/grades', AuthRoutes);



app.listen(PORT, ()=>console.log(`server running on port : ${PORT}`))