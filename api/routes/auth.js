const router = require("express").Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js")

// for veryfing if the user, cart, order belongs to client or not 
// this can also be used in updation of information
const jwt = require("jsonwebtoken");


// //REGISTER
// router.post("/register", async(req, res)=> {
//     const newUser = new User({
//         username: req.body.username,
//         email: req.body.email,
//         password: req.body.pasword,
//     });

//     // to save the data to our DB we use save () but it is async function as
//     // const savedUser = newUser.save();
//     // console.log(savedUser);
//     // it will not log anything as the function try to immediate log saveduser and it ake scouples of sec to do so
//     // that why we use async function

//     //200 is used for succesfully edit
//     //500 is used for error
//     try{
//       const savedUser = await newUser.save();
//         res.status(201).json(saveduser)
//     }catch(err){
//         res.status(500).json(err);
//     }
    
// }); 

//REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      //now there is a neccesisity to encrypt our password by using crypto js
      password: CryptoJS.AES.encrypt(
        req.body.password, 
        process.env.PASS_SEC
        ).toString(),
    });
  
    try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  //LOGIN
router.post("/login", async(req, res) => {
    try{
        const user = await User.findOne({username: req.body.username});
        !user && res.status(401).json("wrong credentials!")
        const hashPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const OrignalPassword = hashPassword.toString(CryptoJS.enc.Utf8);
        OrignalPassword !==req.body.password && res.status(401).json("wrong password!");


        //creatin JWT
        const accessToken = jwt.sign({
            //for mainly upsation or deletion we will use two properties id and isAdmin
            id:user._id,
            isAdmin: user.isAdmin,
        }, //secret key
            process.env.JWT_SEC,
            {expiresIn: "3d"}
            //after 3 days we have to login again
        )

        //as we dont want to send password info
        //and in mongodb it send in the object _doc
        const{password, ...others} = user._doc;

        res.status(200).json({...others, accessToken});

    } catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;