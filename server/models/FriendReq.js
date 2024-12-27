import mongoose from 'mongoose'

const Req = new mongoose.Schema({
    sender : {
        type:mongoose.Schema.Types.ObjectId
    },
    receiver :{
        type:mongoose.Schema.Types.ObjectId
    }
})

const Request = mongoose.model("Request",Req) 

export default Request