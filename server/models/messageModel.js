import mongoose from 'mongoose' 
const message = mongoose.Schema({
    msg:{
        type:String,
        required:true,
    },
    users:{
        type:Array
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    isImage:{
        type:Boolean,
        default:false
    }
})

const Messages = mongoose.model("Messages",message)

export default Messages