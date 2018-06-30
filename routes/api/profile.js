const express = require("express");
const router = express.Router();


//@Routes  GET api/profile/test --- GET request to the address
//@desc    Tests profile route   --- gives the description of what it does
//@access  Public             --- some routes are going to be protected but access is public route
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

module.exports = router;
