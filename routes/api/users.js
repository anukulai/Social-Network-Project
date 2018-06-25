const express=require('express');
const router= express.Router();

//res.json send the data like objects and res.send sends just like that a string itself
router.get('/test', (req, res)=> res.json({msg: 'User Works'}));

module.exports=router;