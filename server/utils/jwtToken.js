import jwt from 'jsonwebtoken'

const generateToken = (payload)=>{
    const token = jwt.sign({id:payload},process.env.JWT_SECRET,{expiresIn:'2h'})
    return token;
}

export default generateToken;