const express =require('express');
const mongoose =require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const users= require('./routes/api/users');
const profile=require('./routes/api/profile');
const posts=require('./routes/api/posts')

const app= express();

//body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//DB Config
const db=require( './config/keys.js'  ).mongoURI;

//Connect to MongoDB through mongoose
// .then() is basically if theres a sucess we'll just print in console
// if theres an error then we use .catch()
//.then() and .catch() javascript promises
mongoose
.connect(db)
.then(()=> console.log("MongoDB Connected") )
.catch(err=>console.log(err));

//res.send send the response like a string but res.json send like objects
//app.get('/', (req, res)=> res.send ('Hello World Chai Peelo!') );

app.use(passport.initialize());

//Passport Config
require('./config/passport')(passport);

//USE ROUTES
app.use('/api/users', users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);


const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server running on port ${port}`));