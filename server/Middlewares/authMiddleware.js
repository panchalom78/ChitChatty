import jwt from 'jsonwebtoken'
const authMiddleware = (req,res,next) => {
    const token = req.cookies.token
    if(token){
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            console.log("token id ",decoded.id);
            req.user = decoded.id;  // storing user id in req for further use in routes
            next();        
        }catch(e){
            console.log("Invalid token");
        }
    }
    else{
        console.log("No token found");
        res.status(401).json({error:"No token, authorization denied"})
    }    
}

export default authMiddleware;
