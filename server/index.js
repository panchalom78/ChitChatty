import express from "express"
import {createServer} from "node:http"
import {Server} from 'socket.io'   
import cors from 'cors'
import route from './routes/auth.js'
import bodyParser from 'body-parser'
import msgRoute from './routes/message.js'
import { addMessage } from "./controllers/messageController.js"
import { handelRequest } from "./controllers/requestController.js"
import { getUserData } from "./controllers/authController.js"
import connectDb from './db.js'
import path from 'path'


const port = 3000;

const app = express();
app.use(cors())

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5174",
        methods:["GET","POST"],
        credentials: true
    }
})

const __dirname = path.resolve()

connectDb();

global.users = new Map()
io.on("connection",(socket)=>{
    console.log("User connected");
    console.log(socket.id); 
    
    socket.on("addUser",({id})=>{
        console.log("id = ",id);
        
        users.set(id,socket.id)
    })

    socket.on("send-msg",({msg,sender,receiver})=>{
        const id = users.get(receiver.id)
        socket.to(id).emit("add-msg",{msg,id:sender.id})
        addMessage(msg,sender.id,receiver.id)   
    })

    function find(id){
        for (let [key, val] of users.entries()) {
            if (val == id) {
              return key;
            }
          }
    }

    socket.on('disconnect',()=>{
        const key = find(socket.id)
        console.log(key,socket.id);
        
        users.delete(key)

    })

    socket.on("sendReq",({sender,receiver})=>{
        const id = users.get(receiver)
        if(id){
            console.log("Hello");
            socket.to(id).emit("addReq",{sender})
        }
    })

    socket.on("handelReq",async ({user,friend,val})=>{
       await handelRequest(user,friend,val)
       if(val){
        const id = users.get(friend)    
        if(id){
            console.log("Hello");
            const data = await getUserData(user)
            console.log(data);
            
            socket.to(id).emit("addContact",{id:data._id,name:data.Username,profile:data.ProfilePic,aboutme:data.AboutMe})
        }
       }
    })

    socket.on("sendImage",({msg,sender,receiver})=>{
        const id = users.get(receiver)
        socket.to(id).emit("addImage",{msg,id:sender})
    })
    
})

app.use(route)
app.use(msgRoute)

if(process.env.NODE_ENV !== 'production'){
    app.use(express.static(path.join(__dirname, '../client/dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client','dist', 'index.html'))
    })
}

server.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})
