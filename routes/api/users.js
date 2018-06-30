const express=require('express');
const router= express.Router();
const gravatar= require('gravatar');
const bcrypt =require ('bcryptjs');
const jwt =require('jsonwebtoken');
//defining variables from dependencies to be used later 
const keys= require('../../config/keys');
const passport= require('passport');

//Load User Model
//then we can use 'User' for any mongoose method that it has
const User= require('../../models/Users.js');

//res.json send the data like objects and res.send sends just like that a string itself

//@Routes  GET api/users/test --- GET request to the address
//@desc    Tests users route   --- gives the description of what it does
//@access  Public             --- some routes are going to be protected but access is public route
router.get('/test', (req, res)=> res.json({msg: 'User Works'}));

//@Routes  GET api/users/register
//@desc    Register user  
//@access  Public       

//finOne() will check if db contains any such already present email
// we'll send objects in it where we say we wanna find an email that matches 
// hen we send data to the route thru a post request which will ultimately be in a form in a react application 
// or here postman, in either ay we acess it with req.body.whateverforminputname  
router.post('/register', (req,res)=> {
User.findOne({ email: req.body.email})
.then(user => {
    if(user){
        return res.status(400).json({email: 'Email already exists'});
    }
    else
    {
        const avatar=gravatar.url(req.body.email, {
            s:'200', //size
            r:'pg', //Rating
            d:'mm', // Default
        });
    const newUser= new User({
        name: req.body.name,
        email:req.body.email,
        avatar,
        password: req.body.password
    });

    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if(err) throw err;
            newUser.password=hash;

            newUser.save()
            .then(user=>res.json(user))
            .catch(err=> console.log(err));
        });
    });
}
});
});


//@Routes  GET api/users/login
//@desc   login user /Returing JWT token 
//@access  Public   

router.post('/login',(req, res)=>{
    const email= req.body.email;
    const password = req.body.password;

    //Find user by email
    User.findOne({email})  //can write (email: email) since they have the same name so written once
    .then(user=>{
        if(!user){
            return res.status(404).json({email:'User email not found'});
            
        }

         //check password 
         //since hashed password saved in databse so using bcrypt to get the string value
         bcrypt.compare(password,user.password).then(isMatch=>{

            if(isMatch){
                //User matched            
                const payload= { id: user.id , name: user.name, avatar: user.avatar}//created jwt payload

                 //Sign token
                jwt.sign(
                payload,
                keys.secretOrKey,
                {expiresIn: 3600} , 
                (err, token)=> {
                res.json({
                    success:true,
                    token: 'Bearer' +token
                });
        });
             }
             else{
                 return res.status(404).json({password: 'Password Incorrect'});
             }

         });
             
         
        
    });
});

//@Routes  GET api/users/current
//@desc    Return current user  
//@access  Private
router.get(
    '/current', 
    passport.authenticate('jwt', {session: false}), (req,res)=>{
    res.json({
        id:req.user.id,
        name:req.user.name,
        email: req.user.email
    });
}
); 

module.exports=router;