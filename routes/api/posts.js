const express = require("express");
const router = express.Router();

//@Routes  GET api/posts/test --- GET request to the address
//@desc    Tests post route   --- gives the description of what it does
//@access  Public             --- some routes are going to be protected but access is public route

//each router we create will have this kind of header

router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

module.exports = router;
