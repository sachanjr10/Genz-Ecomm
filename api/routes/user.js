const { query } = require("express");
const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

//express is basically used to establish a server 
const router = require("express").Router();

// router.get("/usertest", (req, res) => {
//     res.send("user test is successull")
// })


// router.post("/userposttest", (req, res) => {

//     //in bosy we share the information about different things 
//     //use example done by postman
//     const username = req.body.username;
//     res.send("your username is "+ username);

// })

//put is used to do some updation

router.put("/:id", verifyTokenAndAuthorization, async(req, res) => {

    if(req.body.password){
            req.body.password = CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SEC
            ).toString();
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true})
        res.status(200).json(updatedUser);

    } catch(err){
        res.status(500).json(err);
    }
    
})

//delete
router.delete("/:id", verifyTokenAndAuthorization, async(req, res)=> {
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted...")
    }catch(err){
        res.status(500).json(err)
    }
})

//get all user
router.get("/", verifyTokenAndAdmin, async(req, res)=> {
    const quert = req.query.new;
    try{
        const users = query
        ? await User.find().sort({_id: -1}).limit(5)
        : await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err)
    }
})

//get user stats
//for example how many user joined the site

router.get("/stats", verifyTokenAndAdmin, async(req, res) => {

    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));


    try{

        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {
                $project: {
                    month: {$month: "$createdAt"}, //tale out the month number from the createdAt
                }
            },
            {
                $group:{
                    _id: "$month",
                    total:{$sum:1}, //sum all the users
                }
            }
        ])
        res.status(200).json(data);

    }catch(err){

        res.status(500).json(err);

    }
})



// we are exporting router


module.exports = router