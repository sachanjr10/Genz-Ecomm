const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotnev = require("dotenv");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");


//imp to deploy
const path = require('path')

//cors
const cors = require("cors");

dotnev.config();

mongoose.connect(
    process.env.MONGO_URL
).then(()=>console.log("DBConnection Successfull!"))
.catch((err) => {
    console.log(err);
})

app.use(cors());
//for alowwing to take json
app.use(express.json());
//Creating rest API
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

//imp for deploy
//static files
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(process.env.PORT || 5000, ()=>{
    console.log("Backend server is runing!");
});