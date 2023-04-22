//this is after the product is been choosed

const mongoose = require("mongoose")


const OrderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    products:[
        {
            productid:{
                type:String,
            },
            quantity: {
                type:Number,
                default: 1,
            },
        },
    ],

    amount: {type:Number, required: true},
    address: {type:Object, required: true},
    strings: {type:String, default: "pending"},

    
    
},
//to find created at time
{timestamps: true}
);

module.exports = mongoose.model("Order", OrderSchema);