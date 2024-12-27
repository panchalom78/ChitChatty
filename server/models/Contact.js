import mongoose from "mongoose";

const contact = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
});

const Contact = mongoose.model("Contact",contact)

export default Contact