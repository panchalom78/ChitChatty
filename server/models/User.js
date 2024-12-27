
import mongoose from 'mongoose'


const user = new mongoose.Schema({
    Email : String,
    Username : String,
    Password : String,
    AboutMe  : String,
    ProfilePic : String
})
 
const User = new mongoose.model("User",user)

export default User