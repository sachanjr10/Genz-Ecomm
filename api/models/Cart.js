const mongoose = require("mongoose")


const CartSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    products:[
        {
            productid:{
                type:String,
            },
            quantity: {
                type:Number,
                default: 1,
            }
        }
    ]
    
    
},
//to find created at time
{timestamps: true}
);

module.exports = mongoose.model("Cart", CartSchema);