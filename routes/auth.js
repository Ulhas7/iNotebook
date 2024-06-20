const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')


const JWT_SECRET = 'harryisagood&boy' 

//ROUTE 1:-create aUser using :Post "/api/auth/createuser"  no login required
router.post(
  "/createuser",
  [
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("password", "password must be 5 character").isLength({ min: 5 }),
    body("email", "enter a valid email").isEmail(),
  ],
  async (req, res) => {
    let success = false;
    //if there are error return the bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,error: errors.array() });
    }

    try {
      //check wether the userwith this email  exist if exist return error
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,error: "sorry the user with this email already exist " });
      }

      //if email not exist he create one that why async function used
      const salt = await bcrypt.genSaltSync(10);
      const secPass =  await bcrypt.hash(req.body.password,salt)
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user:{
        id:user.id
        }
      }
     const authtoken=  jwt.sign(data,JWT_SECRET);

      // res.json(user);
      success = true
      res.json({success,authtoken})

    } catch (error) {
      console.error(error.message);
      res.status(500).send('error in auth in route 1')

    }
  }
);

// ROUTE 2:- Authenticate a user using :POST '/api/auth/login'.no log in required
router.post(
  "/login",
  [
    body("password", "cannot be null").exists(),
    body("email", "enter a valid email").isEmail(),
  ],
  async (req, res) => {
let success=false

    //if there are error return the bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const {email,password} = req.body;
    try{
      let user = await User.findOne({email})
      if(!user){
        return res.status(400).json({error:"Please try to logIN with correct credential"})

      }

      const passwordCompare = await bcrypt.compare(password,user.password);
      if(!passwordCompare){
        success=false
        return res.status(400).json({success,error:"Please try to logIN with correct credential"})
      }
      const data = {
        user:{
        id:user.id
        }
      }
      const authtoken= jwt.sign(data,JWT_SECRET);
      success = true
      res.json({success,authtoken})

    } catch(error){
      console.error(error.message);
      res.status(500).send('error in auth in route 2 ')
    }

  })
   
// ROUTE 3:- Get loggedin user detail using :POST '/api/auth/getuser'. log in required

router.post( "/getuser",fetchuser, async (req, res) => {
try {
  const userId = req.user.id
  const user = await User.findById(userId).select("'password")
  res.send(user)

} catch (error) {

  console.error(error.message);
  res.status(500).send('error in auth in route 3 ')
}

  });


module.exports = router;
