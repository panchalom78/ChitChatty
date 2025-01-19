import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.IS_PRODUCTION==='yes' ? process.env.MONGO_LOCAL : process.env.MONGO_URI
 
function connectDb(){
    try{
        mongoose.connect(url);
        console.log("Database connected successfully");
    }
    catch(err){
        console.log(err.message);
    }
}

export default connectDb;           