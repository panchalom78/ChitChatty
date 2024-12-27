import Messages from "../models/messageModel.js";

async function getMessages(req,res,next){
    try{
        const {to,from} = req.body
        const data = await Messages.find({users:{$all : [from,to]}},{users:0})
        
        res.json(data)
    }catch(ex){
        next(ex)
    }
}

async function addMessage(msg,sender,receiver) {
    const data = await Messages.create({msg:msg,users:[sender,receiver],sender:sender})
    console.log(data);
}

async function addImage(img,sender,receiver) {
    const data = await Messages.create({msg:img,users:[sender,receiver],sender:sender,isImage:true})
    console.log(data)
}

export {getMessages,addMessage,addImage}

